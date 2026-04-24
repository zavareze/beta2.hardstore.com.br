<template>
    <ShopPageCategory />
</template>

<script setup lang="ts">
import { parseQueryFilters, parseQueryOptions } from '~/services/helpers'
import { useShopStore } from '~/stores/shop'

const route = useRoute()
const shop = useShopStore()

await useAsyncData('catalogIndex', async () => {
    const options = parseQueryOptions(route.query as any)
    const filters = parseQueryFilters(route.query as any)
    await shop.init({
        categorySlug: null,
        options,
        filters
    })
    return true
})
</script>
