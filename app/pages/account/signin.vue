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
                                        <div class="alert alert-danger col-12" v-show="createError">
                                            <template v-if="duplicateAccountError">
                                                CPF/CNPJ ou e-mail já possui cadastro. Recupere sua senha,
                                                <a href="#" class="alert-link" @click.prevent="recoverDuplicateAccount">
                                                    {{ recoveryLoading ? 'enviando...' : 'clique aqui!' }}
                                                </a>
                                            </template>
                                            <template v-else>
                                                {{ createError }}
                                            </template>
                                        </div>
                                        <div class="alert alert-success col-12" v-show="createSuccess">{{ createSuccess }}</div>
                                            <div class="form-group col-md-6 col-12">
                                                <div class="form-floating">
                                                    <input
                                                        id="checkout-nome"
                                                        ref="nomeRef"
                                                        v-model="user.nome"
                                                        class="form-control"
                                                        type="text"
                                                        placeholder="Nome"
                                                        autocomplete="name"
                                                        required
                                                        :class="{ 'is-invalid': fieldError == 'nome' && messageError }"
                                                    >
                                                    <label for="checkout-nome">Nome</label>
                                                    <div class="invalid-feedback">Você deve informar seu Nome Completo</div>
                                                </div>
                                            </div>
                                            <div class="form-group col-md-2 col-6">
                                                <div class="form-floating">
                                                    <select
                                                        id="checkout-tipo-pessoa"
                                                        v-model="user.tipo_pessoa"
                                                        class="form-select"
                                                        @change="checkTipoPessoa"
                                                    >
                                                        <option v-for="option in tipoPessoaOptions" :key="option.value" :value="option.value">
                                                            {{ option.text }}
                                                        </option>
                                                    </select>
                                                    <label for="checkout-tipo-pessoa">Tipo Pessoa</label>
                                                </div>
                                            </div>
                                            <div class="form-group col-md-4 col-6">
                                                <div class="form-floating">
                                                    <input
                                                        id="checkout-document"
                                                        ref="documentRef"
                                                        v-model="user.document"
                                                        class="form-control"
                                                        type="text"
                                                        inputmode="numeric"
                                                        placeholder="CPF / CNPJ"
                                                        autocomplete="off"
                                                        required
                                                        :class="{ 'is-invalid': fieldError == 'document' && messageError }"
                                                        @input="onDocumentInput"
                                                        @blur="validateDocumentField(true)"
                                                    >
                                                    <label for="checkout-document">CPF / CNPJ</label>
                                                    <div class="invalid-feedback">
                                                        {{ fieldError == 'document' && messageError ? messageError : 'Você deve informar seu CPF/CNPJ' }}
                                                    </div>
                                                </div>
                                            </div>
                                            <div class="form-group col-md-3 col-12">
                                                <div class="form-floating">
                                                    <input
                                                        id="checkout-email"
                                                        ref="emailRef"
                                                        v-model="user.email"
                                                        class="form-control"
                                                        type="email"
                                                        placeholder="email@exemplo.com"
                                                        autocomplete="email"
                                                        required
                                                        :class="{ 'is-invalid': fieldError == 'email' && messageError }"
                                                        @input="onEmailInput"
                                                        @blur="validateEmailField(true)"
                                                    >
                                                    <label for="checkout-email">Email</label>
                                                    <div class="invalid-feedback">
                                                        {{ fieldError == 'email' && messageError ? messageError : 'Informe um e-mail válido, como nome@exemplo.com' }}
                                                    </div>
                                                </div>
                                            </div>
                                            <div class="form-group col-md-3 col-12">
                                                <div class="form-floating">
                                                    <input
                                                        id="checkout-celular"
                                                        ref="telefoneCelularRef"
                                                        v-model="user.telefone_celular"
                                                        class="form-control"
                                                        type="text"
                                                        inputmode="tel"
                                                        placeholder="Telefone Celular"
                                                        autocomplete="tel"
                                                        required
                                                        :class="{ 'is-invalid': fieldError == 'telefone_celular' && messageError }"
                                                        @input="onCellPhoneInput"
                                                        @blur="validateCellPhoneField(true)"
                                                    >
                                                    <label for="checkout-celular">Telefone Celular</label>
                                                    <div class="invalid-feedback">
                                                        {{ fieldError == 'telefone_celular' && messageError ? messageError : 'Informe seu telefone celular com DDD' }}
                                                    </div>
                                                </div>
                                            </div>
                                            <div class="form-group col-md-3 col-12">
                                                <div class="form-floating">
                                                    <input
                                                        id="checkout-residencial"
                                                        v-model="user.telefone_residencial"
                                                        class="form-control"
                                                        type="text"
                                                        inputmode="tel"
                                                        placeholder="Telefone Residencial"
                                                        autocomplete="tel"
                                                        @input="formatPhone('telefone_residencial')"
                                                    >
                                                    <label for="checkout-residencial">Telefone Residencial</label>
                                                </div>
                                            </div>
                                            <div class="form-group col-md-3 col-12">
                                                <div class="form-floating">
                                                    <input
                                                        id="checkout-comercial"
                                                        v-model="user.telefone_comercial"
                                                        class="form-control"
                                                        type="text"
                                                        inputmode="tel"
                                                        placeholder="Telefone Comercial"
                                                        autocomplete="tel"
                                                        @input="formatPhone('telefone_comercial')"
                                                    >
                                                    <label for="checkout-comercial">Telefone Comercial</label>
                                                </div>
                                            </div>
                                            <div class="form-group col-md-2 col-12">
                                                <div class="form-floating">
                                                    <input
                                                        id="checkout-cep"
                                                        v-model="user.cep"
                                                        class="form-control"
                                                        type="text"
                                                        inputmode="numeric"
                                                        maxlength="9"
                                                        placeholder="CEP"
                                                        autocomplete="postal-code"
                                                        required
                                                        :class="{ 'is-invalid': cepError }"
                                                        @input="formatCep"
                                                        @blur="buscaCEP()"
                                                    >
                                                    <label for="checkout-cep">CEP</label>
                                                    <div class="invalid-feedback">
                                                        {{ cepError || 'Você deve informar seu CEP' }}
                                                    </div>
                                                </div>
                                            </div>
                                            <div class="form-group col-md-6 col-12">
                                                <div class="form-floating">
                                                    <input
                                                        id="checkout-logradouro"
                                                        ref="logradouroRef"
                                                        v-model="user.logradouro"
                                                        class="form-control"
                                                        type="text"
                                                        placeholder="Logradouro"
                                                        autocomplete="address-line1"
                                                        required
                                                        :class="{ 'is-invalid': fieldError == 'logradouro' && messageError }"
                                                    >
                                                    <label for="checkout-logradouro">Logradouro</label>
                                                    <div class="invalid-feedback">Você deve informar seu Endereço</div>
                                                </div>
                                            </div>
                                            <div class="form-group col-md-4 col-12">
                                                <div class="form-floating">
                                                    <input
                                                        id="checkout-numero"
                                                        ref="numeroRef"
                                                        v-model="user.numero"
                                                        class="form-control"
                                                        type="text"
                                                        placeholder="Número"
                                                        autocomplete="address-line2"
                                                        required
                                                        :class="{ 'is-invalid': fieldError == 'numero' && messageError }"
                                                    >
                                                    <label for="checkout-numero">Número</label>
                                                    <div class="invalid-feedback">Você deve informar o Número</div>
                                                </div>
                                            </div>
                                            <div class="form-group col-md-3 col-12">
                                                <div class="form-floating">
                                                    <input
                                                        id="checkout-complemento"
                                                        v-model="user.complemento"
                                                        class="form-control"
                                                        type="text"
                                                        placeholder="Complemento"
                                                        autocomplete="address-line3"
                                                    >
                                                    <label for="checkout-complemento">Complemento</label>
                                                </div>
                                            </div>
                                            <div class="form-group col-md-3 col-12">
                                                <div class="form-floating">
                                                    <input
                                                        id="checkout-bairro"
                                                        ref="bairroRef"
                                                        v-model="user.bairro"
                                                        class="form-control"
                                                        type="text"
                                                        placeholder="Bairro"
                                                        autocomplete="address-level3"
                                                        required
                                                        :class="{ 'is-invalid': fieldError == 'bairro' && messageError }"
                                                    >
                                                    <label for="checkout-bairro">Bairro</label>
                                                    <div class="invalid-feedback">Você deve informar seu Bairro</div>
                                                </div>
                                            </div>
                                            <div class="form-group col-md-3 col-12">
                                                <div class="form-floating">
                                                    <input
                                                        id="checkout-cidade"
                                                        ref="cidadeRef"
                                                        v-model="user.cidade"
                                                        class="form-control"
                                                        type="text"
                                                        placeholder="Cidade"
                                                        autocomplete="address-level2"
                                                        required
                                                        :class="{ 'is-invalid': fieldError == 'cidade' && messageError }"
                                                    >
                                                    <label for="checkout-cidade">Cidade</label>
                                                    <div class="invalid-feedback">Você deve informar sua Cidade</div>
                                                </div>
                                            </div>
                                            <div class="form-group col-md-3 col-12">
                                                <div class="form-floating">
                                                    <select
                                                        id="checkout-uf"
                                                        v-model="user.uf"
                                                        class="form-select"
                                                        autocomplete="address-level1"
                                                        required
                                                        :class="{ 'is-invalid': fieldError == 'uf' && messageError }"
                                                    >
                                                        <option value="" disabled>Informe o Estado</option>
                                                        <option v-for="option in comboUF" :key="option.value" :value="option.value">
                                                            {{ option.text }}
                                                        </option>
                                                    </select>
                                                    <label for="checkout-uf">UF</label>
                                                    <div class="invalid-feedback">Você deve informar seu Estado</div>
                                                </div>
                                            </div>
                                            <button type="submit" class="btn btn-primary mt-4" :class="{ 'btn-loading': account.isLoading }" :disabled="account.isLoading">
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

