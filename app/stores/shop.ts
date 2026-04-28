import { defineStore } from 'pinia'
import piniaPluginPersistedstate from 'pinia-plugin-persistedstate'
import type { ICategory, IShopCategory } from '~/interfaces/category'
import type { IProductsList } from '~/interfaces/product'
import type { IFilterValues, IListOptions } from '~/interfaces/list'
import { buildQuery } from '~/services/helpers'
import shopApi from '~/api/shop'

export const useShopStore = defineStore('shop', {
    state: () => ({
        init: false,
        categorySlug: null as string | null,
        categoryIsLoading: true,
        category: null as ICategory | null,
        productsListIsLoading: true,
        productsList: null as IProductsList | null,
        options: {} as IListOptions,
        filters: {} as IFilterValues,
        query: '',
        categoryList: null as any,
        rootCategoryList: null as any,
        categoryListMobile: [] as any[],
        categoryPCGamer: [{ id: 1, name: 'Todos', categorySlug: 'pc-gamer', current: true }] as any[],
        categoryNotebooksComputers: [] as any[],
        categoryPromo: [
            { id: 1, name: 'Todos', categorySlug: 'promocao', current: true },
            { id: 2, name: 'Cadeira Gamer', categorySlug: 'cadeira-gamer', current: false }
        ] as any[],
        categoryDestaques: [] as any[],
        categoryPopular: [] as any[],
        models: null as any,
        submodels: null as any,
        terms: null as any,
        brands: null as any,
        fff: null as any,
        videos: {
            videos: [] as any[],
            tags: [] as any[]
        } as any,
        layout: 'list',
        orderBy: 'price_asc',
        show: 24,
        lastViewed: [] as any[],
        maxDiscount: 15
    }),
    getters: {
        isLoading: (state) => state.categoryIsLoading || (state.productsListIsLoading && !state.productsList),
        productsListFilters: (state) => state.productsList?.filters
    },
    actions: {
        async init(payload: { categorySlug: string | null; options: IListOptions; filters: IFilterValues }) {
            this.options.page = 1
            this.categorySlug = payload.categorySlug
            this.filters = payload.filters
            await this.fetchMaxDiscount()
            await this.fetchCategory({ categorySlug: payload.categorySlug })
            await this.fetchBrand()
            await this.fetchProductsList()
        },
        async fetchMaxDiscount() {
            const config = await shopApi.getMaxDiscount()
            this.maxDiscount = Number.isFinite(Number(config?.maxDiscount))
                ? Number(config.maxDiscount)
                : 15
        },
        async fetchCategory(payload: { categorySlug: string | null }) {
            if (!this.categoryList) {
                const categoryList = await shopApi.getCategoryList()
                this.categoryList = categoryList

                const mobileMenu = await shopApi.getChildren(this.categoryList, 0)
                this.rootCategoryList = mobileMenu
                this.categoryListMobile = mobileMenu

                const menuPCGamer = await shopApi.getChildren(this.categoryList, 42)
                const pcMenu: any[] = [{ id: 1, name: 'Todos', categorySlug: 'pc-gamer', current: true }]
                menuPCGamer.forEach((item: any, i: number) => {
                    pcMenu.push({ id: i + 2, name: item.name, categorySlug: item.slug, current: false })
                })
                this.categoryPCGamer = pcMenu
            }

            // Sempre recalcular a partir do categoryList (cache ou fresco) — sem chamada de API
            this.categoryPromo = [
                { id: 1, name: 'Todos', categorySlug: 'promocao', current: true },
                { id: 2, name: 'Cadeira Gamer', categorySlug: 'cadeira-gamer', current: false }
            ]

            const notebooks: any[] = []
            this.categoryList.forEach((x: any) => {
                if ([40, 41, 58].includes(x.id)) notebooks.push({ id: notebooks.length + 1, name: x.name, categorySlug: x.slug, current: notebooks.length === 0 })
            })
            this.categoryNotebooksComputers = notebooks

            const destaques: any[] = []
            this.categoryList.forEach((x: any) => {
                if ([52, 58, 60].includes(x.id)) destaques.push({ id: destaques.length + 1, name: x.name, categorySlug: x.slug, current: destaques.length === 0 })
            })
            this.categoryDestaques = destaques

            const popular: any[] = []
            this.categoryList.forEach((x: any) => {
                if ([8, 9, 42].includes(x.id)) popular.push(x)
            })
            popular.forEach((x: any) => x.children?.sort((a: any, b: any) => a.popular - b.popular))
            this.categoryPopular = popular

            const category = payload.categorySlug
                ? await shopApi.getCategoryBySlug(this.categoryList, payload.categorySlug)
                : null

            this.init = true
            this.categoryIsLoading = false
            this.category = category
        },
        async fetchBrand() {
            if (!this.brands) {
                this.brands = await shopApi.getBrandList()
            }
        },
        async fetchProductsList() {
            this.productsListIsLoading = true
            this.query = buildQuery(this.options, this.filters)

            const filters = this.categorySlug
                ? { ...this.filters, category: this.categorySlug }
                : { ...this.filters }

            const productsList = await shopApi.getProductsList(this.options, filters)
            this.productsListIsLoading = false
            this.productsList = productsList
        },
        async setOptionValue(payload: { option: keyof IListOptions; value: string | number }) {
            this.options.page = 1
            this.options[payload.option] = payload.value as any
            await this.fetchProductsList()
        },
        async setFilterValue(payload: { filter: string; value: string | null }) {
            if (payload.value === null) {
                delete (this.filters as any)[payload.filter]
            } else {
                (this.filters as any)[payload.filter] = payload.value;
                (this.filters as any)['last'] = payload.filter
            }
            this.options.page = 1
            await this.fetchProductsList()
        },
        async resetFilters() {
            this.filters = {}
            this.options.page = 1
            await this.fetchProductsList()
        },
        async fetchYoutube() {
            const x = await shopApi.getVideoList()
            this.videos = {
                videos: Array.isArray(x?.data?.videos) ? x.data.videos : [],
                tags: Array.isArray(x?.data?.tags) ? x.data.tags : []
            }
            return x
        },
        async fetchYoutubePlaylist(payload: any) {
            const x = await shopApi.getVideoPlaylist(payload)
            this.videos = {
                videos: Array.isArray(x?.data?.videos) ? x.data.videos : [],
                tags: Array.isArray(x?.data?.tags) ? x.data.tags : []
            }
            return x
        },
        fetchPlaylist: () => shopApi.getPlayList(),
        fetchComments: () => shopApi.getComments(),
        fetchViewed(payload: any) {
            if (!this.lastViewed.find(x => x.id === payload.id)) {
                this.lastViewed.unshift(payload)
                this.lastViewed = this.lastViewed.slice(0, 5)
            }
        }
    },
    persist: {
        storage: piniaPluginPersistedstate.localStorage,
        pick: ['categoryList', 'brands', 'lastViewed', 'layout', 'orderBy', 'show']
    }
})
