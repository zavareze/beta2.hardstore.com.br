import { defineEventHandler, getQuery } from 'h3'
import { fetchHardstoreJson } from '../utils/hardstore-upstream'

const productCollections = {
    featured: '/api/produtos/destaques',
    latest: '/api/produtos/novidades',
    popular: '/api/produtos/bestsellers',
    discount: '/api/produtos/discount',
    topRated: '/api/produtos/novidades'
} as const

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

export default defineEventHandler(async (event) => {
    const query = getQuery(event)
    const resource = getSingleQueryValue(query.resource)

    if (resource === 'videos') {
        return await fetchHardstoreJson('storefront:videos', '/api/videos', emptyVideosResponse)
    }

    if (resource === 'config') {
        return await fetchHardstoreJson('storefront:config', '/servless/config.json', () => ({ maxDiscount: 15 }))
    }

    if (resource === 'categories') {
        return await fetchHardstoreJson('storefront:categories', '/servless/categorias.json', () => [])
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
})
