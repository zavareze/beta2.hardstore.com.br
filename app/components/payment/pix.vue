<template>
    <AppModal id="modalPaymentPix" hide-footer no-close-on-backdrop size="md">
        <template #modal-title>Pagamento via PIX</template>
        <div class="text-center">
            <img v-show="data.qrCode" :src="data.qrCode" />
        </div>
    </AppModal>
</template>

<script setup lang="ts">
defineProps<{
    data: any
}>()
</script>
