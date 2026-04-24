import { defineStore } from 'pinia'
import type { IProduct } from '~/interfaces/product'

export const useCompareStore = defineStore('compare', {
    state: () => ({
        items: [] as IProduct[]
    }),
    getters: {
        compareItems: (state) => state.items
    },
    actions: {
        async add(product: IProduct) {
            await new Promise<void>(resolve => setTimeout(resolve, 500))
            if (!this.items.find(x => x.id === product.id)) {
                this.items.push(product)
            }
            useNuxtApp().$notify?.({
                group: 'compare',
                type: 'success',
                text: `Produto "${product.name}" adicionado para comparação!`,
                duration: 6000
            })
        },
        async remove(productId: number) {
            await new Promise<void>(resolve => setTimeout(resolve, 500))
            const index = this.items.findIndex(x => x.id === productId)
            if (index !== -1) {
                this.items.splice(index, 1)
            }
        }
    },
    persist: true
})
