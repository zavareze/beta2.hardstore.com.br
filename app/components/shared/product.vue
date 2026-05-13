<template>
    <div :class="`product product--layout--${layout}`">
        <div class="product__content">
            <ProductGallery :layout="layout" :images="productImages" :product="product" />

            <div class="product__info">
                <div class="product__wishlist-compare">
                    <AsyncAction v-slot:default="{ run, isLoading }" :action="() => wishlistStore.add({ product })">
                        <button
                            type="button"
                            data-toggle="tooltip"
                            data-placement="right"
                            title="Wishlist"
                            :class="[
                                'btn btn-sm btn-light btn-svg-icon',
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
                            data-toggle="tooltip"
                            data-placement="right"
                            title="Compare"
                            :class="[
                                'btn btn-sm btn-light btn-svg-icon',
                                {'btn-loading': isLoading}
                            ]"
                            @click="run"
                        >
                            <Compare16Svg />
                        </button>
                    </AsyncAction>
                </div>
                <h1 class="product__name">
                    {{ product.name }}
                </h1>
                <div v-if="product.description" class="product__description" v-html="product.description.toString().replace( /(<([^>]+)>)/ig, '').substr(0, 200)" />
                <ul v-if="product.caracteristics" class="product__features">
                    <li v-for="(item, i) of product.caracteristics.split('\r\n').slice(0, 5)" :key="i">
                        {{ item }}
                    </li>
                </ul>
                <ul class="product__meta">
                    <li class="product__meta-availability">
                        Status:
                        <span v-if="getStock() > 0" class="text-success">Em Estoque</span>
                        <span v-if="getStock() == 0 && product.status == 3" class="text-danger">Esgotado</span>
                        <span v-if="getStock() == 0 && product.status != 3 && product.status != 5" class="text-default">Encomenda</span>
                        <span v-if="product.status == 5" class="text-danger">Indisponível</span>
                    </li>
                    <li>ID# {{ product.id }}</li>
                    <li>
                        Fabricante:
                        <AppLink to="/">
                            {{ product.brand.value }}
                        </AppLink>
                    </li>
                    <li>Modelo: {{ product.pn }}</li>
                </ul>
            </div>

            <div class="product__sidebar">
                <div class="product__availability">
                    Status:
                    <span v-if="getStock() > 0" class="text-success">Em Estoque</span>
                    <span v-if="getStock() == 0 && product.status == 3" class="text-danger">Esgotado</span>
                    <span v-if="getStock() == 0 && product.status != 3 && product.status != 5" class="text-default">Encomenda</span>
                    <span v-if="product.status == 5" class="text-danger">Indisponível</span>
                </div>

                <div v-if="product.status != 5" class="product__prices">
                    <template v-if="product.compareAtPrice">
                        <span class="product__old-price">
                            {{ price(product.compareAtPrice) }}
                        </span>
                        <span class="product__new-price">
                            {{ price(product.price*1) }}
                        </span>
                    </template>
                    <template v-if="!product.compareAtPrice">
                        {{ price(product.price*1) }}
                    </template>
                    <div><small style="font-size: medium;">à vista no boleto / pix</small></div>
                    <span style="font-size: 13px;font-weight: 400;">
                        <p style="margin-bottom: -5px;">
                            {{ price((product.price*1/.85)) }} em 12x de <b style="margin-bottom: -5px;">{{ price((product.price*1/.85)/12) }}</b> sem juros
                        </p>
                        <p style="margin-bottom: 0px;">ou em 3X com 10% OFF no cartão</p>
                    </span>
                    <p style="cursor: pointer; font-size: medium;color: #cc3333;font-weight: 500;" @click="paymentOptionsStore.openModal(product.price)">
                        Ver os meios de pagamento
                    </p>
                </div>
                <div v-if="product.status != 5">
                    <div v-if="!cep.estimativa" class="product__prices">
                        <figure>
                            <svg xmlns="http://www.w3.org/2000/svg" width="35" height="20" viewBox="0 0 18 15" style="float:left; font-w">
                                <path fill-rule="nonzero" d="M7.763 12.207a2.398 2.398 0 0 1-4.726 0H1.8a1.8 1.8 0 0 1-1.8-1.8V2.195a1.8 1.8 0 0 1 1.8-1.8h8.445a1.8 1.8 0 0 1 1.8 1.8v.568l3.322.035L18 6.821v5.386h-2.394a2.398 2.398 0 0 1-4.727 0H7.763zm-.1-1.2h3.182V2.195a.6.6 0 0 0-.6-.6H1.8a.6.6 0 0 0-.6.6v8.212a.6.6 0 0 0 .6.6h1.337a2.399 2.399 0 0 1 4.526 0zm7.843 0H16.8V7.179l-2.086-3.187-2.669-.029v5.76a2.399 2.399 0 0 1 3.461 1.284zm-2.263 1.99a1.198 1.198 0 1 0 0-2.395 1.198 1.198 0 0 0 0 2.396zm-7.843 0a1.198 1.198 0 1 0 0-2.395 1.198 1.198 0 0 0 0 2.396z" style="float: left;" />
                            </svg>
                        </figure>
                        <div style="font-size: medium">
                            <span><b>Envio para todo o país</b></span> <br>
                            <span style="font-weight: 100; font-size: 15px">Saiba os prazos de entrega e as formas de envio.</span>
                            <div><a style="cursor: pointer; font-size: 14px; color: rgb(204, 51, 51); font-weight: 500;" @click="useModal().show('modalShipping')">Calcular o prazo de entrega</a></div>
                        </div>
                    </div>
                    <div v-if="cep.estimativa" style="font-size: small" class="mb-4">
                        <figure>
                            <svg
                                xmlns="http://www.w3.org/2000/svg"
                                style="float:left; font-w"
                                width="35"
                                height="15"
                                viewBox="0 0 18 15"
                            >
                                <path fill-rule="nonzero" d="M7.763 12.207a2.398 2.398 0 0 1-4.726 0H1.8a1.8 1.8 0 0 1-1.8-1.8V2.195a1.8 1.8 0 0 1 1.8-1.8h8.445a1.8 1.8 0 0 1 1.8 1.8v.568l3.322.035L18 6.821v5.386h-2.394a2.398 2.398 0 0 1-4.727 0H7.763zm-.1-1.2h3.182V2.195a.6.6 0 0 0-.6-.6H1.8a.6.6 0 0 0-.6.6v8.212a.6.6 0 0 0 .6.6h1.337a2.399 2.399 0 0 1 4.526 0zm7.843 0H16.8V7.179l-2.086-3.187-2.669-.029v5.76a2.399 2.399 0 0 1 3.461 1.284zm-2.263 1.99a1.198 1.198 0 1 0 0-2.395 1.198 1.198 0 0 0 0 2.396zm-7.843 0a1.198 1.198 0 1 0 0-2.395 1.198 1.198 0 0 0 0 2.396z" style="float: left;" />
                            </svg>
                        </figure>
                        <span>
                            Chegará <span style="font-weight: 500;">entre {{ cep.estimativa }} por {{ price(cep.sedex.valor) }}</span>
                        </span>
                        <div><a style="cursor: pointer; font-size: 14px; color: rgb(204, 51, 51); font-weight: 500;" @click="useModal().show('modalShipping')">Ver mais formas de entrega</a></div>
                    </div>
                </div>
                <ModalShipping
                    :weight="product.weight"
                    :price_="product.price"
                    :stock="local === 1 ? product.stock : product.stock_caxias"
                    :local="local"
                    @finish="setCEP($event)"
                />
                <form v-if="product.status != 5" class="product__options">
                    <div class="form-group product__option">
                        <div class="product__option-label">
                            Filial
                        </div>
                        <div class="input-radio-label">
                            <div class="input-radio-label__list">
                                <label v-if="product.stock || !(product.status === 3 && product.stock === false)">
                                    <input
                                        type="radio"
                                        name="material"
                                        :checked="local === 1"
                                        :disabled="product.status === 3 && product.stock === false"
                                        @click="setLocal(1)"
                                    >
                                    <span>Porto Alegre</span>
                                </label>
                                <label v-if="product.stock_caxias || !(product.status === 3 && product.stock_caxias === false)">
                                    <input
                                        type="radio"
                                        name="material"
                                        :checked="local === 2"
                                        :disabled="product.status === 3 && product.stock_caxias === false"
                                        @click="setLocal(2)"
                                    >
                                    <span>Caxias</span>
                                </label>
                            </div>
                        </div>
                    </div>
                    <div class="form-group product__option">
                        <label for="product-quantity" class="product__option-label">Quantidade</label>
                        <div class="product__actions">
                            <div class="product__actions-item">
                                <InputNumber
                                    id="product-quantity"
                                    :modelValue="quantity"
                                    aria-label="Quantity"
                                    class="product__quantity"
                                    size="lg"
                                    :disabled="(product.stock+product.stock_caxias == 0 && product.status == 3)"
                                    :min="1"
                                    :max="maxQuantity"
                                    :error="stockError"
                                    @update:modelValue="handleQuantityChange"
                                />
                            </div>
                            <div class="product__actions-item product__actions-item--addtocart">
                                <AsyncAction v-slot:default="{ run, isLoading }" :action="addToCart">
                                    <button
                                        type="button"
                                        :class="[
                                            'btn btn-primary btn-lg',
                                            {'btn-loading': isLoading}
                                        ]"
                                        :disabled="!quantity || (product.stock+product.stock_caxias == 0 && product.status == 3)"
                                        @click="run"
                                    >
                                        Comprar
                                    </button>
                                </AsyncAction>
                            </div>
                            <div class="product__actions-item product__actions-item--wishlist">
                                <AsyncAction v-slot:default="{ run, isLoading }" :action="() => wishlistStore.add({ product })">
                                    <button
                                        type="button"
                                        data-toggle="tooltip"
                                        title="Wishlist"
                                        :class="[
                                            'btn btn-secondary btn-svg-icon btn-lg',
                                            {'btn-loading': isLoading}
                                        ]"
                                        @click="run"
                                    >
                                        <Wishlist16Svg />
                                    </button>
                                </AsyncAction>
                            </div>
                            <div class="product__actions-item product__actions-item--compare">
                                <AsyncAction v-slot:default="{ run, isLoading }" :action="() => compareStore.add({ product })">
                                    <button
                                        type="button"
                                        data-toggle="tooltip"
                                        title="Compare"
                                        :class="[
                                            'btn btn-secondary btn-svg-icon btn-lg',
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
                </form>
            </div>

            <div class="product__footer">
                <div class="product__tags tags">
                    <div class="tags__list">
                        <AppLink v-for="(tag, i) of product.tags_categoria" :key="i" :to="'/shop/' + tag.slug">
                            {{ tag.name }}
                        </AppLink>
                    </div>
                </div>

                <div class="product__share-links share-links">
                    <ul class="share-links__list">
                        <li class="share-links__item share-links__item--type--like">
                            <AppLink to="/">
                                Like
                            </AppLink>
                        </li>
                        <li class="share-links__item share-links__item--type--tweet">
                            <AppLink to="/">
                                Tweet
                            </AppLink>
                        </li>
                        <li class="share-links__item share-links__item--type--pin">
                            <AppLink to="/">
                                Pin It
                            </AppLink>
                        </li>
                        <li class="share-links__item share-links__item--type--counter">
                            <AppLink to="/">
                                4K
                            </AppLink>
                        </li>
                    </ul>
                </div>
            </div>
        </div>
    </div>
