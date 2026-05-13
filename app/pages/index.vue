<template>
    <div>
        <BlockSlideshow layout="with-departments" :slides-data="homeHeroSlides" />

        <BlockFeatures />

        <BlockProductsCarouselContainer
            v-slot:default="{ products, isLoading, tabs, handleTabChange }"
            :tabs="shop.categoryPromo"
            :initial-data="featuredProductsPromo"
            :data-source="featuredProductsSource"
        >
            <BlockProductsCarousel
                title="Ofertas Especiais"
                layout="grid-4"
                :products="products"
                :loading="isLoading"
                :groups="tabs"
                @groupClick="handleTabChange"
            />
        </BlockProductsCarouselContainer>

        <BlockBanner v-if="homeSectionBanner1" :data="homeSectionBanner1" />

        <BlockProductsCarouselContainer
            v-slot:default="{ products, isLoading, tabs, handleTabChange }"
            :tabs="shop.categoryPCGamer"
            :initial-data="featuredProductsPCGamer"
            :data-source="featuredProductsSource"
        >
            <BlockProductsCarousel
                title="Computador Gamer"
                layout="grid-4"
                :products="products"
                :loading="isLoading"
                :groups="tabs"
                @groupClick="handleTabChange"
            />
        </BlockProductsCarouselContainer>
        <BlockBanner v-if="homeSectionBanner2" :data="homeSectionBanner2" />

        <BlockProductsCarouselContainer
            v-slot:default="{ products, isLoading, tabs, handleTabChange }"
            :tabs="shop.categoryNotebooksComputers"
            :initial-data="featuredProductsNotebooks"
            :data-source="featuredProductsSource"
        >
            <BlockProductsCarousel
                title="Notebooks / Computadores"
                layout="grid-4"
                :products="products"
                :loading="isLoading"
                :groups="tabs"
                @groupClick="handleTabChange"
            />
        </BlockProductsCarouselContainer>

        <BlockBanner v-if="homeSectionBanner3" :data="homeSectionBanner3" />

        <BlockProductsCarouselContainer
            v-slot:default="{ products, isLoading, tabs, handleTabChange }"
            :tabs="shop.categoryDestaques"
            :initial-data="featuredProductsComputadores"
            :data-source="featuredProductsSource"
        >
            <BlockProductsCarousel
                title="Produtos em Destaque"
                layout="grid-4"
                :products="products"
                :loading="isLoading"
                :groups="tabs"
                @groupClick="handleTabChange"
            />
        </BlockProductsCarouselContainer>

        <BlockBanner v-if="homeSectionBanner4" :data="homeSectionBanner4" />

        <BlockProducts
            title="Mais Vendidos"
            layout="large-first"
            :featured-product="(bestsellers || [])[0]"
            :products="(bestsellers || []).slice(1, 7)"
        />

        <BlockCategories
            title="Categorias Populares"
            layout="classic"
            :categories="shop.categoryPopular"
        />

        <BlockProductsCarouselContainer
            v-slot:default="{ products, isLoading, tabs, handleTabChange }"
            :tabs="[
                { id: 1, name: 'Todos', categorySlug: '' },
                { id: 2, name: 'PC Gamer', categorySlug: 'pc-gamer' },
                { id: 3, name: 'Computadores', categorySlug: 'home-office' },
                { id: 4, name: 'Notebooks', categorySlug: 'notebooks' },
                { id: 5, name: 'Placas de Vídeo', categorySlug: 'placa-video' }
            ]"
            :initial-data="featuredProducts"
            :data-source="latestProductsSource"
        >
            <BlockProductsCarousel
                title="Novidades"
                layout="horizontal"
                :rows="2"
                :products="products"
                :loading="isLoading"
                :groups="tabs"
                @groupClick="handleTabChange"
            />
        </BlockProductsCarouselContainer>

        <BlockPosts
            title="Hardstore TV News"
            layout="list"
            :posts="videoPosts"
        />

        <BlockBrands />

        <BlockProductColumns :columns="columns" />
    </div>
</template>

<script setup lang="ts">
import shopApi from '~/api/shop'
import type { BlockProductColumnsItem } from '~/interfaces/components'
import { useShopStore } from '~/stores/shop'
import { useOptionsStore } from '~/stores/options'

const shop = useShopStore()
const options = useOptionsStore()

options.setHeaderLayout('default')
options.setDropcartType('dropdown')

type HomeHeroSlide = {
    title: string
    text: string
    imageClassic: string
    imageFull: string
    imageMobile: string
    url: string
}

