<template>
    <div>
        <BlockLoader v-if="isLoading" />

        <template v-if="!isLoading">
            <PageHeader :title="pageTitle" :breadcrumb="breadcrumb" />

            <CategoryLayout
                :columns="columns"
                :sidebar-position="sidebarPosition"
            >
                <template v-slot:sidebar>
                    <CategorySidebar
                        :is-open="sidebarIsOpen"
                        :offcanvas="offcanvas"
                        @closeSidebar="sidebarIsOpen = false"
                    >
                        <CategorySidebarItem>
                            <ClientOnly>
                                <WidgetFilters title="Filtros" :offcanvas="offcanvas" style="background-color: rgba(255, 255, 255, 0.9);" />
                            </ClientOnly>
                        </CategorySidebarItem>
                        <CategorySidebarItem v-if="offcanvas !== 'always'" class="d-none d-lg-block">
                            <WidgetProducts title="Visualizados Recentemente" :products="isMounted ? shopStore.lastViewed : []" />
                        </CategorySidebarItem>
                    </CategorySidebar>
                </template>

                <template v-slot:productsView>
                    <ProductsView
                        :layout="viewMode"
                        :grid="productsViewGrid"
                        :offcanvas="offcanvas"
                        @openSidebar="sidebarIsOpen = true"
                    />
                </template>
                <template v-slot:textoSeo>
                    <ClientOnly>
                        <div v-if="textoSeo" class="categoria-seo" v-html="textoSeo" />
                    </ClientOnly>
                </template>
            </CategoryLayout>
        </template>
    </div>
</template>

<script setup lang="ts">
import { ref, computed, watch } from 'vue'
import qs from 'query-string'
import type { IProduct } from '~/interfaces/product'
import type { ILink } from '~/interfaces/menus/link'
import type { ICategory } from '~/interfaces/category'
import { getCategoryParents } from '~/services/helpers'
import shopApi from '~/api/shop'
import { useShopStore } from '~/stores/shop'

export type ShopPageCategoryColumns = 3 | 4 | 5;
export type ShopPageCategoryViewMode = 'grid' | 'grid-with-features' | 'list';
export type ShopPageCategorySidebarPosition = 'start' | 'end';

const props = withDefaults(defineProps<{
    columns?: ShopPageCategoryColumns
    viewMode?: ShopPageCategoryViewMode
    sidebarPosition?: ShopPageCategorySidebarPosition
}>(), {
    columns: 3,
    viewMode: 'grid',
    sidebarPosition: 'start',
})

const url = useUrl()
const shopStore = useShopStore()

const sidebarIsOpen = ref<boolean>(false)
const latestProducts = ref<IProduct[]>([])
const isMounted = ref(false)

const isLoading = computed(() => shopStore.isLoading)
const category = computed<ICategory | null>(() => shopStore.category)
const query = computed<string>(() => shopStore.query)

const offcanvas = computed(() => props.columns === 3 ? 'mobile' : 'always')

const productsViewGrid = computed(() => `grid-${props.columns}-${props.columns > 3 ? 'full' : 'sidebar'}`)

const description = computed(() => {
    if (category.value)
        return category.value.meta_description
    return ''
})

const textoSeo = computed(() => {
    if (category.value)
        return category.value.texto_seo
})

const pageTitle = computed(() => {
    if (category.value) {
        if (category.value.meta_title)
            return category.value.meta_title
        if (category.value.name)
            return category.value.name
    }
    return 'Shop'
})

const breadcrumb = computed<ILink[]>(() => {
    const bread = [
        { title: 'Home', url: url.home() },
        { title: 'Shop', url: url.catalog() }
    ]

    if (category.value) {
        getCategoryParents(category.value).forEach((parent) => {
            bread.push({ title: parent.name, url: '/shop/' + parent.slug })
        })

        bread.push({ title: category.value.name, url: '/shop/' + category.value.slug })
    }

    return bread
})

watch(query, (q: string) => {
    if (!import.meta.client) return
    const href = qs.stringifyUrl({
        ...qs.parseUrl(window.location.href),
        query: qs.parse(q)
    }, { encode: false })

    window.history.replaceState(
        window.history.state,
        '',
        href
    )
})

onMounted(() => {
    isMounted.value = true
    if (offcanvas.value === 'mobile') {
        shopApi.getLatestProducts({ limit: 5 }).then((result) => {
            latestProducts.value = result
        })
    }
})

useHead(() => ({
    title: pageTitle.value,
    meta: [
        { name: 'description', content: description.value }
    ]
}))
</script>
