<template>
    <div :class="`block block-products block-products--layout--${layout}`">
        <div class="container">
            <BlockHeader :title="title" />

            <div class="block-products__body">
                <div v-if="featuredProduct && layout === 'large-first'" class="block-products__featured">
                    <div class="block-products__featured-item">
                        <ProductCard :product="featuredProduct" />
                    </div>
                </div>

                <div class="block-products__list">
                    <div v-for="product in products.slice(0, 6)" :key="product.id" class="block-products__list-item">
                        <ProductCard :product="product" />
                    </div>
                </div>

                <div v-if="featuredProduct && layout === 'large-last'" class="block-products__featured">
                    <div class="block-products__featured-item">
                        <ProductCard :product="featuredProduct" />
                    </div>
                </div>
            </div>
        </div>
    </div>
</template>

<script setup lang="ts">
import type { IProduct } from '~/interfaces/product'

type BlockProductsLayout = 'large-first' | 'large-last';

withDefaults(defineProps<{
    title: string
    layout?: BlockProductsLayout
    featuredProduct?: IProduct
    products?: IProduct[]
}>(), {
    layout: 'large-first',
    products: () => []
})
</script>
