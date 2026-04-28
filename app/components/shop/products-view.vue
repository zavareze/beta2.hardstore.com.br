<template>
    <div
        :class="[
            'products-view',
            {'products-view--loading': shopStore.productsListIsLoading}
        ]"
    >
        <div class="products-view__loader" />

        <div v-if="productsList.items.length === 0" class="products-view__empty">
            <div class="products-view__empty-title">
                Nenhum item encontrado com esta pesquisa
            </div>
            <div class="products-view__empty-subtitle">
                Tente limpar os filtros
            </div>
            <button
                type="button"
                class="btn btn-primary btn-sm"
                @click="shopStore.resetFilters()"
            >
                Limpar Filtros
            </button>
        </div>

        <div v-if="productsList.items.length !== 0" class="products-view__content">
            <div class="products-view__options">
                <div
                    :class="[
                        'view-options',
                        {
                            'view-options--offcanvas--always': offcanvas === 'always',
                            'view-options--offcanvas--mobile': offcanvas === 'mobile',
                        }
                    ]"
                >
                    <div class="view-options__filters-button">
                        <button type="button" class="filters-button" @click="emit('openSidebar')">
                            <Filters16Svg class="filters-button__icon" />
                            <span class="filters-button__title">Filtros</span>
                            <span v-if="filtersCount" class="filters-button__counter">{{ filtersCount }}</span>
                        </button>
                    </div>
                    <div class="view-options__layout">
                        <div class="layout-switcher">
                            <div class="layout-switcher__list">
                                <button
                                    title="Grade"
                                    :class="[
                                        'layout-switcher__button',
                                        {'layout-switcher__button--active': isViewModeActive('grid')}
                                    ]"
                                    type="button"
                                    @click="handleViewModeClick('grid')"
                                >
                                    <LayoutGrid16x16Svg />
                                </button>
                                <button
                                    title="Grade com 6 colunas"
                                    :class="[
                                        'layout-switcher__button',
                                        {'layout-switcher__button--active': isViewModeActive('grid-6')}
                                    ]"
                                    type="button"
                                    @click="handleViewModeClick('grid-6')"
                                >
                                    <LayoutGrid16x16Svg />
                                </button>
                                <button
                                    title="Grade com Descrições"
                                    :class="[
                                        'layout-switcher__button',
                                        {'layout-switcher__button--active': isViewModeActive('grid-with-features')}
                                    ]"
                                    type="button"
                                    @click="handleViewModeClick('grid-with-features')"
                                >
                                    <LayoutGridWithDetails16x16Svg />
                                </button>
                                <button
                                    title="Lista"
                                    :class="[
                                        'layout-switcher__button',
                                        {'layout-switcher__button--active': isViewModeActive('list')}
                                    ]"
                                    type="button"
                                    @click="handleViewModeClick('list')"
                                >
                                    <LayoutList16x16Svg />
                                </button>
                            </div>
                        </div>
                    </div>
                    <div class="view-options__legend">
                        Mostrando {{ productsList.from }}—{{ productsList.to }} de {{ productsList.total }} produtos
                    </div>
                    <div class="view-options__divider" />
                    <div class="view-options__control">
                        <label for="view-options-sort">Ordenar por</label>
                        <div>
                            <select
                                id="view-options-sort"
                                class="form-control form-control-sm"
                                :value="isMounted ? shopStore.orderBy : (options.sort || shopStore.orderBy)"
                                @change="handleSortChange"
                            >
                                <option value="recents_desc">
                                    Mais Recentes
                                </option>
                                <option value="price_desc">
                                    Maior Preço
                                </option>
                                <option value="price_asc">
                                    Menor Preço
                                </option>
                            </select>
                        </div>
                    </div>
                    <div class="view-options__control">
                        <label for="view-options-limit">Mostrar</label>
                        <div>
                            <select
                                id="view-options-limit"
                                class="form-control form-control-sm"
                                :value="currentShow"
                                @change="handleLimitChange"
                            >
                                <option value="6">
                                    6
                                </option>
                                <option value="12">
                                    12
                                </option>
                                <option value="18">
                                    18
                                </option>
                                <option value="24">
                                    24
                                </option>
                            </select>
                        </div>
                    </div>
                </div>
            </div>

            <div
                class="products-view__list products-list"
                :data-layout="currentLayout !== 'list' ? currentGrid : currentLayout"
                :data-with-features="currentLayout === 'grid-with-features' ? 'true' : 'false'"
                :data-mobile-grid-columns="2"
            >
                <div class="products-list__body">
                    <div v-for="(product, i) in productsList.items" :key="i" class="products-list__item">
                        <ProductCard :product="product" />
                    </div>
                </div>
            </div>

            <div class="products-view__pagination">
                <Pagination
                    :current="options.page || productsList.page"
                    :siblings="2"
                    :total="productsList.pages"
                    @page-change="handlePageChange"
                />
            </div>
        </div>
    </div>
