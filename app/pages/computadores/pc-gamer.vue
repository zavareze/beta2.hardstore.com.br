<template>
    <ShopPageCategory
        sidebar-position="start"
        view-mode="grid"
        canonical-path="/computadores/pc-gamer"
    />
</template>

<script setup lang="ts">
import { parseQueryFilters, parseQueryOptions } from '~/services/helpers'
import { useShopStore } from '~/stores/shop'

const route = useRoute()
const shop = useShopStore()

if (!(import.meta.client && useNuxtApp().isHydrating)) {
    const options = parseQueryOptions(route.query as any)
    const filters = parseQueryFilters(route.query as any)
    await shop.init({ categorySlug: 'pc-gamer', options, filters })
}
</script>
