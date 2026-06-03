<template>
    <div style="position: relative; min-height: 320px;">
        <!-- Overlay spinner: position absolute não desloca o layout -->
        <Transition name="category-fade">
            <div v-if="isLoading" class="shop-page-category__loader-overlay" aria-hidden="true">
                <BlockLoader />
            </div>
        </Transition>

        <div :style="isLoading ? 'visibility: hidden; pointer-events: none;' : ''">
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
                        :sidebar-button-label="sidebarButtonLabel"
                        @openSidebar="sidebarIsOpen = true"
                    />
                </template>
                <template v-slot:textoSeo>
                    <div v-if="textoSeo" ref="seoContent" class="categoria-seo" style="margin-top: 25px" v-html="textoSeo" />
                </template>
            </CategoryLayout>
        </div>
    </div>
</template>

<style scoped>
.shop-page-category__loader-overlay {
    position: absolute;
    inset: 0;
    z-index: 10;
    background: #fff;
    min-height: 320px;
}
.category-fade-enter-active,
.category-fade-leave-active {
    transition: opacity 0.15s ease;
}
.category-fade-enter-from,
.category-fade-leave-to {
    opacity: 0;
}
</style>

<script setup lang="ts">
import { ref, computed, watch, onMounted, onBeforeUnmount } from 'vue'
import qs from 'query-string'
import type { IProduct } from '~/interfaces/product'
import type { ILink } from '~/interfaces/menus/link'
import type { ICategory } from '~/interfaces/category'
import { getCategoryParents } from '~/services/helpers'
import shopApi from '~/api/shop'
import { useShopStore } from '~/stores/shop'
import { useEcommerceTracking, toGA4Item } from '~/composables/useEcommerceTracking'

export type ShopPageCategoryColumns = 3 | 4 | 5 | 6;
export type ShopPageCategoryViewMode = 'grid' | 'grid-with-features' | 'list';
export type ShopPageCategorySidebarPosition = 'start' | 'end';

const props = withDefaults(defineProps<{
    columns?: ShopPageCategoryColumns
    viewMode?: ShopPageCategoryViewMode
    sidebarPosition?: ShopPageCategorySidebarPosition
    breadcrumbParent?: { title: string; url: string }
    canonicalPath?: string
}>(), {
    columns: 3,
    viewMode: 'grid',
    sidebarPosition: 'start',
})

const url = useUrl()
const shopStore = useShopStore()
const tracking = useEcommerceTracking()

const sidebarIsOpen = ref<boolean>(false)
const latestProducts = ref<IProduct[]>([])
const isMounted = ref(false)

const isLoading = computed(() => shopStore.isLoading)
const category = computed<ICategory | null>(() => shopStore.category)
const query = computed<string>(() => shopStore.query)

const offcanvas = computed(() => props.columns === 3 ? 'mobile' : 'always')
const sidebarButtonLabel = computed(() => props.columns === 6 ? 'Modo Sidebar' : 'Filtros')

const productsViewGrid = computed(() => `grid-${props.columns}-${props.columns > 3 ? 'full' : 'sidebar'}`)

const description = computed(() => {
    if (category.value) return category.value.meta_description
    return ''
})

const textoSeo = computed(() => {
    if (category.value)
        return category.value.texto_seo
})

const seoContent = ref<HTMLElement | null>(null)

function getCollapseTargets(trigger: HTMLElement) {
    return (trigger.getAttribute('data-bs-target') || trigger.getAttribute('data-target') || '')
        .split(',')
        .map((selector) => selector.trim())
        .filter(Boolean)
        .map((selector) => document.querySelector<HTMLElement>(selector))
        .filter(Boolean) as HTMLElement[]
}

