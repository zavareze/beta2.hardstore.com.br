import { defineStore } from 'pinia'

export const useWishlistStore = defineStore('wishlist', {
    state: () => ({
        items: [] as any[]
    }),
    actions: {
        async add(product: any) {
            await new Promise<void>(resolve => setTimeout(resolve, 500))
            if (!this.items.find(x => x.id === product.id)) {
                this.items.push(product)
            }
            useNuxtApp().$notify?.({
                type: 'success',
                text: `Produto "${product.name}" adicionado a sua wish list!`
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
