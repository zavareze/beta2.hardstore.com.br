<template>
    <div>
        <div v-if="isOpen" class="modal-overlay">
            <div class="quickview">
                <button class="quickview__close" type="button" @click="quickviewStore.close()">
                    <Cross20Svg />
                </button>

                <Product v-if="product && showProduct" :product="product" layout="quickview" />
            </div>
        </div>
    </div>
</template>

<script setup lang="ts">
import { ref, watch, computed } from 'vue'
import { useQuickviewStore } from '~/stores/quickview'
import Cross20Svg from '~/svg/cross-20.svg'

const quickviewStore = useQuickviewStore()
const isOpen = computed(() => quickviewStore.open)
const product = computed(() => quickviewStore.product)
const showProduct = ref(false)

watch(isOpen, (newValue: boolean) => {
    if (newValue) {
        setTimeout(() => {
            showProduct.value = true
        }, 50)
    } else {
        showProduct.value = false
    }
})
</script>
