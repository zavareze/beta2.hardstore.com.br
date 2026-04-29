<template>
    <ShopPageCategory :columns="3" sidebar-position="start" view-mode="grid" />
</template>

<script setup lang="ts">
definePageMeta({ middleware: 'shop-init' })
</script>
