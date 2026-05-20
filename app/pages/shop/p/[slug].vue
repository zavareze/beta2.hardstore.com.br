<template>
    <div>
        <ShopPageProduct v-if="product.id" :product="product" layout="standard" />
        <LayoutError v-if="!product.id" :error="product" />
    </div>
</template>

<script setup lang="ts">
import type { IProduct } from '~/interfaces/product'
import shopApi from '~/api/shop'
import { useEcommerceTracking, toGA4Item } from '~/composables/useEcommerceTracking'
import { usePixelTracking } from '~/composables/usePixelTracking'

const route = useRoute()
const tracking = useEcommerceTracking()
const pixel = usePixelTracking()

const { data: product } = await useAsyncData<IProduct>(`shop-p-${route.params.slug}`, () =>
    shopApi.getProductBySlug(route.params.slug as string)
)

onMounted(() => {
    if (product.value?.id) {
        tracking.viewItem(toGA4Item(product.value))
        pixel.viewContent(product.value.id, product.value.name, product.value.price)
    }
})
</script>
