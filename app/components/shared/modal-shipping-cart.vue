<template>
    <AppModal id="modalShippingCart" hide-footer no-close-on-backdrop @hidden="checkCEP">
        <template #modal-title>
            <strong>Digite seu CEP para opções de entrega</strong>
        </template>
        <div class="d-block text-center">
            <button v-if="loading" type="button" class="btn btn-light btn-loading btn-xl">
                Carregando
            </button>
            <div v-if="!loading">
                <div class="site-header__search mb-3">
                    <div class="search search--location--header">
                        <div class="search__body">
                            <form class="search__form" style="height: 80px">
                                <input placeholder="CEP" type="text" autocomplete="off" maxlength="10" class="search__input"
                                    style="font-size: xxx-large;text-align: center;"
                                    v-model="cep.cep"
                                    v-mask="'#####-###'"
                                    @keyup="calculaFrete()"
                                >
                                <button type="button" class="search__button search__button--type--submit" @click="calculaFrete()" style="width: 80px">
                                    <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20">
                                        <path d="M19.2 17.8s-.2.5-.5.8c-.4.4-.9.6-.9.6s-.9.7-2.8-1.6c-1.1-1.4-2.2-2.8-3.1-3.9-1 .8-2.4 1.3-3.9 1.3-3.9 0-7-3.1-7-7s3.1-7 7-7 7 3.1 7 7c0 1.5-.5 2.9-1.3 4 1.1.8 2.5 2 4 3.1 2.3 1.7 1.5 2.7 1.5 2.7zM8 3C5.2 3 5 5.2 3 8s2.2 5 5 5 5-2.2 5-5-2.2-5-5-5z"></path>
                                    </svg>
                                </button>
                                <div class="search__border"></div>
                            </form>
                        </div>
                    </div>
                </div>
                <a href="http://www.buscacep.correios.com.br/sistemas/buscacep/buscaCepEndereco.cfm" target="_blank">Não sabe seu CEP? Clique aqui!</a>
            </div>
            <div v-if="error !== ''" class="alert alert-danger mb-3">
                {{ error }}
            </div>
        </div>
    </AppModal>
</template>

<script setup lang="ts">
import { ref, onMounted } from 'vue'
import { useAccountStore } from '~/stores/account'
import { useCartStore } from '~/stores/cart'

const props = defineProps<{
    weight: number
    price: number
    stock: boolean
    local: number
}>()

const emit = defineEmits<{
    finish: [data: any]
}>()

const accountStore = useAccountStore()
const cartStore = useCartStore()

const error = ref('')
const cep = ref({ cep: accountStore.cep || '' })
const loading = ref(false)

onMounted(() => {
    calculaFrete()
})

function checkCEP() {
    if (accountStore.cep == '') {
        // show modal again if needed
    }
}

async function calculaFrete() {
    if ((cep.value.cep) && (cep.value.cep.toString().replace(/\D/g, '').length === 8)) {
        loading.value = true
        error.value = ''
        try {
            const result = await accountStore.calculaFrete({
                cep: cep.value?.cep,
                peso: props.weight,
                valor: props.price,
                encomenda: props.stock,
                multiplo: cartStore.multiple,
                cart: true,
                object: 'modal-shipping-cart'
            })
            loading.value = false
            if (!result.data?.cep?.message) {
                accountStore.setCEP(result.data.cep.cep)
                emit('finish', result.data)
            } else {
                if (result.data?.cep?.message)
                    error.value = result.data.cep.message
                else
                    error.value = 'CEP Não localizado'
            }
            setShipping()
        } catch (result: any) {
            loading.value = false
            if (result.data?.cep?.message)
                error.value = result.data.cep.message
            else
                error.value = 'CEP Não localizado'
        }
    }
}

function setShipping() {
    switch (cartStore.shippingMethod * 1) {
        case 2:
            cartStore.setShipping({ shipping: accountStore.calculoFrete.fretes.pac.valor })
            break
        case 3:
            cartStore.setShipping({ shipping: accountStore.calculoFrete.fretes.motoboy.valor })
            break
        default:
            cartStore.setShipping({ shipping: accountStore.calculoFrete.fretes.sedex.valor })
            break
    }
}
</script>
