import { defineEventHandler, getQuery } from 'h3'
import { existsSync } from 'node:fs'
import { createPool } from 'mysql2/promise'

interface BannerRecord {
    slot_key: string
    title: string | null
    subtitle: string | null
    image_desktop: string
    image_mobile: string | null
    link_url: string
}

const pool = createPool({
    host: 'localhost',
    user: 'sistema',
    password: 'y!dQvj@xM5h!.wtS2Kcn',
    database: 'hardstore',
    waitForConnections: true,
    connectionLimit: 4,
    charset: 'utf8'
})

function getSingleQueryValue(value: unknown) {
    if (Array.isArray(value)) {
        return typeof value[0] === 'string' ? value[0] : ''
    }

    return typeof value === 'string' ? value : ''
}

function normalizePageKey(value: unknown) {
    const pageKey = getSingleQueryValue(value).trim()

    return /^[a-z0-9-]{1,50}$/i.test(pageKey) ? pageKey : 'home'
}

function normalizeImagePath(value: string | null) {
    const image = (value || '').trim()

    if (!image) {
        return ''
    }

    const path = image.startsWith('/') ? image : `/images/banners/${image}`
    const webpPath = path.replace(/\.(png|jpe?g)$/i, '.webp')

    if (webpPath !== path && existsSync(`/dominios/beta2.hardstore.com.br/public${webpPath}`)) {
        return webpPath
    }

    return path
}

export default defineCachedEventHandler(async (event) => {
    const pageKey = normalizePageKey(getQuery(event).page)

    const [rows] = await pool.query(
        `SELECT slot_key, title, subtitle, image_desktop, image_mobile, link_url
         FROM site_banners
         WHERE page_key = ?
           AND is_active = 1
           AND (start_at IS NULL OR start_at <= NOW())
           AND (end_at IS NULL OR end_at >= NOW())
         ORDER BY slot_key ASC,
                  CASE WHEN sort_order IS NULL THEN 1 ELSE 0 END ASC,
                  sort_order ASC,
                  id_banner ASC`,
        [pageKey]
    )

    const payload = {
        page: pageKey,
        heroSlides: [] as Array<{
            title: string
            text: string
            imageClassic: string
            imageFull: string
            imageMobile: string
            url: string
        }>,
        sectionBanners: {} as Record<string, { img: string, mobile: string, url: string }>
    }

    for (const record of rows as BannerRecord[]) {
        const desktop = normalizeImagePath(record.image_desktop)
        const mobile = normalizeImagePath(record.image_mobile || record.image_desktop)

        if (record.slot_key === 'hero-home') {
            payload.heroSlides.push({
                title: record.title || ' ',
                text: record.subtitle || ' ',
                imageClassic: desktop,
                imageFull: desktop,
                imageMobile: mobile,
                url: record.link_url
            })
            continue
        }

        if (payload.sectionBanners[record.slot_key]) {
            continue
        }

        payload.sectionBanners[record.slot_key] = {
            img: desktop,
            mobile,
            url: record.link_url
        }
    }

    return {
        statusCode: 200,
        status: 'success',
        message: '',
        data: payload
    }
}, {
    maxAge: 300,
    getKey: (event) => `banners-${normalizePageKey(getQuery(event).page)}`
})
