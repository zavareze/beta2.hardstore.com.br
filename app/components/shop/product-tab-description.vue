<template>
    <div>
        <iframe v-if="product.video" width="100%" height="510" :src="product.video" frameborder="0" allowfullscreen></iframe>
        <div class="typography" v-html="product.description"></div>
    </div>
</template>

<script setup lang="ts">
import type { IProduct } from '~/interfaces/product'

defineProps<{
    product: IProduct
}>()
</script>