</template>

<script setup lang="ts">
import { ref, onMounted } from 'vue'
import type { IProduct } from '~/interfaces/product'
import shopApi from '~/api/shop'
import { useCartStore } from '~/stores/cart'
import { useWishlistStore } from '~/stores/wishlist'
import { useCompareStore } from '~/stores/compare'
import { useAccountStore } from '~/stores/account'
import { usePaymentOptionsStore } from '~/stores/paymentOptions'
import Wishlist16Svg from '~/svg/wishlist-16.svg'
import Compare16Svg from '~/svg/compare-16.svg'

export type ProductLayout = 'standard' | 'sidebar' | 'columnar' | 'quickview';

const props = defineProps<{
    layout: ProductLayout
    product: IProduct
}>()

const { price } = usePrice()
const cartStore = useCartStore()
const wishlistStore = useWishlistStore()
const compareStore = useCompareStore()
const accountStore = useAccountStore()
const paymentOptionsStore = usePaymentOptionsStore()

const quantity = ref<number | string>(1)
const local = ref<number>(1)
const cep = ref<any>({ cep: accountStore.cep, estimativa: '', error: '', fretes: {} })
const maxQuantity = ref<number | undefined>(undefined)
const stockError = ref('')
const { show: showModal } = useModal()
const productImages = computed(() => {
    return props.product.images && props.product.images.length ? props.product.images : [1]
})

