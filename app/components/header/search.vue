<template>
    <div
        :class="[
            'search',
            `search--location--${location}`,
            {
                'search--has-suggestions': hasSuggestions,
                'search--suggestions-open': suggestionsOpen
            }
        ]"
    >
        <div class="search__body">
            <form class="search__form" action="/shop/catalog">
                <select
                    style="background-color:black; color:white"
                    v-if="location === 'header'"
                    class="search__categories"
                    aria-label="Category"
                    @change="onCategoryChange"
                    @focus="onCategoryFocus"
                >
                    <option value="">
                        Todas Categorias
                    </option>
                    <option
                        v-for="category in mounted ? shopStore.rootCategoryList : []"
                        :key="category.id"
                        :value="category.slug"
                    >
                        {{ String.fromCharCode(160).repeat(category.depth * 4) + category.name }}
                    </option>
                </select>
                <input
                    ref="inputRef"
                    class="search__input"
                    name="filter_search"
                    placeholder="Procure por mais de 20.000 produtos"
                    aria-label="Site search"
                    type="text"
                    autocomplete="off"
                    maxlength="50"
                    :value="query"
                    @input="onQueryInput"
                    @focus="onQueryFocus"
                    @keydown.esc="onQueryEscape"
                    style="color:white; background-color:black"
                >
                <button class="search__button search__button--type--submit" type="submit">
                    <Search20Svg />
                </button>
                <button
                    v-if="location === 'mobile-header'"
                    class="search__button search__button--type--close"
                    type="button"
                    @click="onCloseClick"
                >
                    <Cross20Svg />
                </button>
                <div class="search__border" />
            </form>

            <div
                :class="[
                    'search__suggestions',
                    'suggestions',
                    `suggestions--location--${location}`
                ]"
            >
                <ul class="suggestions__list">
                    <li v-for="product in suggestedProducts" :key="product.id" class="suggestions__item">
                        <div class="suggestions__item-image product-image">
                            <div class="product-image__body">
                                <!--suppress HtmlUnknownTarget -->
                                <img class="product-image__img" :src="'https://cdn-hardstore.s3-sa-east-1.amazonaws.com/' + product.id + '/350x263/1.webp'" alt="">
                            </div>
                        </div>

                        <div class="suggestions__item-info">
                            <NuxtLink :to="url.product(product)" class="suggestions__item-name" @click="closeSuggestion()">
                                {{ product.name }}
                            </NuxtLink>
                            <div class="suggestions__item-meta">
                                Modelo: {{ product.pn }}
                            </div>
                        </div>
                        <div class="suggestions__item-price">
                            <div v-if="!product.compareAtPrice">{{ price(product.price) }}</div>
                            <div v-if="product.compareAtPrice" class="product-card__new-price">{{ price(product.price) }}</div>
                            <div v-if="product.compareAtPrice" class="product-card__old-price">{{ price(product.compareAtPrice) }}</div>
                        </div>

                        <div v-if="location === 'header'" class="suggestions__item-actions">
                            <AsyncAction v-slot:default="{ run, isLoading }" :action="() => addToCart({ product, quantity: 1, local: 1 })">
                                <button
                                    type="button"
                                    title="Comprar"
                                    :class="[
                                        'btn btn-primary btn-sm btn-svg-icon',
                                        {'btn-loading': isLoading}
                                    ]"
                                    :disabled="(product.stock+product.stock_caxias == 0 && product.status == 3)"
                                    @click="run"
                                >
                                    <Cart16Svg />
                                </button>
                            </AsyncAction>
                        </div>
                    </li>
                </ul>
            </div>
        </div>
    </div>
</template>

<script setup lang="ts">
import { ref, computed, onMounted, onBeforeUnmount, inject } from 'vue'
import shopApi from '~/api/shop'
import { useShopStore } from '~/stores/shop'
import { useCartStore } from '~/stores/cart'
import { useAccountStore } from '~/stores/account'
import Search20Svg from '~/svg/search-20.svg'
import Cross20Svg from '~/svg/cross-20.svg'
import Cart16Svg from '~/svg/cart-16.svg'

