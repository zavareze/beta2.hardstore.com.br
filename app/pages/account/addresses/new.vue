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
                                <div class="form-group">
                                    <mdb-input
                                        id="checkout-cep"
                                        v-model="address.cep"
                                        :class="{'is-invalid': cepError != ''}"
                                        type="text"
                                        label="CEP" v-mdb-input-mask="'♠♠♠♠♠-♠♠♠'"
                                        @blur="buscaCEP()"
                                    />
                                    <div class="invalid-feedback">
                                        {{ cepError }}
                                    </div>
                                </div>
                            </div>
                            <div class="form-group col-md-6">
                                <mdb-input id="checkout-logradouro" v-model="address.logradouro" type="text" label="Logradouro" />
                            </div>
                            <div class="form-group col-md-6">
                                <mdb-input id="checkout-numero" ref="numeroRef" v-model="address.numero" type="text" label="Número" />
                            </div>
                            <div class="form-group col-md-6">
                                <mdb-input id="checkout-complemento" v-model="address.complemento" type="text" label="Complemento" />
                            </div>
                            <div class="form-group col-md-6">
                                <mdb-input id="checkout-bairro" v-model="address.bairro" type="text" label="Bairro" />
                            </div>
                            <div class="form-group col-md-6">
                                <mdb-input id="checkout-cidade" v-model="address.cidade" type="text" label="Cidade" />
                            </div>
                            <div class="form-group col-md-6">
                                <label for="checkout-country">UF</label>
                                <select id="checkout-country" v-model="address.uf" class="form-control">
                                    <option value="">UF</option>
                                    <option>AC</option>
                                    <option>AL</option>
                                    <option>AM</option>
                                    <option>AP</option>
                                    <option>BA</option>
                                    <option>CE</option>
                                    <option>DF</option>
                                    <option>ES</option>
                                    <option>GO</option>
                                    <option>MA</option>
                                    <option>MG</option>
                                    <option>MS</option>
                                    <option>MT</option>
                                    <option>PA</option>
                                    <option>PB</option>
                                    <option>PE</option>
                                    <option>PI</option>
                                    <option>PR</option>
                                    <option>RJ</option>
                                    <option>RN</option>
                                    <option>RO</option>
                                    <option>RR</option>
                                    <option>RS</option>
                                    <option>SC</option>
                                    <option>SE</option>
                                    <option>SP</option>
                                    <option>TO</option>
                                </select>
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
const router = useRouter()

useHead({ title: 'Edit Address' })

const address = ref({
    cep: '',
    bairro: '',
    cidade: '',
    complemento: '',
    logradouro: '',
    numero: '',
    referencia: '',
    uf: ''
})
const cepError = ref('')
const numeroRef = ref<HTMLElement | null>(null)

onBeforeMount(() => {
    if (!account.user.document)
        router.push('/account/login')
})

function buscaCEP () {
    cepError.value = ''
    if (address.value.cep.length !== 9) {
        cepError.value = 'O CEP deve ter 8 digitos'
    } else {
        account.buscaCEP(address.value.cep).then((result) => {
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

function saveAddress(addr) {
    account.setAddress(addr).then(() => {
        router.back();
    })
}
</script>
