<template>
    <div>
        <ShopPageProduct v-if="product && product.id" :product="product" layout="columnar" />
        <LayoutError v-if="!product || !product.id" :error="product" />
    </div>
</template>

<script setup lang="ts">
import shopApi from '~/api/shop'
import { useShopStore } from '~/stores/shop'
import { useEcommerceTracking, toGA4Item } from '~/composables/useEcommerceTracking'
import { usePixelTracking } from '~/composables/usePixelTracking'

const route = useRoute()
const shop = useShopStore()
const tracking = useEcommerceTracking()
const pixel = usePixelTracking()

const { data: product } = await useAsyncData(`shop-product-${route.params.slug}`, async () => {
    try {
        return await shopApi.getProductBySlug(route.params.slug as string)
    } catch (error) {
        throw createError({ statusCode: 404, message: 'Produto ' + route.params.slug + ' não encontrado ou com caracter especial' })
    }
})

onMounted(() => {
    if (product.value) {
        shop.fetchViewed(product.value)
        tracking.viewItem(toGA4Item(product.value))
        pixel.viewContent(product.value.id, product.value.name, product.value.price)
    }
})

const stripHtml = (html: string) => html.replace(/<[^>]*>/g, ' ').replace(/\s+/g, ' ').trim()

const description = computed(() => {
    if (!product.value) return ''
    let desc = ''
    if (product.value.resumo && product.value.resumo.length > 0)
        desc += product.value.resumo.join(', ')
    if (product.value.caracteristics)
        desc += ' ' + product.value.caracteristics
    if (product.value.description)
        desc += ' ' + product.value.description
    return stripHtml(desc).substring(0, 5000)
})

const sku = computed(() => {
    if (!product.value) return ''
    if (product.value.gtins && product.value.gtins.length > 0)
        return product.value.gtins[0].gtin
    return String(product.value.id)
})

const brand = computed(() => {
    if (!product.value) return ''
    if (product.value.brand)
        return product.value.brand.value
    return ''
})

const availability = computed(() => {
    if (!product.value) return 'https://schema.org/OutOfStock'
    if (product.value.stock || product.value.stock_caxias)
        return 'https://schema.org/InStock'
    return 'https://schema.org/OutOfStock'
})

const breadcrumb = computed(() => {
    if (!product.value) return []
    const items: any[] = [
        { '@type': 'ListItem', position: 1, name: 'Home', item: 'https://www.hardstore.com.br/' }
    ]
    const cats = [...(product.value.tags_categoria || [])].reverse()
    cats.forEach((cat: any, i: number) => {
        items.push({
            '@type': 'ListItem',
            position: i + 2,
            name: cat.name,
            item: 'https://www.hardstore.com.br/shop/' + cat.slug
        })
    })
    items.push({
        '@type': 'ListItem',
        position: items.length + 1,
        name: product.value.name
    })
    return items
})

const priceValidUntil = new Date(Date.now() + 365 * 24 * 60 * 60 * 1000).toISOString().split('T')[0]

useHead(computed(() => ({
    script: product.value?.id ? [
        {
            type: 'application/ld+json',
            innerHTML: JSON.stringify({
                '@context': 'https://schema.org',
                '@type': 'BreadcrumbList',
                itemListElement: breadcrumb.value
            })
        },
        {
            type: 'application/ld+json',
            innerHTML: JSON.stringify({
                '@context': 'https://schema.org',
                '@type': 'Product',
                name: product.value.name,
                image: [1, 2, 3, 4, 5].map(n => `https://cdn-hardstore.s3-sa-east-1.amazonaws.com/${product.value!.id}/1280x960/${n}.webp`),
                description: description.value,
                sku: sku.value,
                ...(product.value.pn ? { mpn: product.value.pn } : {}),
                brand: { '@type': 'Brand', name: brand.value },
                offers: {
                    '@type': 'Offer',
                    priceCurrency: 'BRL',
                    price: String(product.value.price),
                    url: 'https://www.hardstore.com.br/shop/products/' + product.value.slug,
                    priceValidUntil,
                    itemCondition: 'https://schema.org/NewCondition',
                    availability: availability.value,
                    seller: { '@id': 'https://www.hardstore.com.br/#organization' },
                    shippingDetails: {
                        '@type': 'OfferShippingDetails',
                        shippingDestination: {
                            '@type': 'DefinedRegion',
                            addressCountry: 'BR'
                        },
                        deliveryTime: {
                            '@type': 'ShippingDeliveryTime',
                            handlingTime: {
                                '@type': 'QuantitativeValue',
                                minValue: 0,
                                maxValue: 1,
                                unitCode: 'DAY'
                            },
                            transitTime: {
                                '@type': 'QuantitativeValue',
                                minValue: 1,
                                maxValue: 7,
                                unitCode: 'DAY'
                            }
                        }
                    },
                    hasMerchantReturnPolicy: {
                        '@type': 'MerchantReturnPolicy',
                        applicableCountry: 'BR',
                        returnPolicyCategory: 'https://schema.org/MerchantReturnFiniteReturnWindow',
                        merchantReturnDays: 7,
                        returnMethod: [
                            'https://schema.org/ReturnByMail',
                            'https://schema.org/ReturnInStore'
                        ],
                        returnFees: 'https://schema.org/FreeReturn'
                    }
                }
            })
        }
    ] : []
})))
</script>
