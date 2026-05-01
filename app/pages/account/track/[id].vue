<template>
    <div class="block order-success">
        <div class="container">
            <div class="order-success__body">
                <div class="order-success__header">
                    <div class="order-success__actions">
                        <AppLink to="/" class="btn btn-xs btn-secondary">
                            Ir para página inicial
                        </AppLink>
                    </div>
                    <br />
                </div>
                <br />
                <div v-if="trackingError" class="alert alert-danger">
                    {{ trackingError }}
                </div>
                <div v-else-if="!rastreios.length" class="alert alert-info">
                    Nenhum rastreamento encontrado para este pedido.
                </div>
                <Tracking v-else :rastreios="rastreios" />
            </div>
        </div>
    </div>
</template>

<script setup lang="ts">
import { useAccountStore } from '~/stores/account'

const account = useAccountStore()
const route = useRoute()
const rastreios = computed(() => account.order?.rastreios || [])
const trackingError = ref('')

useHead({ title: 'Rastreamento de Pedido' })

await useAsyncData('tracking', async () => {
    try {
        if (route.params.id) {
            await account.getTracking(route.params.id as string)
        }
    } catch (error: any) {
        trackingError.value = error?.response?.data?.message || error?.message || 'Não foi possível localizar o rastreamento deste pedido.'
    }

    return true
})
</script>
<style scoped>
canvas {
  width: 500px;
  background: transparent;
  margin: 0px auto;
}
</style>
