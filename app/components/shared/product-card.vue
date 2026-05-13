<template>
    <div
        :class="[
            'product-card', 'product-card--hidden-actions', {
                'product-card--layout--grid product-card--size--sm': layout === 'grid-sm',
                'product-card--layout--grid product-card--size--nl': layout === 'grid-nl',
                'product-card--layout--grid product-card--size--lg': layout === 'grid-lg',
                'product-card--layout--list': layout === 'list',
                'product-card--layout--horizontal': layout === 'horizontal',
            }
        ]"
    >
        <AsyncAction v-slot:default="{ run, isLoading }" :action="() => quickviewStore.openProduct(product.slug)">
            <button
                type="button"
                :class="[
                    'product-card__quickview',
                    {'product-card__quickview--preload': isLoading}
                ]"
                @click="run"
            >
                <Quickview16Svg />
            </button>
        </AsyncAction>

        <div v-if="!product.compareAtPrice && product.stock+product.stock_caxias > 0" class="product-card__badges-list">
            <div class="product-card__badge product-card__badge--stock">
                Estoque
            </div>
        </div>
        <div v-if="product.compareAtPrice" class="product-card__badges-list">
            <div class="product-card__badge product-card__badge--sale">
                {{ (-100+Math.round((product.price / product.compareAtPrice)*100))+'%' }}
            </div>
        </div>

        <div class="product-card__image product-image">
            <AppLink :to="url.product(product)" class="product-image__body">
                <!--suppress HtmlUnknownTarget --><!-- 1280x960 213x160 350x263 -->
                <img class="product-image__img"
                :loading="index === 0 ? 'eager' : 'lazy'"
                decoding="async"
                :fetchpriority="index === 0 ? 'high' : 'auto'"
                :src="productImage(product)"
                :alt="product.name"
                width="350"
                height="263">
                <img v-if="product.badge_promo" class="black-img" src="/images/black-friday.png" alt="" />
            </AppLink>
        </div>
        <div v-if="product.vendor" class="product-card__vendor">
            <img
                :alt="product.vendor"
                :src="brandImageCandidates(product.vendor)[0]"
                :data-brand-id="product.vendor"
                :data-fallback-index="0"
                loading="lazy"
                decoding="async"
                @error="onBrandImageError"
            >
        </div>
        <div class="product-card__info">
            <h2 class="product-card__name">
                <AppLink :to="url.product(product)">
                    {{ product.name }}
                </AppLink>
            </h2>
            <div class="product-card__rating">
                <Rating class="product-card__rating-stars" :value="product.rating" />
                <div class=" product-card__rating-legend">
                    {{ product.reviews }} Reviews | ID: {{ product.id }}
                </div>
            </div>

            <ul
                v-if="product.resumo && product.resumo.length"
                class="product-card__features-list"
            >
                <li v-for="(attribute, index) in product.resumo" :key="index">
                    {{ attribute[0] }}: {{ attribute[1] }}
                </li>
            </ul>
            <ul
            v-if="product.caracteristics"
            class="product-card__features-list">
                <li v-for="(attribute, index) in product.caracteristics.split('\n')" :key="index">
                    {{ attribute }}
                </li>
            </ul>
            <div v-if="product.description" class="product-card__features-list">
                {{ productDescriptionText }}
            </div>
        </div>
        <div class="product-card__actions">
            <div class="product-card__availability">
                Status:
                <span v-if="product.stock+product.stock_caxias > 0" class="text-success">Em Estoque</span>
                <span v-if="product.stock+product.stock_caxias == 0 && product.status == 3" class="text-danger">Esgotado</span>
                <span v-if="product.stock+product.stock_caxias == 0 && product.status != 3">Encomenda</span>
            </div>

            <div v-if="product.compareAtPrice" class="product-card__prices">
                <span class="product-card__new-price">{{ price(product.price) }}</span>
                <span class="product-card__old-price">{{ price(product.compareAtPrice) }}</span>
            </div>

            <div v-if="!product.compareAtPrice" class="product-card__prices">
                {{ price(product.price) }} <span style="font-weight: 100;font-size: 70%;">à vista</span>
            </div>

            <div class="product-card__buttons">
                <AsyncAction v-slot:default="{ run, isLoading }" :action="() => cartStore.add({ product, quantity: 1, local: 1 })">
                    <button
                        type="button"
                        :class="[
                            'btn btn-primary product-card__addtocart',
                            {'btn-loading': isLoading}
                        ]"
                        :disabled="(product.stock+product.stock_caxias == 0 && product.status == 3)"
                        @click="run"
                    >
                        Comprar
                    </button>
                </AsyncAction>
                <AsyncAction v-slot:default="{ run, isLoading }" :action="() => cartStore.add({ product, quantity: 1, local: 1 })">
                    <button
                        type="button"
                        :class="[
                            'btn btn-secondary product-card__addtocart product-card__addtocart--list',
                            {'btn-loading': isLoading}
                        ]"
                        :disabled="(product.stock+product.stock_caxias == 0 && product.status == 3)"
                        @click="run"
                    >
                        Comprar
                    </button>
                </AsyncAction>

                <AsyncAction v-slot:default="{ run, isLoading }" :action="() => wishlistStore.add({ product })">
                    <button
                        type="button"
                        :class="[
                            'btn btn-light btn-svg-icon btn-svg-icon--fake-svg product-card__wishlist',
                            {'btn-loading': isLoading}
                        ]"
                        @click="run"
                    >
                        <Wishlist16Svg />
                    </button>
                </AsyncAction>

                <AsyncAction v-slot:default="{ run, isLoading }" :action="() => compareStore.add({ product })">
                    <button
                        type="button"
                        :class="[
                            'btn btn-light btn-svg-icon btn-svg-icon--fake-svg product-card__compare',
                            {'btn-loading': isLoading}
                        ]"
                        @click="run"
                    >
                        <Compare16Svg />
                    </button>
                </AsyncAction>
            </div>
        </div>
    </div>
