<template>
    <div class="block block-sidebar">
        <div class="block-sidebar__item">
            <WidgetCategories :categories="categories" location="shop" />
        </div>
        <div class="block-sidebar__item d-none d-lg-block">
            <WidgetProducts title="Últimos Produtos" :products="latestProducts" />
        </div>
    </div>
</template>

<script setup lang="ts">
import { ref, onMounted } from 'vue'
import type { ICategory } from '~/interfaces/category'
import type { IProduct } from '~/interfaces/product'
import shopApi from '~/api/shop'
import { useShopStore } from '~/stores/shop'

const shopStore = useShopStore()

const categories = ref<ICategory[]>([])
const latestProducts = ref<IProduct[]>([])

onMounted(() => {
    categories.value = shopStore.categoryListMobile
    shopApi.getLatestProducts({ limit: 5 }).then((result) => {
        latestProducts.value = result
    })
})
</script>