const tipoPessoaOptions = [
    { text: "Pessoa Física", value: "1" },
    { text: "Pessoa Jurídica", value: "2" }
]
const comboUF = ref([{ text: "AC", value: "AC" },{ text: "AL", value: "AL" },{ text: "AM", value: "AM" },{ text: "AP", value: "AP" },
            { text: "BA", value: "BA" },{ text: "CE", value: "CE" },{ text: "DF", value: "DF" },{ text: "ES", value: "ES" },
            { text: "GO", value: "GO" },{ text: "MA", value: "MA" },{ text: "MG", value: "MG" },{ text: "MS", value: "MS" },
            { text: "MT", value: "MT" },{ text: "PA", value: "PA" },{ text: "PB", value: "PB" },{ text: "PE", value: "PE" },
            { text: "PI", value: "PI" },{ text: "PR", value: "PR" },{ text: "RJ", value: "RJ" },{ text: "RN", value: "RN" },
            { text: "RO", value: "RO" },{ text: "RR", value: "RR" },{ text: "RS", value: "RS" },{ text: "SC", value: "SC" },
            { text: "SE", value: "SE" },{ text: "SP", value: "SP" },{ text: "TO", value: "TO" }])
const initialEmail = Array.isArray(route.query.email) ? route.query.email[0] : route.query.email
const initialCep = Array.isArray(route.query.cep) ? route.query.cep[0] : route.query.cep

