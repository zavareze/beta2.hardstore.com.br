<template>
    <ClientOnly>
        <swiper-container ref="containerRef" init="false">
            <slot />
        </swiper-container>
        <template #fallback>
            <slot name="fallback" />
        </template>
    </ClientOnly>
</template>

<script setup lang="ts">
import { ref, watch } from 'vue'
import { Autoplay, Navigation, Pagination, A11y } from 'swiper/modules'
import paginationCss from 'swiper/element/css/pagination?inline'
import navigationCss from 'swiper/element/css/navigation?inline'

// Módulos usados em todos os carrosséis do projeto.
// Mantidos aqui para que o bundle só inclua o que é necessário.
const DEFAULT_MODULES = [Autoplay, Navigation, Pagination, A11y]

// CSS dos módulos precisa ser injetado no Shadow DOM do swiper-container (Swiper v12+).
const DEFAULT_MODULE_STYLES = [paginationCss, navigationCss]

const props = withDefaults(defineProps<{
    options?: Record<string, any>
}>(), {
    options: () => ({})
})

const containerRef = ref<any>(null)

watch(containerRef, (el) => {
    if (!el) return
    const extra = Array.isArray(props.options.modules) ? props.options.modules : []
    const extraStyles = Array.isArray(props.options.injectStyles) ? props.options.injectStyles : []
    Object.assign(el, {
        ...props.options,
        modules: [...DEFAULT_MODULES, ...extra],
        injectStyles: [...DEFAULT_MODULE_STYLES, ...extraStyles]
    })
    el.initialize()
})

defineExpose({
    get swiper() { return containerRef.value?.swiper }
})
</script>
