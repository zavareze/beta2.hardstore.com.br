<template>
    <slot />
</template>

<script setup lang="ts">
import { provide, useSlots, getCurrentInstance } from 'vue'

const slots = useSlots()

function getSearchScope() {
    if (slots.default) {
        const vnode = slots.default()[0]
        return vnode?.el || null
    }
    return null
}

provide('getSearchScope', getSearchScope)
</script>