const user = ref({
    nome: '',
    tipo_pessoa: '1',
    document: '',
    email: typeof initialEmail === 'string' ? initialEmail : '',
    telefone_celular: '',
    telefone_residencial: '',
    telefone_comercial: '',
    cep: typeof initialCep === 'string' ? initialCep : '',
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
const createSuccess = ref('')
const fieldError = ref('')
const recoveryLoading = ref(false)
const duplicateAccountError = computed(() => {
    return /já possui cadastro/i.test(createError.value)
        || /recupere sua senha/i.test(createError.value)
        || /recuperação de senha/i.test(createError.value)
})
const duplicateRecoveryTarget = computed(() => {
    const messageEmail = createError.value.match(/[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}/i)?.[0]
    const formEmail = user.value.email.trim()
    const document = user.value.document.replace(/\D/g, '')

    if (messageEmail) return messageEmail
    if (/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formEmail)) return formEmail
    if (document.length === 11 || document.length === 14) return document

    return ''
})

const nomeRef = ref<HTMLInputElement | null>(null)
const documentRef = ref<HTMLInputElement | null>(null)
const emailRef = ref<HTMLInputElement | null>(null)
const telefoneCelularRef = ref<HTMLInputElement | null>(null)
const logradouroRef = ref<HTMLInputElement | null>(null)
const numeroRef = ref<HTMLInputElement | null>(null)
const bairroRef = ref<HTMLInputElement | null>(null)
const cidadeRef = ref<HTMLInputElement | null>(null)

function checkForm(event: Event) {
    const form = event.target as HTMLFormElement
    form.classList.add('was-validated')
    validateDocumentField(true)
    validateEmailField(true)
    validateCellPhoneField(true)
    if (!form.checkValidity()) return
    cadastrar()
}

function checkTipoPessoa (event?: Event) {
    const selectedType = (event?.target as HTMLSelectElement | null)?.value
    if (selectedType === '1' || selectedType === '2') {
        user.value.tipo_pessoa = selectedType
    }
    clearDocumentValidation()
    formatDocument()
    if (user.value.document) validateDocumentField(false)
}

function setUF (uf) {
    user.value.uf = uf
}

onMounted(() => {
    formatDocument()
    formatPhone('telefone_celular')
    formatPhone('telefone_residencial')
    formatPhone('telefone_comercial')
    formatCep()
    if (user.value && user.value.cep != '')
        buscaCEP()
})

async function cadastrar () {
    createError.value = ''
    createSuccess.value = ''
    fieldError.value = ''
    messageError.value = ''

    if (!validateForm()) return

    try {
        const result = await account.createUser(user.value)
        createSuccess.value = result.message || 'Cadastro realizado com sucesso. Verifique seu e-mail para acessar sua conta.'
    } catch (result: any) {
        createError.value = result.message || account.hasError || 'Não foi possível concluir o cadastro agora.'
    }
}

async function recoverDuplicateAccount () {
    if (recoveryLoading.value) return

    const target = duplicateRecoveryTarget.value
    if (!target) {
        createError.value = 'Informe o e-mail ou CPF/CNPJ para recuperar sua senha.'
        return
    }

    recoveryLoading.value = true
    try {
        const result = await account.recoverPassword(target)
        if (result.statusCode === 200) {
            createError.value = ''
            createSuccess.value = result.message || 'Enviamos as instruções de recuperação para o e-mail cadastrado.'
        } else {
            createError.value = result.message || 'Não foi possível solicitar a recuperação de senha agora.'
        }
    } catch (result: any) {
        createError.value = result.message || 'Não foi possível solicitar a recuperação de senha agora.'
    } finally {
        recoveryLoading.value = false
    }
}

function buscaCEP () {
    cepError.value = ''
    const cep = user.value.cep.replace(/\D/g, '')
    if (cep.length !== 8) {
        cepError.value = 'O CEP deve ter 8 digitos'
    } else {
        account.buscaCEP(cep).then((result) => {
            if (result.message) {
                cepError.value = result.message
            } else {
                focusField('numero')
                setUF(result.state)
                user.value.cidade = result.city
                user.value.bairro = result.neighborhood
                user.value.logradouro = result.street
            }
        }).catch(() => {
            cepError.value = 'Não foi possível consultar o CEP agora.'
        })
    }
}

function validateForm () {
    if (!validateDocumentField(true)) return false
    if (!validateEmailField(true)) return false
    if (!validateCellPhoneField(true)) return false

    const document = user.value.document.replace(/\D/g, '')
    const cep = user.value.cep.replace(/\D/g, '')
    const email = user.value.email.trim()

    if (!/\S+\s+\S+/.test(user.value.nome.trim()))
        return setFieldError('nome', 'Você deve informar seu Nome e Sobrenome.')
    if (cep.length !== 8) {
        cepError.value = 'O CEP deve ter 8 digitos'
        createError.value = cepError.value
        return false
    }
    if (!user.value.logradouro.trim())
        return setFieldError('logradouro', 'Você deve informar seu Logradouro.')
    if (!user.value.numero.trim())
        return setFieldError('numero', 'Você deve informar seu Número.')
    if (!user.value.bairro.trim())
        return setFieldError('bairro', 'Você deve informar seu Bairro.')
    if (!user.value.cidade.trim())
        return setFieldError('cidade', 'Você deve informar sua Cidade.')
    if (!/^[A-Z]{2}$/.test(user.value.uf))
        return setFieldError('uf', 'Você deve informar seu UF.')

    user.value.email = email
    user.value.document = document
    user.value.cep = cep.length === 8 ? `${cep.slice(0, 5)}-${cep.slice(5)}` : user.value.cep
    return true
}

function onDocumentInput () {
    formatDocument()
    if (fieldError.value === 'document') validateDocumentField(false)
}

function onEmailInput () {
    if (fieldError.value === 'email') validateEmailField(false)
}

function onCellPhoneInput () {
    formatPhone('telefone_celular')
    if (fieldError.value === 'telefone_celular') validateCellPhoneField(false)
}

function validateDocumentField (showError = false) {
    const message = getDocumentError()
    documentRef.value?.setCustomValidity(message)

    if (message) {
        if (showError || fieldError.value === 'document') {
            fieldError.value = 'document'
            messageError.value = message
            createError.value = message
        }
        return false
    }

    if (fieldError.value === 'document') {
        fieldError.value = ''
        messageError.value = ''
        if (createError.value === 'CPF inválido, verifique e tente novamente.' || createError.value === 'CNPJ inválido, verifique e tente novamente.' || createError.value === 'CPF/CNPJ inválido, verifique e tente novamente.') {
            createError.value = ''
        }
    }

    return true
}

function getDocumentError () {
    const document = user.value.document.replace(/\D/g, '')
    const isCnpj = user.value.tipo_pessoa === '2' || document.length > 11

    if (!document) return 'Você deve informar seu CPF/CNPJ.'
    if (isCnpj) {
        if (document.length !== 14) return 'CNPJ inválido, verifique e tente novamente.'
        if (!isValidCnpj(document)) return 'CNPJ inválido, verifique e tente novamente.'
        return ''
    }

    if (document.length !== 11) return 'CPF inválido, verifique e tente novamente.'
    if (!isValidCpf(document)) return 'CPF inválido, verifique e tente novamente.'
    return ''
}

function clearDocumentValidation () {
    documentRef.value?.setCustomValidity('')
    if (fieldError.value === 'document') {
        fieldError.value = ''
        messageError.value = ''
        createError.value = ''
    }
}

function validateEmailField (showError = false) {
    const message = getEmailError()
    emailRef.value?.setCustomValidity(message)

    if (message) {
        if (showError || fieldError.value === 'email') {
            fieldError.value = 'email'
            messageError.value = message
            createError.value = message
        }
        return false
    }

    if (fieldError.value === 'email') {
        fieldError.value = ''
        messageError.value = ''
        if (createError.value === 'Informe um e-mail válido, como nome@exemplo.com.') createError.value = ''
    }

    return true
}

function getEmailError () {
    const email = user.value.email.trim()
    if (!email) return 'Você deve informar seu e-mail.'
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/.test(email)) return 'Informe um e-mail válido, como nome@exemplo.com.'
    return ''
}

