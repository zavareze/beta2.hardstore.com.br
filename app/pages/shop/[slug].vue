<template>
    <ShopPageCategory :columns="3" sidebar-position="start" view-mode="grid" />
</template>

<script setup lang="ts">
import { parseQueryFilters, parseQueryOptions } from '~/services/helpers'
import { useShopStore } from '~/stores/shop'

const route = useRoute()
const shop = useShopStore()

await useAsyncData('shop-slug', async () => {
    const options = parseQueryOptions(route.query as any)
    const filters = parseQueryFilters(route.query as any)
    await shop.init({
        categorySlug: route.params.slug as string,
        options,
        filters
    })
    return true
})
</script>
