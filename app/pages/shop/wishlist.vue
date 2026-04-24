<template>
    <div>
        <PageHeader
            title="Wishlist"
            :breadcrumb="[
                { title: 'Home', url: '' },
                { title: 'Wishlist', url: '' },
            ]"
        />

        <client-only>
            <div v-if="!items.length" class="block block-empty">
                <div class="container">
                    <div class="block-empty__body">
                        <div class="block-empty__message">
                            Não há produtos em sua wishlist!
                        </div>
                        <div class="block-empty__actions">
                            <AppLink to="/" class="btn btn-primary btn-sm">
                                Continue
                            </AppLink>
                        </div>
                    </div>
                </div>
            </div>

            <div v-if="items.length" class="block">
                <div class="container">
                    <table class="wishlist">
                        <thead class="wishlist__head">
                            <tr class="wishlist__row">
                                <th class="wishlist__column wishlist__column--image">
                                    Imagem
                                </th>
                                <th class="wishlist__column wishlist__column--product">
                                    Produto
                                </th>
                                <th class="wishlist__column wishlist__column--stock">
                                    Status
                                </th>
                                <th class="wishlist__column wishlist__column--price">
                                    Preço
                                </th>
                                <th class="wishlist__column wishlist__column--tocart" aria-label="Comprar" />
                                <th class="wishlist__column wishlist__column--remove" aria-label="Remover" />
                            </tr>
                        </thead>
                        <tbody class="wishlist__body">
                            <tr v-for="item in items" :key="item.id" class="wishlist__row">
                                <td class="wishlist__column wishlist__column--image">
                                    <div v-if="item.images.length > 0" class="product-image">
                                        <AppLink :to="url.product(item)" class="product-image__body">
                                            <!--suppress HtmlUnknownTarget -->
                                            <img class="product-image__img" :src="'https://cdn-hardstore.s3-sa-east-1.amazonaws.com/' + item.id + '/1280x960/1.webp'" alt="">
                                        </AppLink>
                                    </div>
                                </td>
                                <td class="wishlist__column wishlist__column--product">
                                    <AppLink :to="url.product(item)" class="wishlist__product-name">
                                        {{ item.name }}
                                    </AppLink>
                                </td>
                                <td class="wishlist__column wishlist__column--stock">
                                    <div class="badge text-bg-success" v-if="(item.stock+item.stock_caxias > 0)">
                                        Em Estoque
                                    </div>
                                    <div class="badge text-bg-danger" v-if="(item.stock+item.stock_caxias == 0 && item.status == 3)">
                                        Indisponível
                                    </div>
                                </td>
                                <td class="wishlist__column wishlist__column--price">
                                    {{ price(item.price) }}
                                </td>
                                <td class="wishlist__column wishlist__column--tocart">
                                    <AsyncAction
                                        v-slot:default="{ run, isLoading }"
                                        :action="() => cartStore.add({ product: item, quantity: 1, local: 1 })"
                                    >
                                        <button
                                            type="button"
                                            :class="[
                                                'btn btn-primary btn-sm',
                                                {'btn-loading': isLoading}
                                            ]"
                                            @click="run"
                                            :disabled="(item.stock+item.stock_caxias == 0 && item.status == 3)"
                                        >
                                            Comprar
                                        </button>
                                    </AsyncAction>
                                </td>
                                <td class="wishlist__column wishlist__column--remove">
                                    <AsyncAction
                                        v-slot:default="{ run, isLoading }"
                                        :action="() => wishlistStore.remove({ productId: item.id })"
                                    >
                                        <button
                                            type="button"
                                            :class="[
                                                'btn btn-light btn-sm btn-svg-icon',
                                                {'btn-loading': isLoading}
                                            ]"
                                            aria-label="Remove"
                                            @click="run"
                                        >
                                            <Cross12Svg />
                                        </button>
                                    </AsyncAction>
                                </td>
                            </tr>
                        </tbody>
                    </table>
                </div>
            </div>
        </client-only>
    </div>
</template>

<script setup lang="ts">
import { useWishlistStore } from '~/stores/wishlist'
import { useCartStore } from '~/stores/cart'

const wishlistStore = useWishlistStore()
const cartStore = useCartStore()
const url = useUrl()
const { price } = usePrice()

useHead({ title: 'Wish List' })

const items = computed(() => wishlistStore.items)
</script>
