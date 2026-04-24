import { defineStore } from 'pinia'
import type { IProduct } from '~/interfaces/product'
import shopApi from '~/api/shop'

export const useQuickviewStore = defineStore('quickview', {
    state: () => ({
        open: false,
        product: null as IProduct | null
    }),
    actions: {
        close() {
            this.open = false
        },
        async openProduct(productSlug: string) {
            const product = await shopApi.getProductBySlug(productSlug)
            if (product) {
                this.product = product
                this.open = true
            }
        }
    }
})
