<template>
    <div ref="containerRef" class="swiper">
        <div class="swiper-wrapper">
            <slot />
        </div>
        <div v-if="hasPagination" ref="paginationRef" class="swiper-pagination" />
        <div v-if="options.navigation" class="swiper-button-prev" />
        <div v-if="options.navigation" class="swiper-button-next" />
    </div>
</template>

<script setup lang="ts">
import { computed, ref, onMounted, onBeforeUnmount, nextTick } from 'vue'


const props = withDefaults(defineProps<{
    options?: Record<string, any>
}>(), {
    options: () => ({})
})

const containerRef = ref<HTMLElement | null>(null)
const paginationRef = ref<HTMLElement | null>(null)
const swiperInstance = ref<any>(null)
const hasPagination = computed(() => props.options.pagination !== undefined && props.options.pagination !== false)

onMounted(async () => {
    await nextTick()
    const el = containerRef.value
    if (!el) return

    const { Swiper } = await import('swiper')
    const { Pagination, Autoplay, Navigation } = await import('swiper/modules')

    if (!containerRef.value) return

    const modules = []
    if (hasPagination.value) modules.push(Pagination)
    if (props.options.autoplay) modules.push(Autoplay)
    if (props.options.navigation) modules.push(Navigation)

    const extraOptions: Record<string, any> = {}
    if (hasPagination.value && paginationRef.value) {
        const paginationOptions = typeof props.options.pagination === 'object' ? props.options.pagination : {}
        extraOptions.pagination = { clickable: true, ...paginationOptions, el: paginationRef.value }
    }

    swiperInstance.value = new Swiper(el, {
        modules,
        ...props.options,
        ...extraOptions
    })
})

onBeforeUnmount(() => {
    swiperInstance.value?.destroy()
})

defineExpose({
    get swiper() { return swiperInstance.value }
})
</script>
