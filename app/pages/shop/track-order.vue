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
                                <form @submit.prevent="trackOrder">
                                    <div class="form-group">
                                        <label for="track-order-id">CPF/CNPJ</label>
                                        <input
                                            id="track-order-id"
                                            class="form-control"
                                            type="text"
                                            v-model="user.document"
                                            autocomplete="username"
                                            required
                                            @input="formatDocument"
                                        >
                                    </div>
                                    <div class="form-group">
                                        <label for="track-email">Seu E-mail</label>
                                        <input
                                            id="track-email"
                                            class="form-control"
                                            type="email"
                                            v-model="user.email"
                                            autocomplete="email"
                                            required
                                        >
                                    </div>
                                    <div class="pt-3">
                                        <button type="submit" class="btn btn-primary btn-lg btn-block">
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

function formatDocument () {
    const digits = user.value.document.replace(/\D/g, '')

    if (digits.length > 11) {
        user.value.document = formatCnpj(digits.slice(0, 14))
        return
    }

    user.value.document = formatCpf(digits.slice(0, 11))
}

function formatCpf (digits: string) {
    if (digits.length > 9) return `${digits.slice(0, 3)}.${digits.slice(3, 6)}.${digits.slice(6, 9)}-${digits.slice(9)}`
    if (digits.length > 6) return `${digits.slice(0, 3)}.${digits.slice(3, 6)}.${digits.slice(6)}`
    if (digits.length > 3) return `${digits.slice(0, 3)}.${digits.slice(3)}`
    return digits
}

function formatCnpj (digits: string) {
    if (digits.length > 12) return `${digits.slice(0, 2)}.${digits.slice(2, 5)}.${digits.slice(5, 8)}/${digits.slice(8, 12)}-${digits.slice(12)}`
    if (digits.length > 8) return `${digits.slice(0, 2)}.${digits.slice(2, 5)}.${digits.slice(5, 8)}/${digits.slice(8)}`
    if (digits.length > 5) return `${digits.slice(0, 2)}.${digits.slice(2, 5)}.${digits.slice(5)}`
    if (digits.length > 2) return `${digits.slice(0, 2)}.${digits.slice(2)}`
    return digits
}
</script>
