export interface GA4Item {
    item_id: string
    item_name: string
    item_brand?: string
    item_category?: string
    item_category2?: string
    price: number
    quantity: number
    index?: number
    item_list_id?: string
    item_list_name?: string
}

export interface IProductLike {
    id: number
    name: string
    price: number
    brand?: { value?: string } | null
    tags_categoria?: Array<{ name: string; slug: string }> | null
}

export function toGA4Item(
    product: IProductLike,
    quantity = 1,
    price?: number,
    index?: number
): GA4Item {
    const item: GA4Item = {
        item_id: String(product.id),
        item_name: product.name,
        price: price ?? product.price,
        quantity,
    }
    if (product.brand?.value) item.item_brand = product.brand.value
    if (product.tags_categoria?.[0]?.name) item.item_category = product.tags_categoria[0].name
    if (product.tags_categoria?.[1]?.name) item.item_category2 = product.tags_categoria[1].name
    if (index !== undefined) item.index = index
    return item
}

export const useEcommerceTracking = () => {
    const { $gtm } = useNuxtApp() as { $gtm?: { push: (obj: Record<string, unknown>) => void } }

    const push = (event: string, ecommerce: Record<string, unknown>) => {
        if (!import.meta.client || !$gtm) return
        $gtm.push({ ecommerce: null })
        $gtm.push({ event, ecommerce: { currency: 'BRL', ...ecommerce } })
    }

    return {
        viewItemList(items: GA4Item[], listId: string, listName: string) {
            push('view_item_list', {
                item_list_id: listId,
                item_list_name: listName,
                items: items.map((item, index) => ({ ...item, index, item_list_id: listId, item_list_name: listName }))
            })
        },

        selectItem(item: GA4Item, listId: string, listName: string) {
            push('select_item', {
                item_list_id: listId,
                item_list_name: listName,
                items: [{ ...item, item_list_id: listId, item_list_name: listName }]
            })
        },

        viewItem(item: GA4Item) {
            push('view_item', { items: [item] })
        },

        addToCart(items: GA4Item[], value: number) {
            push('add_to_cart', { value, items })
        },

        removeFromCart(items: GA4Item[], value: number) {
            push('remove_from_cart', { value, items })
        },

        viewCart(items: GA4Item[], value: number) {
            push('view_cart', { value, items })
        },

        beginCheckout(items: GA4Item[], value: number, coupon?: string) {
            push('begin_checkout', { value, items, ...(coupon ? { coupon } : {}) })
        },

        addShippingInfo(items: GA4Item[], value: number, shippingTier: string) {
            push('add_shipping_info', { value, shipping_tier: shippingTier, items })
        },

        addPaymentInfo(items: GA4Item[], value: number, paymentType: string) {
            push('add_payment_info', { value, payment_type: paymentType, items })
        },

        purchase(
            transactionId: string,
            items: GA4Item[],
            value: number,
            tax: number,
            shipping: number,
            coupon?: string
        ) {
            push('purchase', {
                transaction_id: transactionId,
                value,
                tax,
                shipping,
                items,
                ...(coupon ? { coupon } : {})
            })
        }
    }
}
