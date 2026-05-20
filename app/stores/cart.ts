import { defineStore } from 'pinia'
import piniaPluginPersistedstate from 'pinia-plugin-persistedstate'
import type { IProduct } from '~/interfaces/product'
import type { Cart, CartItem, CartItemOption, CartTotal } from '~/interfaces/cart'
import shopApi from '~/api/shop'

export interface CartState extends Cart {
    lastItemId: number
    shipping: number
    shippingMethod: number
    consent: boolean
}

export type CartAddPayload = {
    product: IProduct
    options?: CartItemOption[]
    quantity?: number
    error?: string
    local: number
}

export type CartRemovePayload = { itemId: number }

export type CartItemQuantity = { itemId: number; value: number; error?: string }
export type CartUpdateQuantitiesPayload = CartItemQuantity[]

function findItemIndex(items: CartItem[], product: IProduct, options: CartItemOption[]): number {
    return items.findIndex((item) => {
        if (item.product.id !== product.id || item.options.length !== options.length) return false
        for (const option of options) {
            if (!item.options.find(o => o.optionId === option.optionId && o.valueId === option.valueId)) return false
        }
        return true
    })
}

const calcSubtotal = (items: CartItem[]) => items.reduce((s, i) => s + i.total, 0)
const calcQuantity = (items: CartItem[]) => items.reduce((q, i) => q + i.quantity, 0)
const calcWeight = (items: CartItem[]) => items.reduce((w, i) => w + i.quantity * (i.product as any).weight, 0)
const calcMultiple = (items: CartItem[]) => {
    const lojas = new Set(items.map(i => (i as any).local))
    return lojas.size >= 2
}

export const useCartStore = defineStore('cart', {
    state: (): CartState => ({
        lastItemId: 0,
        items: [],
        quantity: 0,
        subtotal: 0,
        totals: [],
        shipping: 0,
        shippingMethod: 1,
        total: 0,
        weight: 0,
        multiple: false,
        stock: true,
        consent: false
    }),
    getters: {
        cartQuantity: (state) => state.quantity,
        checkForVGA: (state) => {
            let hasVGA = false
            let hasAnotherItem = false
            state.items.forEach(item => {
                if ((item.product as any).catinfo?.slug === 'placa-video') hasVGA = true
                else hasAnotherItem = true
            })
            return { hasVGA, hasAnotherItem, hasOnlyVGA: !hasAnotherItem && hasVGA }
        }
    },
    actions: {
        clean() {
            this.lastItemId = 0
            this.items = []
            this.quantity = 0
            this.subtotal = 0
            this.totals = []
            this.shipping = 0
            this.shippingMethod = 1
            this.total = 0
            this.weight = 0
            this.stock = true
        },
        setShipping(payload: { shipping: number; shippingMethod: number }) {
            this.shipping = payload.shipping
            this.total = this.subtotal + this.shipping
            this.shippingMethod = payload.shippingMethod
        },
        async add(payload: CartAddPayload) {
            const result = await shopApi.checkAvaiability(payload.product.id)
            if (result.data?.length > 0) {
                const availableStock = result.data[0].stock
                if ((payload.product as any).status === 3) {
                    const existingIndex = findItemIndex(this.items, payload.product, payload.options || [])
                    const existingQty = existingIndex !== -1 ? this.items[existingIndex].quantity : 0
                    const maxAdd = Math.max(0, availableStock - existingQty)
                    if ((payload.quantity || 1) > maxAdd) {
                        if (maxAdd <= 0) {
                            useNuxtApp().$notify?.({ type: 'error', text: `Estoque esgotado: máximo ${availableStock} unidade${availableStock !== 1 ? 's' : ''}` })
                            return
                        }
                        payload.quantity = maxAdd
                        payload.error = 'Disponível: ' + availableStock
                    }
                }
            }

            const { product, options = [], quantity = 1, local, error } = payload
            const itemIndex = findItemIndex(this.items, product, options)

            if (itemIndex === -1) {
                this.items.push({
                    id: ++this.lastItemId,
                    local,
                    product: JSON.parse(JSON.stringify(product)),
                    options: JSON.parse(JSON.stringify(options)),
                    price: product.price,
                    error,
                    quantity,
                    total: product.price * quantity
                } as any)
            } else {
                const item = this.items[itemIndex] as any
                item.quantity += quantity
                item.total = item.price * item.quantity
            }

            this.quantity = calcQuantity(this.items)
            this.subtotal = calcSubtotal(this.items)
            this.weight = calcWeight(this.items)
            this.multiple = calcMultiple(this.items)
            this.total = this.subtotal + this.shipping

            useNuxtApp().$notify?.({
                type: 'success',
                text: `Produto "${product.name}" adicionado com sucesso!`
            })
        },
        async remove(itemId: number) {
            this.items = this.items.filter(i => i.id !== itemId)
            this.quantity = calcQuantity(this.items)
            this.subtotal = calcSubtotal(this.items)
            this.weight = calcWeight(this.items)
            if (this.items.length === 0) this.shipping = 0
            this.total = this.subtotal + this.shipping
        },
        async updateQuantities(payload: CartUpdateQuantitiesPayload) {
            if (this.items.length === 0) return

            const products = this.items.reduce((acc, i) => acc + i.product.id + '-', '').slice(0, -1)
            const result = await shopApi.checkAvaiability(products)

            this.stock = true
            result.data.forEach((item: any) => {
                const located = this.items.find(x => x.product.id === item.id) as any
                if (located) {
                    located.availableStock = item.stock
                    const ppp = payload.find(x => x.itemId === located.id)
                    const desiredQty = ppp ? ppp.value : located.quantity
                    if (desiredQty > item.stock && (located.product as any).status === 3) {
                        if (ppp) {
                            ppp.error = 'Disponível: ' + item.stock
                            ppp.value = item.stock
                        } else {
                            payload.push({ itemId: located.id, error: 'Disponível: ' + item.stock, value: item.stock })
                        }
                    } else if (!ppp) {
                        payload.push({ itemId: located.id, value: located.quantity })
                    }
                }
            })

            this.items.forEach(item => {
                const quantity = payload.find(x => x.itemId === item.id) as any
                if (!quantity) return
                item.quantity = quantity.value
                ;(item as any).error = quantity.error
                if ((item as any).error) {
                    ;(item as any).max = (item as any).availableStock ?? 0
                } else {
                    delete (item as any).max
                }
                item.total = item.price * item.quantity
                const correctStock = item.local === 2 ? (item.product as any).stock_caxias : (item.product as any).stock
                const isOverQty = (item as any).availableStock !== undefined &&
                    item.quantity > (item as any).availableStock &&
                    (item.product as any).status !== 3
                if (!correctStock || isOverQty) {
                    this.stock = false
                }
            })

            this.quantity = calcQuantity(this.items)
            this.subtotal = calcSubtotal(this.items)
            this.weight = calcWeight(this.items)
            this.total = this.subtotal + this.shipping
        },
        clear() {
            this.clean()
        },
        setConsent() {
            this.consent = true
        }
    },
    persist: {
        storage: piniaPluginPersistedstate.localStorage
    }
})
