import { readFile } from 'node:fs/promises'
import mysql from 'mysql2/promise'

const SITE_URL = 'https://hardstore.com.br'
const LOCAL_CATEGORIES_FILE = '/dominios/api.hardstore.com.br/www/servless/categorias.json'
const CACHE_TTL_MS = 60 * 60 * 1000 // 1 hora

// Credenciais do banco vêm de runtimeConfig.db (nuxt.config.ts <- .env). Ver useRuntimeConfig() abaixo.

interface Category {
    id: number
    pai: number
    slug: string
}

const STATIC_URLS: Array<{ loc: string; priority: string; changefreq: string }> = [
    { loc: '/',                      priority: '1.0', changefreq: 'daily' },
    { loc: '/computadores',          priority: '0.8', changefreq: 'weekly' },
    { loc: '/computadores/pc-gamer', priority: '0.8', changefreq: 'weekly' },
    { loc: '/shop',                  priority: '0.7', changefreq: 'daily' },
    { loc: '/site/about-us',         priority: '0.4', changefreq: 'monthly' },
    { loc: '/site/contato',          priority: '0.5', changefreq: 'monthly' },
    { loc: '/site/faq',              priority: '0.5', changefreq: 'monthly' },
    { loc: '/site/privacy',          priority: '0.3', changefreq: 'yearly' },
    { loc: '/site/terms',            priority: '0.3', changefreq: 'yearly' },
]

let cachedSlugs: string[] | null = null
let cacheExpiresAt = 0

async function fetchProductSlugsFromDB(): Promise<string[]> {
    if (cachedSlugs && Date.now() < cacheExpiresAt) {
        return cachedSlugs
    }

    const { db } = useRuntimeConfig()
    const conn = await mysql.createConnection({ ...db, connectTimeout: 15000 })
    try {
        const [rows] = await conn.execute<mysql.RowDataPacket[]>(
            "SELECT url_amigavel FROM produtos WHERE situacao = '' AND url_amigavel != ''",
        )
        cachedSlugs = rows.map((r) => r.url_amigavel as string)
        cacheExpiresAt = Date.now() + CACHE_TTL_MS
        return cachedSlugs
    } finally {
        await conn.end()
    }
}

function buildXml(entries: Array<{ loc: string; priority: string; changefreq: string }>) {
    const today = new Date().toISOString().slice(0, 10)
    const urls = entries
        .map(
            (e) =>
                `  <url>\n    <loc>${SITE_URL}${e.loc}</loc>\n    <lastmod>${today}</lastmod>\n    <changefreq>${e.changefreq}</changefreq>\n    <priority>${e.priority}</priority>\n  </url>`,
        )
        .join('\n')

    return `<?xml version="1.0" encoding="UTF-8"?>\n<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">\n${urls}\n</urlset>`
}

export default defineEventHandler(async (event) => {
    setHeader(event, 'Content-Type', 'application/xml; charset=utf-8')
    setHeader(event, 'Cache-Control', 'public, max-age=3600, s-maxage=3600')

    const [categories, productSlugs] = await Promise.all([
        readFile(LOCAL_CATEGORIES_FILE, 'utf8')
            .then((c) => JSON.parse(c) as Category[])
            .catch(() => [] as Category[]),
        fetchProductSlugsFromDB().catch(() => [] as string[]),
    ])

    const categoryEntries = categories
        .filter((c) => c.slug)
        .map((c) => ({
            loc: `/shop/catalog/${c.slug}`,
            priority: c.pai === 0 ? '0.8' : '0.6',
            changefreq: 'weekly',
        }))

    const productEntries = productSlugs.map((slug) => ({
        loc: `/shop/products/${slug}`,
        priority: '0.7',
        changefreq: 'daily',
    }))

    const allEntries = [...STATIC_URLS, ...categoryEntries, ...productEntries]

    return buildXml(allEntries)
})
