<template>
    <div>
        <ShopPageProduct v-if="product && product.id" :product="product" layout="columnar" />
        <LayoutError v-if="!product || !product.id" :error="product" />
    </div>
</template>

<script setup lang="ts">
import shopApi from '~/api/shop'
import { useShopStore } from '~/stores/shop'

const route = useRoute()
const shop = useShopStore()

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
    }
})

const description = computed(() => {
    if (!product.value) return ''
    let desc = ''
    if (product.value.resumo)
        desc += product.value.resumo.join(', ')
    if (product.value.caracteristics != '')
        desc += ' ' + product.value.caracteristics
    if (product.value.description != '')
        desc += ' ' + product.value.description
    return desc
})

const sku = computed(() => {
    if (!product.value) return ''
    if (product.value.gtins && product.value.gtins.length > 0)
        return product.value.gtins[0].gtin
    return ''
})

const brand = computed(() => {
    if (!product.value) return ''
    if (product.value.brand)
        return product.value.brand.value
    return ''
})

const availability = computed(() => {
    if (!product.value) return 'https://schema.org/Discontinued'
    if (product.value.stock)
        return 'https://schema.org/InStock'
    else if (product.value.stock_caxias)
        return 'https://schema.org/InStock'
    else if (product.value.mensagem_encomenda === 3)
        return 'https://schema.org/OutOfStock'
    else if (product.value.mensagem_encomenda != 5)
        return 'https://schema.org/InStoreOnly'
    return 'https://schema.org/Discontinued'
})

const breadcrumb = computed(() => {
    if (!product.value || !product.value.tags_categoria) return []
    return product.value.tags_categoria.map((element: any, i: number) => ({
        '@type': 'ListItem',
        position: i + 1,
        item: {
            '@id': 'https://www.hardstore.com.br/shop/' + element.slug,
            name: element.name
        }
    }))
})

useHead({
    script: [
        {
            type: 'application/ld+json',
            children: JSON.stringify([
                {
                    '@context': 'https://schema.org',
                    '@type': 'BreadcrumbList',
                    itemListElement: breadcrumb.value
                },
                {
                    '@context': 'https://schema.org/',
                    '@type': 'Product',
                    name: product.value?.name,
                    image: 'https://cdn-hardstore.s3-sa-east-1.amazonaws.com/' + product.value?.id + '/1280x960/1.webp',
                    description: description.value,
                    mpn: product.value?.pn,
                    sku: sku.value,
                    brand: { '@type': 'Thing', name: brand.value },
                    offers: {
                        '@type': 'Offer',
                        priceCurrency: 'BRL',
                        price: product.value?.price,
                        url: 'https://www.hardstore.com.br/shop/products/' + product.value?.slug,
                        priceValidUntil: new Date().toISOString().substring(0, 10),
                        itemCondition: 'http://schema.org/New',
                        availability: availability.value,
                        seller: { '@type': 'Organization', name: 'Hardstore Informática' }
                    },
                    aggregateRating: { '@type': 'AggregateRating', ratingValue: '5', reviewCount: '1' }
                }
            ])
        }
    ]
})
</script>