function validateCellPhoneField (showError = false) {
    const message = getCellPhoneError()
    telefoneCelularRef.value?.setCustomValidity(message)

    if (message) {
        if (showError || fieldError.value === 'telefone_celular') {
            fieldError.value = 'telefone_celular'
            messageError.value = message
            createError.value = message
        }
        return false
    }

    if (fieldError.value === 'telefone_celular') {
        fieldError.value = ''
        messageError.value = ''
        if (createError.value === 'Informe seu telefone celular com DDD.') createError.value = ''
    }

    return true
}

function getCellPhoneError () {
    const phone = user.value.telefone_celular.replace(/\D/g, '')
    if (!phone) return 'Você deve informar seu telefone celular.'
    if (phone.length !== 11) return 'Informe seu telefone celular com DDD.'
    if (phone[2] !== '9') return 'Informe um telefone celular válido com DDD.'
    return ''
}

function setFieldError (field: string, message: string) {
    fieldError.value = field
    messageError.value = message
    createError.value = message
    focusField(field)
    return false
}

function focusField (field: string) {
    const refs: Record<string, any> = {
        nome: nomeRef,
        document: documentRef,
        email: emailRef,
        telefone_celular: telefoneCelularRef,
        logradouro: logradouroRef,
        numero: numeroRef,
        bairro: bairroRef,
        cidade: cidadeRef
    }
    const refValue = refs[field]?.value
    refValue?.focus?.()
    refValue?.$el?.querySelector?.('input')?.focus?.()
}

