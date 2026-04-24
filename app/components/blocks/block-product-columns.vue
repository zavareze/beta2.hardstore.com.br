<template>
    <div class="block block-product-columns d-lg-block d-none">
        <div class="container">
            <div class="row">
                <div v-for="(column, index) in columns" :key="index" class="col">
                    <BlockHeader :title="column.title" />

                    <div class="block-product-columns__column">
                        <div v-for="product in column.products" :key="product.id" class="block-product-columns__item">
                            <ProductCard :product="product" layout="horizontal" />
                        </div>
                    </div>
                </div>
            </div>
        </div>
    </div>
</template>

<script setup lang="ts">
import type { BlockProductColumnsItem } from '~/interfaces/components'

withDefaults(defineProps<{
    columns?: BlockProductColumnsItem[]
}>(), {
    columns: () => []
})
</script>
