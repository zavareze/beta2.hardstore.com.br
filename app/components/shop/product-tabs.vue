<template>
    <div
        :class="[
            'product-tabs',
            {'product-tabs--layout--sidebar': withSidebar}
        ]"
    >
        <div class="product-tabs__list">
            <div class="product-tabs__list-body">
                <div class="product-tabs__list-container container">
                    <button class="product-tabs__item" type="button" v-if="product.specification" :class="{'product-tabs__item--active': current === 1}" @click="current = 1">
                        Visão Geral
                    </button>
                    <button class="product-tabs__item" type="button" v-if="product.description" :class="{'product-tabs__item--active': current === 2}" @click="current = 2">
                        Descrição
                    </button>
                    <button class="product-tabs__item" type="button" v-if="product.detalhe" :class="{'product-tabs__item--active': current === 3}" @click="current = 3">
                        Especificações
                    </button>
                    <!--<button class="product-tabs__item" type="button" :class="{'product-tabs__item--active': current === 4}" @click="current = 4">
                        Reviews
                    </button>-->
                </div>
            </div>
        </div>
        <div class="product-tabs__content">
            <div class="product-tabs__pane" :class="{'product-tabs__pane--active': current === 1}">
                <ProductTabVisao v-if="product.iframe || product.specification" :product="product" />
                <ProductTabDescription v-if="product.description" :product="product" />
                <ProductTabSpecification v-if="product.detalhe" :product="product" class="pt-5" />
            </div>
            <div class="product-tabs__pane" :class="{'product-tabs__pane--active': current === 2}">
                <ProductTabDescription v-if="product.description" :product="product" />
            </div>
            <div class="product-tabs__pane" :class="{'product-tabs__pane--active': current === 3}">
                <ProductTabSpecification v-if="product.detalhe" :product="product" />
            </div>
            <div class="product-tabs__pane" :class="{'product-tabs__pane--active': current === 4}">
                <ProductTabReviews :product="product" />
            </div>
        </div>
    </div>
</template>

<script setup lang="ts">
import { ref } from 'vue'
import type { IProduct } from '~/interfaces/product'

const props = withDefaults(defineProps<{
    withSidebar?: boolean
    product: IProduct
}>(), {
    withSidebar: false,
})

function getInitialTab (): number {
    let current = 3
    if (props.product.description !== '') current = 2
    if ((props.product.specification !== '') || (props.product.specification2 !== '')) current = 1
    return current
}

const current = ref<number>(getInitialTab())
</script>