function formatCep () {
    const digits = user.value.cep.replace(/\D/g, '').slice(0, 8)
    user.value.cep = digits.length > 5 ? `${digits.slice(0, 5)}-${digits.slice(5)}` : digits
}

function formatDocument () {
    const isCnpj = user.value.tipo_pessoa === '2'
    const maxLength = isCnpj ? 14 : 11
    const digits = user.value.document.replace(/\D/g, '').slice(0, maxLength)
    user.value.document = isCnpj ? formatCnpj(digits) : formatCpf(digits)
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

function formatPhone (field: 'telefone_celular' | 'telefone_residencial' | 'telefone_comercial') {
    const digits = user.value[field].replace(/\D/g, '').slice(0, 11)
    if (digits.length > 10) {
        user.value[field] = `(${digits.slice(0, 2)}) ${digits.slice(2, 7)}-${digits.slice(7)}`
    } else if (digits.length > 6) {
        user.value[field] = `(${digits.slice(0, 2)}) ${digits.slice(2, 6)}-${digits.slice(6)}`
    } else if (digits.length > 2) {
        user.value[field] = `(${digits.slice(0, 2)}) ${digits.slice(2)}`
    } else {
        user.value[field] = digits
    }
}

function isValidCpf (cpf: string) {
    if (!/^\d{11}$/.test(cpf) || /^(\d)\1+$/.test(cpf)) return false

    for (let t = 9; t < 11; t++) {
        let sum = 0
        for (let c = 0; c < t; c++) {
            sum += Number(cpf[c]) * ((t + 1) - c)
        }
        const digit = ((10 * sum) % 11) % 10
        if (Number(cpf[t]) !== digit) return false
    }

    return true
}

function isValidCnpj (cnpj: string) {
    if (!/^\d{14}$/.test(cnpj) || /^(\d)\1+$/.test(cnpj)) return false

    const calcDigit = (base: string, weights: number[]) => {
        const sum = weights.reduce((total, weight, index) => total + Number(base[index]) * weight, 0)
        const rest = sum % 11
        return rest < 2 ? 0 : 11 - rest
    }
    const firstDigit = calcDigit(cnpj.slice(0, 12), [5, 4, 3, 2, 9, 8, 7, 6, 5, 4, 3, 2])
    const secondDigit = calcDigit(cnpj.slice(0, 13), [6, 5, 4, 3, 2, 9, 8, 7, 6, 5, 4, 3, 2])

    return Number(cnpj[12]) === firstDigit && Number(cnpj[13]) === secondDigit
}
</script>
