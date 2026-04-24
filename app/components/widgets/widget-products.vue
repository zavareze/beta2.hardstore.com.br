<template>
    <div class="widget-products widget">
        <h4 class="widget__title">
            {{ title }}
        </h4>
        <div class="widget-products__list">
            <div
                v-for="product in products"
                :key="product.id"
                class="widget-products__item"
            >
                <div v-if="product.images && product.images.length > 0" class="widget-products__image">
                    <div class="product-image">
                        <AppLink :to="url.product(product)" class="product-image__body">
                            <!--suppress HtmlUnknownTarget -->
                            <img class="product-image__img" :src="'https://cdn-hardstore.s3-sa-east-1.amazonaws.com/' + product.id + '/350x263/' + product.images[0] + '.webp'" alt="">
                        </AppLink>
                    </div>
                </div>
                <div class="widget-products__info">
                    <div class="widget-products__name" style="font-size:12px">
                        <AppLink :to="url.product(product)">
                            {{ product.name }}
                        </AppLink>
                    </div>
                    <div class="widget-products__prices">
                        <template v-if="product.compareAtPrice">
                            <span class="widget-products__new-price">
                                {{ price(product.price) }}
                            </span>
                            <span class="widget-products__old-price">
                                {{ price(product.compareAtPrice) }}
                            </span>
                        </template>
                        <template v-if="!product.compareAtPrice">
                            {{ price(product.price) }}
                        </template>
                    </div>
                </div>
            </div>
        </div>
    </div>
</template>

<script setup lang="ts">
import type { IProduct } from '~/interfaces/product'

withDefaults(defineProps<{
    title?: string
    products?: IProduct[]
}>(), {
    title: '',
    products: () => [],
})

const url = useUrl()
const { price } = usePrice()
</script>
