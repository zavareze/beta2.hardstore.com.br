<template>
    <div>
        <PageHeader
            title="Comparar Produtos"
            :breadcrumb="[
                { title: 'Home', url: '' },
                { title: 'Comparar Produtos', url: '' },
            ]"
        />

        <client-only>
            <div v-if="!items.length" class="block block-empty">
                <div class="container">
                    <div class="block-empty__body">
                        <div class="block-empty__message">
                            Você ainda não escolheu produtos para comparar
                        </div>
                        <div class="block-empty__actions">
                            <AppLink to="/" class="btn btn-primary btn-sm">
                                Continuar
                            </AppLink>
                        </div>
                    </div>
                </div>
            </div>

            <div v-if="items.length" class="block">
                <div class="container">
                    <div class="table-responsive">
                        <table class="compare-table table-hover">
                            <tbody>
                                <tr>
                                    <th aria-label="Remover" />
                                    <td v-for="product in items" :key="product.id">
                                        <AsyncAction
                                            v-slot:default="{ run, isLoading }"
                                            :action="() => compareStore.remove({ productId: product.id })"
                                        >
                                            <button
                                                type="button"
                                                :class="[
                                                    'btn btn-secondary btn-sm',
                                                    {'btn-loading': isLoading}
                                                ]"
                                                @click="run"
                                            >
                                                Remover
                                            </button>
                                        </AsyncAction>
                                    </td>
                                </tr>
                                <tr>
                                    <th>Produto</th>
                                    <td v-for="product in items" :key="product.id">
                                        <AppLink :to="url.product(product)" class="compare-table__product-link">
                                            <div
                                                v-if="product.images.length > 0"
                                                class="compare-table__product-image product-image"
                                            >
                                                <div class="product-image__body">
                                                    <!--suppress HtmlUnknownTarget -->
                                                    <img class="product-image__img" :src="'https://cdn-hardstore.s3-sa-east-1.amazonaws.com/' + product.id + '/1280x960/' + product.images[0] + '.webp'" alt="">
                                                </div>
                                            </div>
                                            <div class="compare-table__product-name">
                                                {{ product.name }}
                                            </div>
                                        </AppLink>
                                    </td>
                                </tr>
                                <tr>
                                    <th>Modelo</th>
                                    <td v-for="product in items" :key="product.id">
                                        {{ product.pn }}
                                    </td>
                                </tr>
                                <tr>
                                    <th>Reviews</th>
                                    <td v-for="product in items" :key="product.id">
                                        <div class="compare-table__product-rating">
                                            <Rating :value="product.rating" />
                                        </div>
                                        <div class=" compare-table__product-rating-legend">
                                            {{ product.reviews }} Reviews
                                        </div>
                                    </td>
                                </tr>
                                <tr>
                                    <th>Disponibilidade</th>
                                    <td v-for="product in items" :key="product.id">
                                        <span v-if="product.stock+product.stock_caxias > 0" class="compare-table__product-badge badge text-bg-success">
                                            Em Estoque
                                        </span>
                                        <div class="badge text-bg-danger" v-if="(product.stock+product.stock_caxias == 0 && product.status == 3)">
                                            Indisponível
                                        </div>
                                    </td>
                                </tr>
                                <tr>
                                    <th>Preço</th>
                                    <td v-for="product in items" :key="product.id">
                                        {{ price(product.price) }}
                                    </td>
                                </tr>
                                <tr>
                                    <th>Adicionar ao Carrinho</th>
                                    <td v-for="product in items" :key="product.id">
                                        <AsyncAction
                                            v-slot:default="{ run, isLoading }"
                                            :action="() => cartStore.add({ product, quantity: 1, local: 1 })"
                                        >
                                            <button
                                                type="button"
                                                :class="[
                                                    'btn btn-primary',
                                                    {'btn-loading': isLoading}
                                                ]"
                                                :disabled="(product.stock+product.stock_caxias == 0 && product.status == 3)"
                                                @click="run"
                                            >
                                                Comprar
                                            </button>
                                        </AsyncAction>
                                    </td>
                                </tr>
                                <tr v-for="(feature, index) in attributes" :key="index">
                                    <th>{{ feature.name }}</th>
                                    <td v-for="product in items" :key="product.id" v-html="feature.values[product.id]">
                                    </td>
                                </tr>
                                <tr>
                                    <th aria-label="Remover" />
                                    <td v-for="product in items" :key="product.id">
                                        <AsyncAction
                                            v-slot:default="{ run, isLoading }"
                                            :action="() => compareStore.remove({ productId: product.id })"
                                        >
                                            <button
                                                type="button"
                                                :class="[
                                                    'btn btn-secondary btn-sm',
                                                    {'btn-loading': isLoading}
                                                ]"
                                                @click="run"
                                            >
                                                Remover
                                            </button>
                                        </AsyncAction>
                                    </td>
                                </tr>
                            </tbody>
                        </table>
                    </div>
                </div>
            </div>
        </client-only>
    </div>
</template>

<script setup lang="ts">
import { useCompareStore } from '~/stores/compare'
import { useCartStore } from '~/stores/cart'

const compareStore = useCompareStore()
const cartStore = useCartStore()
const url = useUrl()
const { price } = usePrice()

useHead({ title: 'Comparar Produtos ' })

const items = computed(() => compareStore.items)

export type Attributes = Array<{
    name: string;
    values: {[productId: number]: string};
}>

const attributes = computed((): Attributes => {
    const attrs: Attributes = []
    items.value.forEach(product => {
        return product.detalhe && product.detalhe.forEach(productAttribute => {
            return productAttribute.itens.forEach(itemAttr => {
                let attribute = attrs.find(x => x.name === itemAttr[0])
                if (!attribute) {
                    attribute = {
                        name: itemAttr[0],
                        values: {}
                    }
                    attrs.push(attribute)
                }
                attribute.values[product.id] = itemAttr[1]
            })
        })
    })
    return attrs
})
</script>
