import { defineStore } from 'pinia'

export const usePaymentOptionsStore = defineStore('paymentOptions', {
    state: () => ({
        open: false,
        price: 0
    }),
    actions: {
        openModal(price: number) {
            this.open = true
            this.price = price
        },
        close() {
            this.open = false
        }
    }
})
