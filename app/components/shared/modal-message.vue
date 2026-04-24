<template>
    <AppModal id="modalMessage" hide-footer>
        <template #modal-title>
            <strong>{{ title }}</strong>
        </template>
        <div class="d-block text-center alert alert-danger mb-3">
            {{ message }}
        </div>
    </AppModal>
</template>

<script setup lang="ts">
defineProps<{
    title?: string
    message: string
}>()
</script>
