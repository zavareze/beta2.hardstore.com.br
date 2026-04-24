<template>
    <div>
        <PageHeader
            title="Cadastro"
            :breadcrumb="[
                {title: 'Home', url: '/'},
                {title: 'Cadastro', url: '/account/signin'},
            ]"
        />

        <div class="block">
            <div class="container">
                <div class="row">
                    <div class="col-12">
                        <div class="card mb-lg-0">
                            <div class="card-body">
                                <h3 class="card-title">
                                    Identificação
                                </h3>
                                <form novalidate @submit.prevent="checkForm">
                                    <div class="row">
                                        <div class="alert alert-danger col-12" v-show="createError">{{ createError }}</div>
                                            <div class="form-group col-md-6 col-12">
                                                <mdb-input id="checkout-nome" label="Nome" v-model="user.nome" required invalidFeedback="Você deve informar seu Nome Completo" type="text" />
                                            </div>
                                            <div class="form-group col-md-2 col-6">
                                                <mdb-select
                                                    label="Tipo Pessoa"
                                                    v-model="comboTipoPessoa"
                                                    @change="checkTipoPessoa()"
                                                />
                                            </div>
                                            <div class="form-group col-md-4 col-6">
                                                <mdb-input id="checkout-document" ref="document"
                                                v-model="user.document"
                                                v-mdb-input-mask="documentMask"
                                                required invalidFeedback="Você deve informar seu CPF/CNPJ"
                                                type="text" label="CPF / CNPJ" :class="{ 'is-invalid': fieldError == 'document' && messageError }" />
                                            </div>
                                            <div class="form-group col-md-3 col-12">
                                                <mdb-input id="checkout-email" v-model="user.email"
                                                required invalidFeedback="Você deve informar seu E-mail"
                                                ref="email" type="text" label="Email" :class="{ 'is-invalid': fieldError == 'email' && messageError }" />
                                            </div>
                                            <div class="form-group col-md-3 col-12">
                                                <mdb-input id="checkout-celular" v-model="user.telefone_celular" type="text" label="Telefone Celular" v-mdb-input-mask="'(♠♠) ♠♠♠♠♠-♠♠♠♠'" />
                                            </div>
                                            <div class="form-group col-md-3 col-12">
                                                <mdb-input id="checkout-residencial" v-model="user.telefone_residencial" type="text" label="Telefone Residencial" v-mdb-input-mask="'(♠♠) ♠♠♠♠-♠♠♠♠'" />

                                            </div>
                                            <div class="form-group col-md-3 col-12">
                                                <mdb-input id="checkout-comercial" v-model="user.telefone_comercial" type="text" label="Telefone Comercial" v-mdb-input-mask="'(♠♠) ♠♠♠♠-♠♠♠♠'" />
                                            </div>
                                            <div class="form-group col-md-2 col-12">
                                                <mdb-input id="checkout-cep" v-model="user.cep" type="text" label="CEP"
                                                required invalidFeedback="Você deve informar seu CEP"
                                                v-mdb-input-mask="'♠♠♠♠♠-♠♠♠'" @blur="buscaCEP()" :class="{ 'is-invalid': cepError }" />
                                                <div class="invalid-feedback">
                                                    {{ cepError }}
                                                </div>
                                            </div>
                                            <div class="form-group col-md-6 col-12">
                                                <mdb-input id="checkout-logradouro" v-model="user.logradouro"
                                                required invalidFeedback="Você deve informar seu Endereço"
                                                ref="logradouro" type="text" label="Logradouro" :class="{ 'is-invalid': fieldError == 'logradouro' && messageError }" />
                                            </div>
                                            <div class="form-group col-md-4 col-12">
                                                <mdb-input id="checkout-numero" ref="numero"
                                                required invalidFeedback="Você deve informar o Número"
                                                v-model="user.numero" type="text" label="Número" :class="{ 'is-invalid': fieldError == 'numero' && messageError }" />
                                            </div>
                                            <div class="form-group col-md-3 col-12">
                                                <mdb-input id="checkout-complemento" v-model="user.complemento" type="text" label="Complemento" />
                                            </div>
                                            <div class="form-group col-md-3 col-12">
                                                <mdb-input id="checkout-bairro" v-model="user.bairro"
                                                required invalidFeedback="Você deve informar seu Bairro"
                                                type="text" ref="bairro" label="Bairro" :class="{ 'is-invalid': fieldError == 'bairro' && messageError }" />
                                            </div>
                                            <div class="form-group col-md-3 col-12">
                                                <mdb-input id="checkout-cidade" v-model="user.cidade"
                                                required invalidFeedback="Você deve informar sua Cidade"
                                                type="text" ref="cidade" label="Cidade" :class="{ 'is-invalid': fieldError == 'cidade' && messageError }" />
                                            </div>
                                            <div class="form-group col-md-3 col-12">
                                                <mdb-select search
                                                    label="UF"
                                                    v-model="comboUF"
                                                    @change="changeUF()"
                                                    searchPlaceholder="Informe o Estado"
                                                    required invalidFeedback="Você deve informar seu Estado"
                                                />
                                            </div>
                                            <button type="submit" class="btn btn-primary mt-4">
                                                Registrar-se
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
const route = useRoute()
const router = useRouter()

