import { getQuery } from 'h3'
import { readFile } from 'node:fs/promises'
import { fetchHardstoreJson } from '../utils/hardstore-upstream'

const productCollections = {
    featured: '/api/produtos/destaques',
    latest: '/api/produtos/novidades',
    popular: '/api/produtos/bestsellers',
    discount: '/api/produtos/discount',
    topRated: '/api/produtos/novidades'
} as const

const LOCAL_CATEGORIES_FILE = '/dominios/api.hardstore.com.br/www/servless/categorias.json'

function getSingleQueryValue(value: unknown) {
    if (Array.isArray(value)) {
        return typeof value[0] === 'string' ? value[0] : ''
    }

    return typeof value === 'string' ? value : ''
}

function normalizeLimit(value: unknown, defaultValue: number) {
    const parsed = Number.parseInt(getSingleQueryValue(value), 10)

    if (!Number.isFinite(parsed)) {
        return defaultValue
    }

    return Math.min(Math.max(parsed, 1), 24)
}

function normalizeCategory(value: unknown) {
    const category = getSingleQueryValue(value).trim()

    if (!category || category.length > 120) {
        return ''
    }

    return /^[a-z0-9-]+$/i.test(category) ? category : ''
}

function emptyVideosResponse() {
    return {
        statusCode: 200,
        status: 'success',
        message: '',
        data: {
            videos: [],
            tags: []
        }
    }
}

async function readLocalCategories() {
    const contents = await readFile(LOCAL_CATEGORIES_FILE, 'utf8')
    const categories = JSON.parse(contents)

    return Array.isArray(categories) ? categories : []
}

export default defineCachedEventHandler(async (event) => {
    const query = getQuery(event)
    const resource = getSingleQueryValue(query.resource)

    if (resource === 'videos') {
        return await fetchHardstoreJson('storefront:videos', '/api/videos', emptyVideosResponse)
    }

    if (resource === 'config') {
        return await fetchHardstoreJson('storefront:config', '/servless/config.json', () => ({ maxDiscount: 15 }))
    }

    if (resource === 'categories') {
        try {
            return await readLocalCategories()
        } catch (error: any) {
            console.error('[storefront] local categories read failed', {
                path: LOCAL_CATEGORIES_FILE,
                message: error?.message || 'Unknown file read error'
            })

            const response = await fetchHardstoreJson<any>(
                'storefront:categories',
                'https://sistemaci3.hardstore.com.br/api/servless/categorias/0',
                () => []
            )

            return Array.isArray(response?.data) ? response.data : response
        }
    }

    if (resource === 'products') {
        const collection = getSingleQueryValue(query.collection) as keyof typeof productCollections
        const path = productCollections[collection]

        if (!path) {
            console.warn('[storefront] invalid product collection', { collection })
            return []
        }

        const limit = normalizeLimit(query.limit, 8)
        const category = normalizeCategory(query.category)

        return await fetchHardstoreJson(
            `storefront:products:${collection}`,
            path,
            () => [],
            {
                limit,
                category
            }
        )
    }

    console.warn('[storefront] invalid resource', { resource })
    return null
}, {
    maxAge: 60,
    getKey: (event) => {
        const q = getQuery(event)
        const resource = getSingleQueryValue(q.resource)
        const collection = getSingleQueryValue(q.collection)
        const limit = getSingleQueryValue(q.limit)
        const category = getSingleQueryValue(q.category)
        return `storefront-${resource}-${collection}-${limit}-${category}`
    }
})