</template>

<script setup lang="ts">
import { computed } from 'vue'
import { useQuickviewStore } from '~/stores/quickview'
import { useCartStore } from '~/stores/cart'
import { useWishlistStore } from '~/stores/wishlist'
import { useCompareStore } from '~/stores/compare'
import Quickview16Svg from '~/svg/quickview-16.svg'
import Wishlist16Svg from '~/svg/wishlist-16.svg'
import Compare16Svg from '~/svg/compare-16.svg'

export type ProductCardLayout = 'grid-sm' | 'grid-nl' | 'grid-lg' | 'list' | 'horizontal';

const props = defineProps<{
    product: any
    layout?: ProductCardLayout
    index?: number
}>()

const url = useUrl()
const { price } = usePrice()
const quickviewStore = useQuickviewStore()
const cartStore = useCartStore()
const wishlistStore = useWishlistStore()
const compareStore = useCompareStore()

const productDescriptionText = computed(() => {
    const text = String(props.product.description || '')
        .replace(/<[^>]*>/g, ' ')
        .replace(/\s+/g, ' ')
        .trim()

    return text ? `${text}...` : ''
})

const features = computed(() => {
    if (props.product.attributes)
        return props.product.attributes.filter((x: any) => x.featured)
    else
        return false
})

function brandImageCandidates(brandId: string | number) {
    const file = `${brandId}.webp`
    return [
        `/images/fabricantes/${file}`,
        `https://cdn-hardstore.s3-sa-east-1.amazonaws.com/images/fabricantes/${file}`,
        `https://static.hardstore.com.br/images/fabricantes/${file}`
    ]
}

function productImage(product: any) {
    const images = Array.isArray(product.images) && product.images.length ? product.images : [1]
    return `https://cdn-hardstore.s3-sa-east-1.amazonaws.com/${product.id}/350x263/${images[0]}.webp`
}

function onBrandImageError(event: Event) {
    const target = event.target as HTMLImageElement | null
    if (!target) {
        return
    }

    const brandId = target.dataset.brandId
    const currentIndex = Number(target.dataset.fallbackIndex || '0')
    if (!brandId) {
        target.style.display = 'none'
        return
    }

    const candidates = brandImageCandidates(brandId)
    const nextIndex = currentIndex + 1

    if (nextIndex >= candidates.length) {
        target.style.display = 'none'
        return
    }

    target.dataset.fallbackIndex = String(nextIndex)
    target.src = candidates[nextIndex]
}
</script>