useHead({ title: 'Cadastre-se' })

const comboTipoPessoa = ref([{ text: "Pessoa Física", value: "1", selected: true },{ text: "Pessoa Jurídica", value: "2" }])
const comboUF = ref([{ text: "AC", value: "AC", selected: false },{ text: "AL", value: "AL" },{ text: "AM", value: "AM" },{ text: "AP", value: "AP" },
            { text: "BA", value: "BA" },{ text: "CE", value: "CE" },{ text: "DF", value: "DF" },{ text: "ES", value: "ES" },
            { text: "GO", value: "GO" },{ text: "MA", value: "MA" },{ text: "MG", value: "MG" },{ text: "MS", value: "MS" },
            { text: "MT", value: "MT" },{ text: "PA", value: "PA" },{ text: "PB", value: "PB" },{ text: "PE", value: "PE" },
            { text: "PI", value: "PI" },{ text: "PR", value: "PR" },{ text: "RJ", value: "RJ" },{ text: "RN", value: "RN" },
            { text: "RO", value: "RO" },{ text: "RR", value: "RR" },{ text: "RS", value: "RS" },{ text: "SC", value: "SC" },
            { text: "SE", value: "SE" },{ text: "SP", value: "SP" },{ text: "TO", value: "TO" }])
const user = ref({
    nome: '',
    tipo_pessoa: '1',
    document: '',
    email: route.query.email || '',
    telefone_celular: '',
    telefone_residencial: '',
    telefone_comercial: '',
    cep: route.query.cep || '',
    logradouro: '',
    numero: '',
    complemento: '',
    bairro: '',
    cidade: '',
    uf: ''
})
const cepError = ref('')
const messageError = ref('')
const createError = ref('')
const fieldError = ref('')
const maskCPF = '♠♠♠.♠♠♠.♠♠♠-♠♠'
const maskCNPJ = '♠♠.♠♠♠.♠♠♠/♠♠♠♠-♠♠'
const documentMask = ref(maskCPF)

const documentRef = ref<HTMLElement | null>(null)
const emailRef = ref<HTMLElement | null>(null)
const logradouroRef = ref<HTMLElement | null>(null)
const numeroRef = ref<HTMLElement | null>(null)
const bairroRef = ref<HTMLElement | null>(null)
const cidadeRef = ref<HTMLElement | null>(null)

function checkForm(event) {
    event.target.classList.add('was-validated');
    cadastrar()
}

function checkTipoPessoa () {
    if (comboTipoPessoa.value.filter(x => x.selected)[0].value == '1') {
        documentMask.value = maskCPF
    } else {
        documentMask.value = maskCNPJ
    }
}

function changeUF () {
    user.value.uf = comboUF.value.filter(x => x.selected)[0].value
}

function setUF (uf) {
    comboUF.value.forEach(option => { option.selected = false; });
    const found = comboUF.value.filter(x => x.value === uf)[0]
    if (found) found.selected = true
    comboUF.value.sort();
    user.value.uf = uf
}

onMounted(() => {
    if (user.value && user.value.cep != '')
        buscaCEP()
})

function cadastrar () {
    if (messageError.value == '') {
        account.createUser(user.value).then((result) => {
        }).catch(result => {
            createError.value = result.message
        })
    } else {
        if (fieldError.value != '') {
            const refs: Record<string, any> = { document: documentRef, email: emailRef, logradouro: logradouroRef, numero: numeroRef, bairro: bairroRef, cidade: cidadeRef }
            refs[fieldError.value]?.value?.focus()
        }
    }
}

function buscaCEP () {
    cepError.value = ''
    if (user.value.cep.length !== 9) {
        cepError.value = 'O CEP deve ter 8 digitos'
    } else {
        account.buscaCEP(user.value.cep).then((result) => {
            if (result.message) {
                cepError.value = result.message
            } else {
                numeroRef.value?.focus()
                setUF(result.state)
                user.value.cidade = result.city
                user.value.bairro = result.neighborhood
                user.value.logradouro = result.street
                console.log(user.value)
            }
        })
    }
}
</script>
