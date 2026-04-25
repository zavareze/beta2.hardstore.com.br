<template>
    <AccountLayout>
        <div class="card">
            <div class="card-header">
                <h5>Endereços</h5>
            </div>
            <div class="card-divider" />
            <div class="card-body">
                <div class="row no-gutters">
                    <div class="col-12 col-lg-12 col-xl-12">
                        <div class="form-row">
                            <div class="form-group col-md-6">
                                <div class="form-floating">
                                    <input
                                        id="checkout-cep"
                                        v-model="address.cep"
                                        class="form-control"
                                        :class="{'is-invalid': cepError != ''}"
                                        type="text"
                                        inputmode="numeric"
                                        maxlength="9"
                                        placeholder="CEP"
                                        autocomplete="postal-code"
                                        @input="formatCep"
                                        @blur="buscaCEP()"
                                    >
                                    <label for="checkout-cep">CEP</label>
                                    <div class="invalid-feedback">
                                        {{ cepError }}
                                    </div>
                                </div>
                            </div>
                            <div class="form-group col-md-6">
                                <div class="form-floating">
                                    <input id="checkout-logradouro" v-model="address.logradouro" class="form-control" type="text" placeholder="Logradouro" autocomplete="address-line1">
                                    <label for="checkout-logradouro">Logradouro</label>
                                </div>
                            </div>
                            <div class="form-group col-md-6">
                                <div class="form-floating">
                                    <input id="checkout-numero" ref="numeroRef" v-model="address.numero" class="form-control" type="text" placeholder="Número" autocomplete="address-line2">
                                    <label for="checkout-numero">Número</label>
                                </div>
                            </div>
                            <div class="form-group col-md-6">
                                <div class="form-floating">
                                    <input id="checkout-complemento" v-model="address.complemento" class="form-control" type="text" placeholder="Complemento" autocomplete="address-line3">
                                    <label for="checkout-complemento">Complemento</label>
                                </div>
                            </div>
                            <div class="form-group col-md-6">
                                <div class="form-floating">
                                    <input id="checkout-bairro" v-model="address.bairro" class="form-control" type="text" placeholder="Bairro" autocomplete="address-level3">
                                    <label for="checkout-bairro">Bairro</label>
                                </div>
                            </div>
                            <div class="form-group col-md-6">
                                <div class="form-floating">
                                    <input id="checkout-cidade" v-model="address.cidade" class="form-control" type="text" placeholder="Cidade" autocomplete="address-level2">
                                    <label for="checkout-cidade">Cidade</label>
                                </div>
                            </div>
                            <div class="form-group col-md-6">
                                <div class="form-floating">
                                    <select id="checkout-country" v-model="address.uf" class="form-select" autocomplete="address-level1">
                                        <option value="">UF</option>
                                        <option v-for="state in stateOptions" :key="state">{{ state }}</option>
                                    </select>
                                    <label for="checkout-country">UF</label>
                                </div>
                            </div>
                        </div>
                        <div class="form-group mt-3 mb-0">
                            <button class="btn btn-primary" type="button" @click="saveAddress(address)">
                                Salvar
                            </button>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    </AccountLayout>
</template>

<script setup lang="ts">
import { useAccountStore } from '~/stores/account'

const account = useAccountStore()
const route = useRoute()
const router = useRouter()

useHead({ title: 'Editar Endereço' })

const emptyAddress = {
    cep: '',
    bairro: '',
    cidade: '',
    complemento: '',
    logradouro: '',
    numero: '',
    referencia: '',
    uf: ''
}

const address = ref(Object.assign({}, emptyAddress))
const cepError = ref('')
const numeroRef = ref<HTMLInputElement | null>(null)
const stateOptions = ['AC', 'AL', 'AM', 'AP', 'BA', 'CE', 'DF', 'ES', 'GO', 'MA', 'MG', 'MS', 'MT', 'PA', 'PB', 'PE', 'PI', 'PR', 'RJ', 'RN', 'RO', 'RR', 'RS', 'SC', 'SE', 'SP', 'TO']

onBeforeMount(() => {
    if (!account.user.document)
        router.push('/account/login')
})

onMounted(() => {
    loadAddress()
})

async function loadAddress () {
    if (!account.user.document) return
    if (!account.addresses.length) await account.getAddresses()
    account.selectAddress(Number(route.params.id))
    address.value = Object.assign({}, emptyAddress, account.selectedAddress)
    formatCep()
}

function buscaCEP () {
    cepError.value = ''
    const cep = address.value.cep.replace(/\D/g, '')
    if (cep.length !== 8) {
        cepError.value = 'O CEP deve ter 8 digitos'
    } else {
        account.buscaCEP(cep).then((result) => {
            if (result.message) {
                cepError.value = result.message
            } else {
                numeroRef.value?.focus()
                address.value = Object.assign(address.value, {
                    logradouro: result.street,
                    uf: result.state,
                    cidade: result.city,
                    bairro: result.neighborhood
                })
            }
        })
    }
}

function formatCep () {
    const digits = address.value.cep.replace(/\D/g, '').slice(0, 8)
    address.value.cep = digits.length > 5 ? `${digits.slice(0, 5)}-${digits.slice(5)}` : digits
}

function saveAddress(addr) {
    account.setAddress(addr).then((result) => {
        router.back();
    })
}
</script>