</template>

<script setup lang="ts">
import { computed, onMounted, ref } from 'vue'
import type { IProductsList } from '~/interfaces/product'
import type { IFilterValues, IListOptions } from '~/interfaces/list'
import Filters16Svg from '~/svg/filters-16.svg'
import LayoutGrid16x16Svg from '~/svg/layout-grid-16x16.svg'
import LayoutGridWithDetails16x16Svg from '~/svg/layout-grid-with-details-16x16.svg'
import LayoutList16x16Svg from '~/svg/layout-list-16x16.svg'
import { useShopStore } from '~/stores/shop'

export type ProductsViewLayout = 'grid' | 'grid-with-features' | 'list';
export type ProductsViewGrid = 'grid-3-sidebar' | 'grid-4-full' | 'grid-5-full' | 'grid-6-full';
export type ProductsViewOffcanvas = 'always' | 'mobile';
type ViewModeKey = 'grid' | 'grid-6' | 'grid-with-features' | 'list';
const GRID_STORAGE_KEY = 'shop-products-grid'
const AVAILABLE_GRIDS: ProductsViewGrid[] = ['grid-3-sidebar', 'grid-4-full', 'grid-5-full', 'grid-6-full']

const props = withDefaults(defineProps<{
    layout?: ProductsViewLayout
    grid?: ProductsViewGrid
    offcanvas?: ProductsViewOffcanvas
}>(), {
    layout: 'grid',
    grid: 'grid-3-sidebar',
    offcanvas: 'mobile',
})

const emit = defineEmits<{ openSidebar: [] }>()

const shopStore = useShopStore()
const isMounted = ref(false)
const selectedGrid = ref<ProductsViewGrid>(props.grid)

const productsList = computed<IProductsList>(() => shopStore.productsList)
const options = computed<IListOptions>(() => shopStore.options)
const filters = computed<IFilterValues>(() => shopStore.filters)
const initialLayout = computed<ProductsViewLayout>(() => props.layout || 'grid')
const currentLayout = computed<ProductsViewLayout>(() => isMounted.value ? shopStore.layout : initialLayout.value)
const currentShow = computed<number>(() => {
    const limit = Number(options.value.limit)
    if (!isMounted.value) {
        return Number.isFinite(limit) && limit > 0 ? limit : 24
    }

    return shopStore.show
})
const currentGrid = computed<ProductsViewGrid>(() => selectedGrid.value)

const filtersCount = computed(() => {
    return Object.keys(filters.value).map(x => filters.value[x]).filter(x => x).length
})

onMounted(() => {
    const storedGrid = window.localStorage.getItem(GRID_STORAGE_KEY)

    if (storedGrid && isProductsViewGrid(storedGrid)) {
        selectedGrid.value = storedGrid
    }

    isMounted.value = true
})

function handlePageChange (page: number) {
    shopStore.setOptionValue({ option: 'page', value: page })
    try {
        window.scrollTo({ top: 0, left: 0, behavior: 'smooth' })
    } catch {
        window.scrollTo(0, 0)
    }
}

function isViewModeActive(viewMode: ViewModeKey) {
    if (viewMode === 'grid-6') {
        return currentLayout.value === 'grid' && currentGrid.value === 'grid-6-full'
    }

    if (viewMode === 'grid') {
        return currentLayout.value === 'grid' && currentGrid.value !== 'grid-6-full'
    }

    return currentLayout.value === viewMode
}

function handleViewModeClick(viewMode: ViewModeKey) {
    if (viewMode === 'grid-6') {
        shopStore.setLayout('grid')
        selectedGrid.value = 'grid-6-full'
        window.localStorage.setItem(GRID_STORAGE_KEY, 'grid-6-full')
        return
    }

    if (viewMode === 'grid') {
        selectedGrid.value = props.grid
        window.localStorage.setItem(GRID_STORAGE_KEY, props.grid)
    }

    shopStore.setLayout(viewMode)
}

function isProductsViewGrid(value: string): value is ProductsViewGrid {
    return AVAILABLE_GRIDS.includes(value as ProductsViewGrid)
}

function handleSortChange (event: Event) {
    if (!(event.target instanceof HTMLSelectElement)) {
        return
    }
    shopStore.setOrderBy(event.target.value)
    shopStore.setOptionValue({ option: 'sort', value: event.target.value })
}

function handleLimitChange (event: Event) {
    if (!(event.target instanceof HTMLSelectElement)) {
        return
    }
    shopStore.setShow(event.target.value)
    shopStore.setOptionValue({ option: 'limit', value: parseFloat(event.target.value) })
}
</script>
