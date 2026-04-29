<template>
    <ClientOnly>
        <swiper-container ref="containerRef" init="false">
            <slot />
        </swiper-container>
    </ClientOnly>
</template>

<script setup lang="ts">
import { ref, watch } from 'vue'

const props = withDefaults(defineProps<{
    options?: Record<string, any>
}>(), {
    options: () => ({})
})

const containerRef = ref<any>(null)

watch(containerRef, (el) => {
    if (!el) return
    Object.assign(el, props.options)
    el.initialize()
})

defineExpose({
    get swiper() { return containerRef.value?.swiper }
})
</script>
