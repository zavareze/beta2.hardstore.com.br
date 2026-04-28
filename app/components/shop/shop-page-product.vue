<template>
    <div>
        <PageHeader :breadcrumb="breadcrumb" />

        <div v-if="layout === 'sidebar'" class="container">
            <div :class="`shop-layout shop-layout--sidebar--${sidebarPosition}`">
                <ProductSidebar v-if="sidebarPosition === 'start'" class="shop-layout__sidebar" />

                <div class="shop-layout__content">
                    <div class="block">
                        <Product :product="product" :layout="layout" />
                        <ProductTabs :product="product" :with-sidebar="true" />
                    </div>

                    <BlockProductsCarousel
                        v-if="relatedProducts.length > 0"
                        title="Produtos Relacionados"
                        layout="grid-4-sm"
                        :products="relatedProducts"
                        :with-sidebar="true"
                    />
                </div>

                <ProductSidebar v-if="sidebarPosition === 'end'" class="shop-layout__sidebar" />
            </div>
        </div>

        <template v-if="layout !== 'sidebar'">
            <div class="block">
                <div class="container">
                    <Product :product="product" :layout="layout" />
                    <ProductTabs :product="product" />
                </div>
            </div>

            <BlockProductsCarousel
                v-if="relatedProducts.length > 0"
                title="Produtos Relacionados"
                layout="grid-5"
                :products="relatedProducts"
            />
        </template>
    </div>
</template>

<script setup lang="ts">
import { ref, computed, onMounted } from 'vue'
import type { IProduct } from '~/interfaces/product'
import type { ILink } from '~/interfaces/menus/link'
import shopApi from '~/api/shop'

export type ShopPageProductLayout = 'standard' | 'sidebar' | 'columnar';
export type ShopPageProductSidebarPosition = 'start' | 'end';

const props = withDefaults(defineProps<{
    product: any
    layout?: ShopPageProductLayout
    sidebarPosition?: ShopPageProductSidebarPosition
}>(), {
    layout: 'columnar',
    sidebarPosition: 'start',
})

const url = useUrl()

const relatedProducts = ref<IProduct[]>([])

const breadcrumb = computed<ILink[]>(() => {
    const bread = [
        { title: 'Home', url: url.home() },
        { title: 'Shop', url: url.catalog() }
    ]
    const cat = [...(props.product.tags_categoria || [])].reverse()
    cat.forEach((element: any) => {
        bread.push({ title: element.name, url: '/shop/' + element.slug })
    })
    bread.push({ title: props.product.name, url: url.product(props.product) })
    return bread
})

onMounted(() => {
    const categorySlug = props.product.tags_categoria?.[0]?.slug || props.product.categories?.[0]?.slug
    if (categorySlug) {
        shopApi.getRelatedProducts(categorySlug, { limit: 8 }).then((products) => {
            relatedProducts.value = products
        })
    }
})

useHead(() => ({
    title: `${props.product.name}`
}))
</script>