function toggleCollapseElement(element: HTMLElement, trigger: HTMLElement) {
    const isOpen = element.classList.contains('show')
    if (isOpen) {
        element.classList.remove('show')
        element.style.display = 'none'
        trigger.classList.add('collapsed')
        trigger.setAttribute('aria-expanded', 'false')
    } else {
        const parentSelector = element.getAttribute('data-bs-parent') || element.getAttribute('data-parent')
        if (parentSelector) {
            const parent = document.querySelector<HTMLElement>(parentSelector)
            if (parent) {
                parent.querySelectorAll<HTMLElement>('.collapse.show').forEach((sibling) => {
                    if (sibling !== element) {
                        sibling.classList.remove('show')
                        sibling.style.display = 'none'
                        const parentTrigger = seoContent.value?.querySelector<HTMLElement>(`[data-bs-target="#${sibling.id}"],[data-target="#${sibling.id}"]`)
                        if (parentTrigger) {
                            parentTrigger.classList.add('collapsed')
                            parentTrigger.setAttribute('aria-expanded', 'false')
                        }
                    }
                })
            }
        }

        element.classList.add('show')
        element.style.display = 'block'
        trigger.classList.remove('collapsed')
        trigger.setAttribute('aria-expanded', 'true')
    }
}

function handleSeoClick(event: Event) {
    const target = event.target as HTMLElement
    if (!target) return

    const trigger = target.closest<HTMLElement>('[data-bs-toggle="collapse"], [data-toggle="collapse"]')
    if (!trigger) return

    event.preventDefault()
    getCollapseTargets(trigger).forEach((element) => toggleCollapseElement(element, trigger))
}

const pageTitle = computed(() => {
    if (category.value?.name) return category.value.name
    return 'Produtos'
})

const seoTitle = computed(() => {
    if (category.value) {
        if (category.value.meta_title)
            return category.value.meta_title
        if (category.value.name)
            return category.value.name
    }
    return 'Shop'
})

const canonicalPath = computed(() => {
    if (props.canonicalPath) return props.canonicalPath
    if (category.value?.slug) return `/shop/catalog/${category.value.slug}`
    return url.catalog()
})

const breadcrumb = computed<ILink[]>(() => {
    const bread = [
        { title: 'Home', url: url.home() },
        { title: 'Shop', url: url.catalog(), hidden: true }
    ]

    if (category.value) {
        getCategoryParents(category.value).forEach((parent) => {
            bread.push({ title: parent.name, url: '/shop/' + parent.slug })
        })

        bread.push({ title: category.value.name, url: canonicalPath.value })
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

watch(() => shopStore.productsList?.items, (items) => {
    if (!import.meta.client || !items?.length) return
    const listId = `category_${shopStore.categorySlug ?? ''}`
    const listName = shopStore.category?.name ?? ''
    tracking.viewItemList(
        items.slice(0, 20).map((p, i) => toGA4Item(p, 1, p.price, i)),
        listId,
        listName
    )
})

onMounted(() => {
    isMounted.value = true
    if (offcanvas.value === 'mobile') {
        shopApi.getLatestProducts({ limit: 5 }).then((result) => {
            latestProducts.value = result
        })
    }

    if (seoContent.value) {
        seoContent.value.addEventListener('click', handleSeoClick)
    }
})

onBeforeUnmount(() => {
    if (seoContent.value) {
        seoContent.value.removeEventListener('click', handleSeoClick)
    }
})

const breadcrumbJsonLd = computed(() => {
    if (!category.value) return null
    const items: any[] = [
        { '@type': 'ListItem', position: 1, name: 'Home', item: 'https://www.hardstore.com.br/' }
    ]
    getCategoryParents(category.value).forEach((parent, i) => {
        items.push({
            '@type': 'ListItem',
            position: i + 2,
            name: parent.name,
            item: 'https://www.hardstore.com.br/shop/' + parent.slug
        })
    })
    items.push({
        '@type': 'ListItem',
        position: items.length + 1,
        name: category.value.name
    })
    return {
        '@context': 'https://schema.org',
        '@type': 'BreadcrumbList',
        itemListElement: items
    }
})

useHead(() => ({
    title: seoTitle.value,
    link: [
        { rel: 'canonical', href: `https://hardstore.com.br${canonicalPath.value}` }
    ],
    meta: [
        { name: 'description', content: description.value },
        { property: 'og:title', content: seoTitle.value },
        { property: 'og:description', content: description.value },
        { property: 'og:url', content: `https://hardstore.com.br${canonicalPath.value}` },
    ],
    script: breadcrumbJsonLd.value ? [
        { type: 'application/ld+json', innerHTML: JSON.stringify(breadcrumbJsonLd.value) }
    ] : []
}))
</script>
