<template>
    <div>
        <ShopPageProduct v-if="product.id" :product="product" layout="standard" />
        <LayoutError v-if="!product.id" :error="product" />
    </div>
</template>

<script setup lang="ts">
import type { IProduct } from '~/interfaces/product'
import shopApi from '~/api/shop'

const route = useRoute()

const { data: product } = await useAsyncData<IProduct>(`shop-p-${route.params.slug}`, () =>
    shopApi.getProductBySlug(route.params.slug as string)
)
</script>
