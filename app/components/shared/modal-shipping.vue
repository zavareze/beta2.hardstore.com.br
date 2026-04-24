<template>
    <AppModal id="modalShipping" hide-footer>
        <template #modal-title>
            <span class="glyphicon glyphicon-road" /> <strong>Opções de frete para sua região</strong>
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
                                <input
                                    v-model="cep.cep"
                                    placeholder="CEP"
                                    v-mask="'#####-###'"
                                    type="text"
                                    autocomplete="off"
                                    maxlength="10"
                                    class="search__input"
                                    style="font-size: xxx-large;text-align: center;"
                                    @keyup="calculaFrete()"
                                >
                                <button type="button" class="search__button search__button--type--submit" style="width: 80px" @click="calculaFrete()">
                                    <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" class="">
                                        <path d="M19.2 17.8s-.2.5-.5.8c-.4.4-.9.6-.9.6s-.9.7-2.8-1.6c-1.1-1.4-2.2-2.8-3.1-3.9-1 .8-2.4 1.3-3.9 1.3-3.9 0-7-3.1-7-7s3.1-7 7-7 7 3.1 7 7c0 1.5-.5 2.9-1.3 4 1.1.8 2.5 2 4 3.1 2.3 1.7 1.5 2.7 1.5 2.7zM8 3C5.2 3 3 5.2 3 8s2.2 5 5 5 5-2.2 5-5-2.2-5-5-5z" />
                                    </svg>
                                </button>
                                <div class="search__border" />
                            </form>
                        </div>
                    </div>
                </div>
                <a href="http://www.buscacep.correios.com.br/sistemas/buscacep/buscaCepEndereco.cfm" class="pt-2" target="_blank">Não sabe seu CEP? Clique aqui!</a>
            </div>
            <table v-if="cep.city" class="table table-striped">
                <thead>
                    <tr>
                        <th colspan="3">
                            Hardstore
                            <template v-if="local === 1">
                                Porto Alegre
                            </template>
                            <template v-if="local === 2">
                                Caxias do Sul
                            </template> para <span id="infofrete">{{ cep.city }}/{{ cep.state }}</span>
                        </th>
                    </tr>
                    <tr>
                        <th>Frete</th>
                        <th>Prazo</th>
                        <th>Valor</th>
                    </tr>
                </thead>
                <tbody>
                    <tr v-if="fretes.sedex && fretes.sedex.valor">
                        <td>Sedex</td>
                        <td>{{ fretes.sedex.prazo_entrega }} dias úteis</td>
                        <td>{{ price(fretes.sedex.valor) }}</td>
                    </tr>
                    <tr v-if="fretes.pac && fretes.pac.valor">
                        <td>PAC</td>
                        <td>{{ fretes.pac.prazo_entrega }} dias úteis</td>
                        <td>{{ price(fretes.pac.valor) }}</td>
                    </tr>
                    <tr v-if="fretes.motoboy && fretes.motoboy.valor">
                        <td>Motoboy</td>
                        <td>{{ fretes.motoboy.prazo_entrega }} dias úteis</td>
                        <td>{{ price(fretes.motoboy.valor) }}</td>
                    </tr>
                </tbody>
            </table>
            <div v-if="error !== ''" class="alert alert-danger mb-3">
                {{ error }}
            </div>
        </div>
        <button class="mt-3 float-end btn btn-secondary" @click="useModal().hide('modalShipping')">
            Fechar
        </button>
    </AppModal>
</template>

<script setup lang="ts">
import { ref, onMounted } from 'vue'
import { useAccountStore } from '~/stores/account'

const props = defineProps<{
    weight: number
    price_: number
    stock: boolean
    local: number
    multiple?: boolean
}>()

const emit = defineEmits<{
    finish: [data: any]
}>()

const accountStore = useAccountStore()
const { price } = usePrice()

const error = ref('')
const cep = ref<any>({ cep: accountStore.cep || '' })
const estimativa = ref('')
const fretes = ref<any>({})
const loading = ref(false)
const modalVisible = ref(true)

onMounted(() => {
    calculaFrete()
})

async function calculaFrete() {
    if ((cep.value.cep) && (cep.value.cep.toString().replace(/\D/g, '').length === 8)) {
        loading.value = true
        try {
            const result = await accountStore.calculaFrete({
                cep: cep.value.cep,
                peso: props.weight,
                valor: props.price_,
                multiplo: props.multiple,
                encomenda: props.stock,
                object: 'modal-shipping'
            })
            loading.value = false
            if (result.data?.cep?.message) {
                error.value = result.data.cep.message
                estimativa.value = ''
                fretes.value = {}
                cep.value = { cep: '' }
            } else {
                error.value = ''
                estimativa.value = result.data.estimativa
                cep.value = result.data.cep
                fretes.value = result.data
                accountStore.setCEP(result.data.cep.cep)
            }
            emit('finish', result.data)
        } catch {}
    }
}
</script>
