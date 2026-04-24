<template>
    <div ref="containerRef" class="swiper">
        <div class="swiper-wrapper">
            <slot />
        </div>
        <div v-if="options.pagination" class="swiper-pagination" />
        <div v-if="options.navigation" class="swiper-button-prev" />
        <div v-if="options.navigation" class="swiper-button-next" />
    </div>
</template>

<script setup lang="ts">
import { ref, onMounted, onBeforeUnmount } from 'vue'


const props = withDefaults(defineProps<{
    options?: Record<string, any>
}>(), {
    options: () => ({})
})

const containerRef = ref<HTMLElement | null>(null)
const swiperInstance = ref<any>(null)

onMounted(async () => {
    const el = containerRef.value
    if (!el) return

    const { Swiper } = await import('swiper')
    const { Pagination, Autoplay, Navigation } = await import('swiper/modules')

    swiperInstance.value = new Swiper(el, {
        modules: [Pagination, Autoplay, Navigation],
        ...props.options
    })
})

onBeforeUnmount(() => {
    swiperInstance.value?.destroy()
})

defineExpose({
    get swiper() { return swiperInstance.value }
})
</script>