onMounted(async () => {
    if (props.product.status === 3) {
        if (props.product.stock_caxias) {
            local.value = 2
        }
        if (props.product.stock) {
            local.value = 1
        }
    }
    try {
        const result = await shopApi.checkAvaiability(props.product.id)
        if (result?.data?.length > 0) {
            maxQuantity.value = result.data[0].stock
        }
    } catch {}
})

function handleQuantityChange(val: number | string) {
    quantity.value = val
    if (maxQuantity.value !== undefined && Number(val) > maxQuantity.value) {
        stockError.value = `Disponível: ${maxQuantity.value}`
        quantity.value = maxQuantity.value
    } else {
        stockError.value = ''
    }
}

function setLocal(i: number) {
    local.value = i
}

function getStock() {
    if (local.value === 1)
        return props.product.stock
    else
        return props.product.stock_caxias
}

function setCEP(evt: any) {
    cep.value = evt
}

function addToCart(): Promise<void> {
    if (typeof quantity.value === 'string' || quantity.value < 1) {
        return Promise.resolve()
    }
    const qty = maxQuantity.value !== undefined
        ? Math.min(Number(quantity.value), maxQuantity.value)
        : Number(quantity.value)
    return cartStore.add({ product: props.product, quantity: qty, local: local.value })
}
</script>
