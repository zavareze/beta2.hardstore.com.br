import type { IProduct } from '~/interfaces/product'
import type { IUserAddress } from '~/interfaces/address'
import type { IOrder } from '~/interfaces/order'
import type { ICategory, IShopCategory } from '~/interfaces/category'

export function useUrl() {
    const router = useRouter()

    return {
        home: () => '/',
        category(category: ICategory) {
            if (category.type === 'shop') return this.shopCategory(category as any)
            return ''
        },
        shopCategory: (category: IShopCategory) => `/shop/catalog/${category.slug}`,
        catalog: () => '/shop/catalog',
        product: (product: Pick<IProduct, 'slug'>) => `/shop/products/${product.slug}`,
        cart: () => '/shop/cart',
        checkout: () => '/shop/checkout',
        wishlist: () => '/shop/wishlist',
        trackOrder: () => '/shop/track-order',
        signIn: (redirect?: string) => '/account/login' + (redirect ? `?redirect=${redirect}` : ''),
        signUp: () => '/account/signin',
        signOut: () => '/account',
        account: () => '/account',
        accountDashboard: () => '/account/dashboard',
        accountProfile: () => '/account/profile',
        accountOrders: () => '/account/orders',
        accountOrder: (order: Pick<IOrder, 'id'>) => `/account/orders/${order.id}`,
        accountAddresses: () => '/account/addresses',
        accountAddress: (address: Pick<IUserAddress, 'id'>) => `/account/addresses/${address.id}`,
        accountPassword: () => '/account/password',
        lang: (path: string) => path,
        isExternal: (path: string) => /^(https?:)?\/\//.test(path),
        isSecure(to: string) {
            return !to.includes('account/login') && !to.includes('account/signin') && to.includes('account/')
        },
        blog: () => '/blog/category-classic',
        blogPost: () => '/blog/post-classic',
        about: () => '/site/about-us',
        contacts: () => '/site/contato',
        terms: () => '/site/terms',
        img: (url: string) => url
    }
}
