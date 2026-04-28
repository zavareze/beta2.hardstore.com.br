import { defineStore } from 'pinia'
import piniaPluginPersistedstate from 'pinia-plugin-persistedstate'

function normalizeItem(item: any): any | null {
    if (!item) return null
    // migra itens salvos no formato antigo { product: {...} }
    const p = item.id ? item : item.product
    return p?.id ? p : null
}

export const useWishlistStore = defineStore('wishlist', {
    state: () => ({
        items: [] as any[]
    }),
    getters: {
        validItems: (state) => state.items.map(normalizeItem).filter(Boolean)
    },
    actions: {
        async add({ product }: { product: any }) {
            await new Promise<void>(resolve => setTimeout(resolve, 500))
            if (!this.items.find(x => normalizeItem(x)?.id === product.id)) {
                this.items.push(product)
            }
            useNuxtApp().$notify?.({
                type: 'success',
                text: `Produto "${product.name}" adicionado a sua wish list!`
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
