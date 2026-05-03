<template>
    <!-- .dropcart -->
    <ClientOnly>
        <div
            :class="[
                'dropcart',
                `dropcart--style--${type}`,
                {'dropcart--open': isOpen}
            ]"
        >
            <div v-if="type === 'offcanvas'" class="dropcart__backdrop" @click="offcanvasCartStore.close()" />
            <div class="dropcart__body">
                <div v-if="type === 'offcanvas'" class="dropcart__header">
                    <div class="dropcart__title">
                        Carrinho
                    </div>
                    <button class="dropcart__close" type="button" @click="offcanvasCartStore.close()">
                        <Cross12Svg />
                    </button>
                </div>

                <div class="dropcart__products-list">
                    <div v-for="item in items" :key="item.id" class="dropcart__product">
                        <div class="product-image dropcart__product-image">
                            <AppLink :to="url.product(item.product)" class="product-image__body">
                                <!--suppress HtmlUnknownTarget -->
                                <img class="product-image__img" :src="'https://cdn-hardstore.s3-sa-east-1.amazonaws.com/' + item.product.id + '/1280x960/1.webp'" alt="">
                            </AppLink>
                        </div>
                        <div class="dropcart__product-info">
                            <div class="dropcart__product-name">
                                <AppLink :to="url.product(item.product)">
                                    {{ item.product.name }}
                                </AppLink>
                            </div>
                            <ul v-if="item.options.length > 0" class="dropcart__product-options">
                                <li v-for="(option, index) in item.options" :key="index">
                                    {{ option.optionTitle }}: {{ option.valueTitle }}
                                </li>
                            </ul>
                            <div class="dropcart__product-meta">
                                <span class="dropcart__product-quantity">{{ item.quantity }}</span> ×
                                <span class="dropcart__product-price">{{ price(item.price) }}</span>
                            </div>
                        </div>

                        <AsyncAction
                            v-slot:default="{ run, isLoading }"
                            :action="() => cartStore.remove(item.id)"
                        >
                            <button
                                type="button"
                                :class="[
                                    'dropcart__product-remove btn btn-light btn-sm btn-svg-icon',
                                    {'btn-loading': isLoading}
                                ]"
                                @click="run"
                            >
                                <Cross10Svg />
                            </button>
                        </AsyncAction>
                    </div>
                </div>

                <div class="dropcart__totals">
                    <table>
                        <tbody>
                            <template v-if="totals.length > 0">
                                <tr>
                                    <th>Subtotal</th>
                                    <td>{{ price(subtotal) }}</td>
                                </tr>
                                <tr v-for="(item, index) in totals" :key="index">
                                    <th>{{ item.title }}</th>
                                    <td>{{ price(item.price) }}</td>
                                </tr>
                            </template>

                            <tr>
                                <th>Total</th>
                                <td>{{ price(total) }}</td>
                            </tr>
                        </tbody>
                    </table>
                </div>

                <div class="dropcart__buttons">
                    <AppLink :to="url.cart()" class="btn btn-secondary">
                        Carrinho
                    </AppLink>
                    <AppLink :to="url.checkout()" class="btn btn-primary">
                        Fechar Compra
                    </AppLink>
                </div>
            </div>
        </div>
    </ClientOnly>
    <!-- .dropcart / end -->
</template>

<script setup lang="ts">
import { computed, watch } from 'vue'
import { useCartStore } from '~/stores/cart'
import { useOffcanvasCartStore } from '~/stores/offcanvasCart'
import type { CartItem, CartTotal } from '~/interfaces/cart'
import Cross12Svg from '~/svg/cross-12.svg'
import Cross10Svg from '~/svg/cross-10.svg'

type Type = 'dropdown' | 'offcanvas'

const props = withDefaults(defineProps<{
    type?: Type
}>(), {
    type: 'dropdown'
})

const url = useUrl()
const { price } = usePrice()
const cartStore = useCartStore()
const offcanvasCartStore = useOffcanvasCartStore()

const items = computed(() => cartStore.items)
const subtotal = computed(() => cartStore.subtotal)
const totals = computed(() => cartStore.totals)
const total = computed(() => cartStore.total)
const isOpen = computed(() => offcanvasCartStore.isOpen)

const bodyWidth = ref(0)

watch(isOpen, (newValue: boolean) => {
    if (newValue) {
        open()
    } else {
        close()
    }
})

function open() {
    hideScrollbar()
}

function close() {
    showScrollbar()
}

function hideScrollbar() {
    bodyWidth.value = document.body.clientWidth
    document.body.style.overflow = 'hidden'
    document.body.style.paddingRight = `${document.body.clientWidth - bodyWidth.value}px`
}

function showScrollbar() {
    document.body.style.overflow = ''
    document.body.style.paddingRight = ''
}
</script>