type HomeSectionBanner = {
    img: string
    mobile: string
    url: string
}

async function loadColumns () {
    const topRated = shopApi.getTopRatedProducts({ limit: 3 })
    const specialOffers = shopApi.getDiscountedProducts({ limit: 3 })
    const bestsellers = shopApi.getPopularProducts({ limit: 3 })
    return [
        { title: 'Melhores Avaliações', products: (await topRated).slice(0, 3) },
        { title: 'Ofertas Especiais', products: (await specialOffers).slice(0, 3) },
        { title: 'Mais Vendidos', products: (await bestsellers).slice(0, 3) }
    ]
}

useHead({ title: '' })

const [
    ,
    { data: homeBanners },
    { data: homeVideos },
    { data: featuredProducts },
    { data: featuredProductsComputadores },
    { data: featuredProductsPromo },
    { data: featuredProductsPCGamer },
    { data: featuredProductsNotebooks },
    { data: bestsellers },
    { data: latestProducts },
    { data: columns }
] = await Promise.all([
    useAsyncData('homeCategories', async () => {
        await shop.fetchCategory({ categorySlug: null })
        return true
    }),
    useAsyncData('homeBanners', () =>
        $fetch<{ data?: { heroSlides?: HomeHeroSlide[] } }>('/api/banners', { query: { page: 'home' } })
            .then((response) => response?.data || {})
            .catch(() => ({}))
    ),
    useAsyncData('homeVideos', () =>
        shopApi.getVideoList()
    ),
    useAsyncData('featuredProducts', () =>
        shopApi.getFeaturedProducts({ limit: 8 })
    ),
    useAsyncData('featuredProductsComputadores', () =>
        shopApi.getFeaturedProducts({ limit: 8, category: 'computadores' })
    ),
    useAsyncData('featuredProductsPromo', () =>
        shopApi.getFeaturedProducts({ limit: 8, category: 'promocao' })
    ),
    useAsyncData('featuredProductsPCGamer', () =>
        shopApi.getFeaturedProducts({ limit: 8, category: 'pc-gamer' })
    ),
    useAsyncData('featuredProductsNotebooks', () =>
        shopApi.getFeaturedProducts({ limit: 8, category: 'notebooks' })
    ),
    useAsyncData('bestsellers', () =>
        shopApi.getPopularProducts({ limit: 7 })
    ),
    useAsyncData('latestProducts', () =>
        shopApi.getLatestProducts({ limit: 8 })
    ),
    useAsyncData('columns', () => loadColumns())
])

const homeHeroSlides = computed<HomeHeroSlide[]>(() => {
    return Array.isArray(homeBanners.value?.heroSlides) ? homeBanners.value.heroSlides : []
})

function normalizeSectionBanner(slotKey: string): HomeSectionBanner | null {
    const slot = homeBanners.value?.sectionBanners?.[slotKey]
    if (!slot || typeof slot !== 'object') {
        return null
    }

    const img = typeof slot.img === 'string' ? slot.img.trim() : ''
    if (!img) {
        return null
    }

    const mobile = typeof slot.mobile === 'string' && slot.mobile.trim() !== '' ? slot.mobile.trim() : img
    const url = typeof slot.url === 'string' && slot.url.trim() !== '' ? slot.url.trim() : '#'

    return { img, mobile, url }
}

const homeSectionBanner1 = computed<HomeSectionBanner | null>(() => normalizeSectionBanner('home-faixa-1'))
const homeSectionBanner2 = computed<HomeSectionBanner | null>(() => normalizeSectionBanner('home-faixa-2'))
const homeSectionBanner3 = computed<HomeSectionBanner | null>(() => normalizeSectionBanner('home-faixa-3'))
const homeSectionBanner4 = computed<HomeSectionBanner | null>(() => normalizeSectionBanner('home-faixa-4'))

const videoPosts = computed(() => {
    return Array.isArray(homeVideos.value?.data?.videos)
        ? homeVideos.value.data.videos
        : []
})

onMounted(() => {
    if (!bestsellers.value) {
        shopApi.getPopularProducts().then((products) => {
            bestsellers.value = products
        })
    }
    if (!columns.value) {
        loadColumns().then((cols) => {
            columns.value = cols
        })
    }
})

function featuredProductsSource (tab: {categorySlug: string}): Promise<any[]> {
    return shopApi.getFeaturedProducts({ limit: 8, category: tab.categorySlug })
}

function latestProductsSource (tab: {categorySlug: string}): Promise<any[]> {
    return shopApi.getLatestProducts({ limit: 8, category: tab.categorySlug })
}
</script>
