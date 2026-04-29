import { parseQueryFilters, parseQueryOptions } from '~/services/helpers'
import { useShopStore } from '~/stores/shop'

export default defineNuxtRouteMiddleware(async (to) => {
    if (import.meta.client && useNuxtApp().isHydrating) return

    const shop = useShopStore()
    const slug = (to.params.slug as string) || null
    const options = parseQueryOptions(to.query as any)
    const filters = parseQueryFilters(to.query as any)
    await shop.init({ categorySlug: slug, options, filters })
})
