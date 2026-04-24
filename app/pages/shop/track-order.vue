<template>
    <div>
        <PageHeader
            :breadcrumb="[
                { title: 'Home', url: '/' },
                { title: 'Acompanhar Pedido', url: '/shop/track-order' },
            ]"
        />

        <div class="block">
            <div class="container">
                <div class="row justify-content-center">
                    <div class="col-xl-5 col-lg-6 col-md-8">
                        <div class="card flex-grow-1 mb-0 mt-lg-4 mt-md-3 mt-2">
                            <div class="card-body">
                                <div class="card-title text-center">
                                    <h1 class="pt-lg-0 pt-2">
                                        Acompanhar Pedido
                                    </h1>
                                </div>
                                <p class="mb-4 pt-2">
                                    Este é um serviço de caráter exclusivamente informativo.
                                    Não possui efeito legal, podendo sofrer alterações sem prévio aviso.
                                </p>
                                <form>
                                    <div class="form-group">
                                        <label for="track-order-id">CPF/CNPJ</label>
                                        <input
                                            id="track-order-id"
                                            class="form-control"
                                            type="text"
                                            v-model="user.document"
                                        >
                                    </div>
                                    <div class="form-group">
                                        <label for="track-email">Seu E-mail</label>
                                        <input
                                            id="track-email"
                                            class="form-control"
                                            type="email"
                                            v-model="user.email"
                                        >
                                    </div>
                                    <div class="pt-3">
                                        <button type="button" class="btn btn-primary btn-lg btn-block" @click="trackOrder()">
                                            Rastrear
                                        </button>
                                    </div>
                                </form>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    </div>
</template>

<script setup lang="ts">
import { useAccountStore } from '~/stores/account'

const account = useAccountStore()
const router = useRouter()

useHead({ title: 'Acompanhar Pedido' })

const user = ref({
    document: '',
    email: ''
})

function trackOrder () {
    account.trackOrder(user.value)
        .then(result => router.push('/account/track/'+result.data))
        .catch(result => {
            useNuxtApp().$notify?.({
                group: 'api',
                type: 'error',
                text: result.message,
                duration: 5000
            })
        })
}
</script>
