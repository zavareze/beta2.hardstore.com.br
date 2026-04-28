import { defineStore } from 'pinia'
import piniaPluginPersistedstate from 'pinia-plugin-persistedstate'
import type { IProduct } from '~/interfaces/product'

function normalizeItem(item: any): IProduct | null {
    if (!item) return null
    const p = item.id ? item : item.product
    return p?.id ? p : null
}

export const useCompareStore = defineStore('compare', {
    state: () => ({
        items: [] as IProduct[]
    }),
    getters: {
        compareItems: (state) => state.items,
        validItems: (state) => state.items.map(normalizeItem).filter(Boolean) as IProduct[]
    },
    actions: {
        async add({ product }: { product: IProduct }) {
            await new Promise<void>(resolve => setTimeout(resolve, 500))
            if (!this.items.find(x => normalizeItem(x)?.id === product.id)) {
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
            const index = this.items.findIndex(x => normalizeItem(x)?.id === productId)
            if (index !== -1) {
                this.items.splice(index, 1)
            }
        }
    },
    persist: {
        storage: piniaPluginPersistedstate.localStorage
    }
})
