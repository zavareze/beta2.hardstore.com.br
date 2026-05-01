/* eslint-disable @typescript-eslint/no-unused-vars,arrow-body-style */
// noinspection ES6UnusedImports
// import qs from 'query-string';
import type { IShopCategory } from '~/interfaces/category'
import type { IProduct, IProductsList } from '~/interfaces/product'

export interface GetCategoriesOptions {
    depth?: number;
}

export interface GetCategoryBySlugOptions {
    depth?: number;
}

export interface GetRelatedProductsOptions {
    limit?: number;
}

export interface GetProductsOptions {
    limit?: number;
    category?: string;
}

export type GetSuggestionsOptions = {
    limit?: number;
    category?: string;
};

function emptyVideoListResponse() {
    return {
        statusCode: 200,
        status: 'success',
        message: '',
        data: {
            videos: [] as any[],
            tags: [] as any[]
        }
    }
}

function emptyProductsResponse() {
    return [] as IProduct[]
}

function logStorefrontError(error: any, extra: Record<string, unknown>) {
    if (process.server) {
        console.error('[shopApi] storefront request failed', {
            ...extra,
            message: error?.message || 'Unknown request error'
        })
    }
}

function fetchStorefront<T>(query: Record<string, string | number | undefined>, fallbackFactory: () => T): Promise<T> {
    return $fetch<T>('/api/storefront', { query }).catch((error) => {
        logStorefrontError(error, {
            resource: query.resource,
            collection: query.collection,
            category: query.category,
            limit: query.limit
        })

        return fallbackFactory()
    })
}

function findCategoryBySlug(categoryList: any[], slug: string): any {
    for (const category of categoryList || []) {
        if (category?.slug === slug) {
            return category
        }

        const child = findCategoryBySlug(category?.children || [], slug)
        if (child) {
            return child
        }
    }

    return null
}

function findCategoryById(categoryList: any[], id: number): any {
    for (const category of categoryList || []) {
        if (Number(category?.id) === Number(id)) {
            return category
        }

        const child = findCategoryById(category?.children || [], id)
        if (child) {
            return child
        }
    }

    return null
}

function getProductsListUrl(params: Record<string, unknown>) {
    return `https://api.hardstore.com.br/api/produtos?${JSON.stringify(params)}`
}

async function fetchProductsListPage(params: Record<string, unknown>): Promise<IProductsList> {
    return fetch(getProductsListUrl(params)).then(response => response.json())
}

async function fetchProductsListWithRequestedLimit(options: any, filters: any): Promise<IProductsList> {
    const params = { ...options, ...filters }
    const requestedLimit = Number(options.limit)
    const requestedPage = Number(options.page || 1)
    const productsList = await fetchProductsListPage(params)
    const apiLimit = Number(productsList.limit)

    if (
        !Number.isFinite(requestedLimit) ||
        requestedLimit <= 0 ||
        !Number.isFinite(apiLimit) ||
        apiLimit <= 0 ||
        requestedLimit <= apiLimit
    ) {
        return productsList
    }

    const offset = (requestedPage - 1) * requestedLimit
    const firstApiPage = Math.floor(offset / apiLimit) + 1
    const offsetWithinFirstApiPage = offset % apiLimit
    const apiPagesToFetch = Math.ceil((offsetWithinFirstApiPage + requestedLimit) / apiLimit)
    const pageNumbers = Array.from({ length: apiPagesToFetch }, (_, index) => firstApiPage + index)

    const apiPages = await Promise.all(pageNumbers.map((page) => {
        return page === Number(productsList.page)
            ? productsList
            : fetchProductsListPage({ ...params, page })
    }))

    const items = apiPages
        .flatMap(page => page.items || [])
        .slice(offsetWithinFirstApiPage, offsetWithinFirstApiPage + requestedLimit)

    const total = Number(productsList.total) || 0

    return {
        ...productsList,
        items,
        page: requestedPage,
        limit: requestedLimit,
        pages: Math.ceil(total / requestedLimit),
        from: total > 0 ? offset + 1 : 0,
        to: Math.min(offset + items.length, total)
    }
}

