<script setup lang="ts">
const props = defineProps<{ action: () => Promise<void> }>()
const isLoading = ref(false)

async function run() {
    if (!props.action || isLoading.value) return
    isLoading.value = true
    await props.action()
    isLoading.value = false
}
</script>

<template>
    <slot :run="run" :is-loading="isLoading" />
</template>
