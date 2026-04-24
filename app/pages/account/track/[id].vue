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
                <Tracking />
            </div>
        </div>
    </div>
</template>

<script setup lang="ts">
import { useAccountStore } from '~/stores/account'

const account = useAccountStore()
const route = useRoute()

useHead({ title: 'Rastreamento de Pedido' })

await useAsyncData('tracking', async () => {
    if (route.params.id)
        await account.getTracking(route.params.id as string)
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