const shopApi = {
    getVideoList: () => {
        return fetchStorefront({ resource: 'videos' }, emptyVideoListResponse)
    },
    getVideoPlaylist: (payload) => {
        if (!payload.playlist)
            payload.playlist = 'all'
        if (!payload.tag)
            payload.tag = ''
        if (!payload.search)
            payload.search = ''
            
        return fetch('https://api.hardstore.com.br/api/videos?'+JSON.stringify(payload)).then(response => response.json())
    },
    getMaxDiscount: () => {
        return fetchStorefront({ resource: 'config' }, () => ({ maxDiscount: 15 }))
    },
    getPlayList: () => {
        return fetch('https://api.hardstore.com.br/servless/playlist.json').then(response => response.json())
    },
    getComments: () => {
        return fetch('https://api.hardstore.com.br/servless/comments.json').then(response => response.json())
    },
    getCategoryList: () => {
        return fetchStorefront({ resource: 'categories' }, () => [])
    },
    getBrandList: () => {
        return fetch('https://api.hardstore.com.br/servless/fabricantes.json').then(response => response.json())
    },
    /**
     * Returns category by slug.
     */
    getCategoryBySlug: (categoryList:any, slug: string, options: GetCategoryBySlugOptions = {}): Promise<IShopCategory> => {
        const category = findCategoryBySlug(categoryList, slug)
        if (category && category.pai > 0) {
            const parent = shopApi.getParent(categoryList, category.pai)
            if (parent) {
                category.parent = parent
            }
        }
        return category
    },
    // SEM USO FIND NESTED
    findChildren: (source: any[], slug:string):any => {
        for (let key in source) {
            let item = source[key]
            if (item.slug === slug)
                return item
            if (item.children) {
                let subresult = shopApi.findChildren(item.children, slug)
                if (subresult)
                    return subresult
            }
        }
        return null
    },
    getParent: (categoryList: any, pai:number) => {
        const category = findCategoryById(categoryList, pai)
        if (!category) {
            return null
        }
        if (category.pai > 0) {
            const parent = shopApi.getParent(categoryList, category.pai)
            category.parent = parent
        }
        return category
    },
    getChildren: (categoryList: any, pai:number) => {
        const category = categoryList.filter((x:any) => x.pai === pai)
        if (!category.length) {
            const parent = findCategoryById(categoryList, pai)
            if (parent?.children?.length) {
                category.push(...parent.children)
            }
        }
        for (let i = 0; i < category.length; i++) {
            category[i].type = 'link'
            category[i].title = category[i].name
            category[i].url = category[i].slug
            const children = shopApi.getChildren(categoryList, category[i].id)
            if (children) {
                category[i].children = children
            }
        }
        return category
    },
    getProductsList: (options: any, filters: any): Promise<IProductsList> => {
        return fetchProductsListWithRequestedLimit(options, filters)
    },
    getProductBySlug: (slug: string): Promise<IProduct> => {
        return fetch(`https://api.hardstore.com.br/api/produto/${slug}`).then(response => response.json())
    },
    getProductById: (id: string): Promise<any> => {
        return fetch(`https://api.hardstore.com.br/api/produto/id/${id}`).then(response => response.json())
    },
    getSuggestions: (query: string, options: any): Promise<IProduct[]> => {
        const params = { ...options, search: query }
        return fetch(`https://api.hardstore.com.br/api/produtos?${JSON.stringify(params)}`).then(r => r.json().then(x => x.items || []))
    },
    getRelatedProducts: (slug: string, options: any): Promise<IProduct[]> => {
        const params = { category: slug, ...options }
        return fetch(`https://api.hardstore.com.br/api/produtos?${JSON.stringify(params)}`).then(r => r.json().then(x => x.items))
    },
    getPopularProducts: (options: any = {}): Promise<IProduct[]> => {
        return fetchStorefront({
            resource: 'products',
            collection: 'popular',
            limit: options.limit,
            category: options.category
        }, emptyProductsResponse)
    },
    getLatestProducts: (options: any): Promise<IProduct[]> => {
        return fetchStorefront({
            resource: 'products',
            collection: 'latest',
            limit: options.limit,
            category: options.category
        }, emptyProductsResponse)
    },
    getFeaturedProducts: (options: any): Promise<IProduct[]> => {
        return fetchStorefront({
            resource: 'products',
            collection: 'featured',
            limit: options.limit,
            category: options.category
        }, emptyProductsResponse)
    },
    getTopRatedProducts: (options: any): Promise<IProduct[]> => {
        return fetchStorefront({
            resource: 'products',
            collection: 'topRated',
            limit: options.limit,
            category: options.category
        }, emptyProductsResponse)
    },
    getDiscountedProducts: (options: any): Promise<IProduct[]> => {
        return fetchStorefront({
            resource: 'products',
            collection: 'discount',
            limit: options.limit,
            category: options.category
        }, emptyProductsResponse)
    },
    checkAvaiability: (payload) => {
        return fetch(`https://api.hardstore.com.br/api/stock/${payload}`).then(r => r.json())
    }
}

export default shopApi
