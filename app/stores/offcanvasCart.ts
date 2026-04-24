import { defineStore } from 'pinia'

export const useOffcanvasCartStore = defineStore('offcanvasCart', {
    state: () => ({
        isOpen: false
    }),
    actions: {
        open() { this.isOpen = true },
        close() { this.isOpen = false }
    }
})
