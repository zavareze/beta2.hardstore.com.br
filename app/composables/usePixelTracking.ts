export const usePixelTracking = () => {
    const { $fbq } = useNuxtApp() as { $fbq?: (...args: unknown[]) => void }

    const track = (event: string, params?: Record<string, unknown>) => {
        if (!import.meta.client || !$fbq) return
        $fbq('track', event, params)
    }

    return {
        viewContent(productId: number, productName: string, price: number) {
            track('ViewContent', {
                content_ids: [String(productId)],
                content_name: productName,
                content_type: 'product',
                currency: 'BRL',
                value: price
            })
        },

        addToCart(productId: number, productName: string, price: number, quantity: number) {
            track('AddToCart', {
                content_ids: [String(productId)],
                content_name: productName,
                content_type: 'product',
                currency: 'BRL',
                value: price * quantity
            })
        },

        initiateCheckout(contentIds: string[], value: number, numItems: number) {
            track('InitiateCheckout', {
                content_ids: contentIds,
                content_type: 'product',
                currency: 'BRL',
                value,
                num_items: numItems
            })
        },

        purchase(orderId: string, value: number, contentIds: string[], numItems: number) {
            track('Purchase', {
                content_ids: contentIds,
                content_type: 'product',
                currency: 'BRL',
                value,
                num_items: numItems,
                order_id: orderId
            })
        }
    }
}
