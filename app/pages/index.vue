<template>
    <div>
        <BlockSlideshow layout="with-departments" />

        <BlockFeatures />

        <BlockProductsCarouselContainer
            v-slot:default="{ products, isLoading, tabs, handleTabChange }"
            :tabs="shop.categoryPromo"
            :initial-data="featuredProductsPromo"
            :data-source="featuredProductsSource"
            action="shop/fetchCategoryPromo"
        >
            <BlockProductsCarousel
                title="Ofertas Especiais"
                layout="grid-4"
                :products="products"
                :loading="isLoading"
                :groups="shop.categoryPromo"
                @groupClick="handleTabChange"
            />
        </BlockProductsCarouselContainer>

        <BlockBanner :data="{ img: '/images/banners/notebook.webp', mobile: '/images/banners/notebook-mobile.webp', url: '/shop/notebooks'}" />

        <BlockProductsCarouselContainer
            v-slot:default="{ products, isLoading, tabs, handleTabChange }"
            :tabs="shop.categoryPCGamer"
            :initial-data="featuredProductsPCGamer"
            :data-source="featuredProductsSource"
            action="shop/fetchCategoryPCGamer"
        >
            <BlockProductsCarousel
                title="Computador Gamer"
                layout="grid-4"
                :products="products"
                :loading="isLoading"
                :groups="shop.categoryPCGamer"
                @groupClick="handleTabChange"
            />
        </BlockProductsCarouselContainer>
        <BlockBanner :data="{ img: '/images/banners/pc.webp', mobile: '/images/banners/pc-mobile.webp', url: '/shop/pc-gamer'}" />

        <BlockProductsCarouselContainer
            v-slot:default="{ products, isLoading, tabs, handleTabChange }"
            :tabs="shop.categoryNotebooksComputers"
            :initial-data="featuredProductsNotebooks"
            :data-source="featuredProductsSource"
            action="shop/fetchCategoryNotebooksComputers"
        >
            <BlockProductsCarousel
                title="Notebooks / Computadores"
                layout="grid-4"
                :products="products"
                :loading="isLoading"
                :groups="shop.categoryNotebooksComputers"
                @groupClick="handleTabChange"
            />
        </BlockProductsCarouselContainer>

        <BlockBanner :data="{ img: '/images/banners/notebook.webp', mobile: '/images/banners/notebook-mobile.webp', url: '/shop/notebooks'}" />

        <BlockProductsCarouselContainer
            v-slot:default="{ products, isLoading, tabs, handleTabChange }"
            :tabs="shop.categoryDestaques"
            :initial-data="featuredProductsComputadores"
            :data-source="featuredProductsSource"
            action="shop/fetchCategoryDestaques"
        >
            <BlockProductsCarousel
                title="Produtos em Destaque"
                layout="grid-4"
                :products="products"
                :loading="isLoading"
                :groups="shop.categoryDestaques"
                @groupClick="handleTabChange"
            />
        </BlockProductsCarouselContainer>

        <BlockBanner :data="{ img: '/images/banners/z690.webp', mobile: '/images/banners/z690-mobile.webp', url: 'https://bit.ly/IntelZ690_banner1110'}" />

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
            :posts="shop.videos.videos"
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

async function loadColumns () {
    const topRated = shopApi.getTopRatedProducts({ limit: 3 })
    const specialOffers = shopApi.getDiscountedProducts({ limit: 3 })
    const bestsellers = shopApi.getPopularProducts({ limit: 3 })
    return [
        { title: 'Melhores Avaliações', products: await topRated },
        { title: 'Ofertas Especiais', products: await specialOffers },
        { title: 'Mais Vendidos', products: (await bestsellers).slice(0, 3) }
    ]
}

useHead({ title: '' })

const { data: featuredProducts } = await useAsyncData('featuredProducts', () =>
    shopApi.getFeaturedProducts({ limit: 8 })
)
const { data: featuredProductsComputadores } = await useAsyncData('featuredProductsComputadores', () =>
    shopApi.getFeaturedProducts({ limit: 8, category: 'computadores' })
)
const { data: featuredProductsPromo } = await useAsyncData('featuredProductsPromo', () =>
    shopApi.getFeaturedProducts({ limit: 8, category: 'promocao' })
)
const { data: featuredProductsPCGamer } = await useAsyncData('featuredProductsPCGamer', () =>
    shopApi.getFeaturedProducts({ limit: 8, category: 'pc-gamer' })
)
const { data: featuredProductsNotebooks } = await useAsyncData('featuredProductsNotebooks', () =>
    shopApi.getFeaturedProducts({ limit: 8, category: 'notebooks' })
)
const { data: bestsellers } = await useAsyncData('bestsellers', () =>
    shopApi.getPopularProducts({ limit: 7 })
)
const { data: latestProducts } = await useAsyncData('latestProducts', () =>
    shopApi.getLatestProducts({ limit: 8 })
)
const { data: columns } = await useAsyncData('columns', () => loadColumns())

onMounted(() => {
    shop.fetchYoutube()
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