const props = withDefaults(defineProps<{
    location?: string
}>(), {
    location: 'header'
})

const emit = defineEmits<{
    close: []
}>()

const url = useUrl()
const { price } = usePrice()
const shopStore = useShopStore()
const cartStore = useCartStore()
const accountStore = useAccountStore()

const getSearchScope = inject<(() => Element) | null>('getSearchScope', null)

const inputRef = ref<HTMLInputElement>()
const mounted = ref(false)
const query = ref('')
const category = ref('')
const suggestedProducts = ref<any[]>([])
const hasSuggestions = ref(false)
const suggestionsOpen = ref(false)
let cancel: () => void = () => {}
const teardown: Array<() => void> = []

const scope = computed(() => {
    return (getSearchScope && getSearchScope()) || document.body
})

onMounted(async () => {
    mounted.value = true
    scope.value.addEventListener('focusout', onFocusout)
    document.addEventListener('click', onGlobalClick)

    teardown.push(() => document.removeEventListener('click', onGlobalClick))
    teardown.push(() => scope.value.removeEventListener('focusout', onFocusout))
})

onBeforeUnmount(() => {
    teardown.forEach(x => x())
})

function onFocusout() {
    setTimeout(() => {
        if (document.activeElement === document.body) {
            return
        }
        if (document.activeElement && !scope.value.contains(document.activeElement)) {
            closeSuggestion()
        }
    }, 10)
}

function onGlobalClick(event: MouseEvent) {
    if (event.target instanceof HTMLElement && !scope.value.contains(event.target)) {
        closeSuggestion()
    }
}

function onQueryInput(event: Event) {
    query.value = (event.target as HTMLInputElement).value
    search()
}

function onQueryFocus() {
    openSuggestion()
}

function onQueryEscape() {
    emit('close')
}

function onCategoryChange(event: Event) {
    category.value = (event.target as HTMLInputElement).value
}

function onCategoryFocus() {
    closeSuggestion()
}

function onCloseClick() {
    emit('close')
}

function openSuggestion() {
    suggestionsOpen.value = true
}

function closeSuggestion() {
    suggestionsOpen.value = false
}

function focus() {
    inputRef.value?.focus()
}

async function search() {
    cancel()

    let canceled = false

    cancel = () => {
        canceled = true
    }

    const q = query.value.trim()
    const products = q === '' ? [] : await shopApi.getSuggestions(q, {
        category: category.value === '' ? undefined : category.value,
        limit: 5
    })

    if (canceled) {
        return
    }

    hasSuggestions.value = products.length > 0

    if (products.length > 0) {
        suggestedProducts.value = products
    }
}

async function addToCart(payload: any) {
    await cartStore.add(payload)
    calculaFrete()
}

function calculaFrete() {
    const cep = accountStore.cep
    if ((cep) && (cep.toString().replace(/\D/g, '').length === 8)) {
        accountStore.calculaFrete({
            cep: cep,
            peso: cartStore.weight,
            valor: cartStore.subtotal,
            encomenda: cartStore.stock,
            multiplo: cartStore.multiple,
            cart: true,
            object: 'search'
        }).then((result: any) => {
            if (!result?.data?.cep?.message) {
                accountStore.setCEP(result.data.cep.cep)
            }
            setShipping()
        })
    }
}

function setShipping() {
    switch (cartStore.shipping * 1) {
        case 2:
            cartStore.setShipping({ shipping: accountStore.calculoFrete.fretes.pac.valor, shippingMethod: cartStore.shipping })
            break
        case 3:
            cartStore.setShipping({ shipping: accountStore.calculoFrete.fretes.motoboy.valor, shippingMethod: cartStore.shipping })
            break
        default:
            cartStore.setShipping({ shipping: accountStore.calculoFrete.fretes.sedex.valor, shippingMethod: cartStore.shipping })
            break
    }
}

defineExpose({ focus, closeSuggestion })
</script>
