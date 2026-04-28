<template>
    <AccountLayout>
        <div class="card">
            <div class="card-header">
                <h5>Editar Cadastro</h5>
            </div>
            <div class="card-divider" />
            <div class="card-body">
                <div class="row no-gutters">
                    <div class="col-12 col-lg-7 col-xl-6">
                        <form novalidate @submit.prevent="checkForm">
                            <div v-show="message" :class="['alert', messageType === 'success' ? 'alert-success' : 'alert-danger']">
                                {{ message }}
                            </div>
                            <div class="form-group">
                                <div class="form-floating">
                                    <input
                                        id="profile-nome"
                                        ref="nomeRef"
                                        v-model="user.nome"
                                        class="form-control"
                                        type="text"
                                        placeholder="Nome Completo"
                                        autocomplete="name"
                                        required
                                        :class="{ 'is-invalid': fieldError === 'nome' && messageError }"
                                    >
                                    <label for="profile-nome">Nome Completo</label>
                                    <div class="invalid-feedback">
                                        {{ fieldError === 'nome' && messageError ? messageError : 'Você deve informar seu Nome Completo' }}
                                    </div>
                                </div>
                            </div>
                            <div class="form-group">
                                <div class="form-floating">
                                    <input
                                        id="profile-cpfcnpj"
                                        :value="formattedDocument"
                                        class="form-control"
                                        type="text"
                                        placeholder="CPF/CNPJ"
                                        disabled
                                    >
                                    <label for="profile-cpfcnpj">CPF/CNPJ</label>
                                </div>
                            </div>
                            <div class="form-group">
                                <div class="form-floating">
                                    <input
                                        id="profile-email"
                                        ref="emailRef"
                                        v-model="user.email"
                                        class="form-control"
                                        type="email"
                                        placeholder="email@exemplo.com"
                                        autocomplete="email"
                                        required
                                        :class="{ 'is-invalid': fieldError === 'email' && messageError }"
                                        @input="onEmailInput"
                                        @blur="validateEmailField(true)"
                                    >
                                    <label for="profile-email">E-Mail</label>
                                    <div class="invalid-feedback">
                                        {{ fieldError === 'email' && messageError ? messageError : 'Informe um e-mail válido, como nome@exemplo.com' }}
                                    </div>
                                </div>
                            </div>
                            <div class="form-group">
                                <div class="form-floating">
                                    <input
                                        id="profile-celular"
                                        ref="telefoneCelularRef"
                                        v-model="user.telefone_celular"
                                        class="form-control"
                                        type="text"
                                        inputmode="tel"
                                        placeholder="Telefone Celular"
                                        autocomplete="tel"
                                        required
                                        :class="{ 'is-invalid': fieldError === 'telefone_celular' && messageError }"
                                        @input="onCellPhoneInput"
                                        @blur="validateCellPhoneField(true)"
                                    >
                                    <label for="profile-celular">Telefone Celular</label>
                                    <div class="invalid-feedback">
                                        {{ fieldError === 'telefone_celular' && messageError ? messageError : 'Informe seu telefone celular com DDD' }}
                                    </div>
                                </div>
                            </div>
                            <div class="form-group">
                                <div class="form-floating">
                                    <input
                                        id="profile-residencial"
                                        v-model="user.telefone_residencial"
                                        class="form-control"
                                        type="text"
                                        inputmode="tel"
                                        placeholder="Telefone Residencial"
                                        autocomplete="tel"
                                        @input="formatPhone('telefone_residencial')"
                                    >
                                    <label for="profile-residencial">Telefone Residencial</label>
                                </div>
                            </div>
                            <div class="form-group">
                                <div class="form-floating">
                                    <input
                                        id="profile-comercial"
                                        v-model="user.telefone_comercial"
                                        class="form-control"
                                        type="text"
                                        inputmode="tel"
                                        placeholder="Telefone Comercial"
                                        autocomplete="tel"
                                        @input="formatPhone('telefone_comercial')"
                                    >
                                    <label for="profile-comercial">Telefone Comercial</label>
                                </div>
                            </div>
                            <div class="form-group mt-5 mb-0">
                                <button class="btn btn-primary" type="submit" :class="{ 'btn-loading': account.isLoading }" :disabled="account.isLoading">
                                    Salvar
                                </button>
                            </div>
                        </form>
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

useHead({ title: 'Editar Cadastro' })

const user = ref(Object.assign({ document: '' }, account.user))
const fieldError = ref('')
const messageError = ref('')
const message = ref('')
const messageType = ref<'success' | 'danger'>('success')
const nomeRef = ref<HTMLInputElement | null>(null)
const emailRef = ref<HTMLInputElement | null>(null)
const telefoneCelularRef = ref<HTMLInputElement | null>(null)

const formattedDocument = computed(() => {
    const document = String(user.value.document || '').replace(/\D/g, '')
    const length = document.length > 11 ? 14 : 11
    const digits = document.padStart(length, '0')
    return length === 14 ? formatCnpj(digits) : formatCpf(digits)
})

onMounted(() => {
    formatPhone('telefone_celular')
    formatPhone('telefone_residencial')
    formatPhone('telefone_comercial')
})

onBeforeMount(() => {
    if (!account.user.document)
        router.push('/account/login')
})

function checkForm(event: Event) {
    const form = event.target as HTMLFormElement
    form.classList.add('was-validated')
    message.value = ''
    if (!validateProfileForm()) return
    saveProfile()
}

async function saveProfile() {
    try {
        await account.setUser({
            ...user.value,
            email: user.value.email.trim()
        })
        messageType.value = 'success'
        message.value = 'Cadastro atualizado com sucesso.'
    } catch (error: any) {
        messageType.value = 'danger'
        message.value = error?.message || account.hasError || 'Não foi possível atualizar seu cadastro agora.'
    }
}

function validateProfileForm() {
    if (!/\S+\s+\S+/.test(String(user.value.nome || '').trim()))
        return setFieldError('nome', 'Você deve informar seu Nome e Sobrenome.')
    if (!validateEmailField(true)) return false
    if (!validateCellPhoneField(true)) return false
    user.value.nome = user.value.nome.trim()
    return true
}

function onEmailInput() {
    if (fieldError.value === 'email') validateEmailField(false)
}

function onCellPhoneInput() {
    formatPhone('telefone_celular')
    if (fieldError.value === 'telefone_celular') validateCellPhoneField(false)
}

function validateEmailField(showError = false) {
    const message = getEmailError()
    emailRef.value?.setCustomValidity(message)
    if (message) {
        if (showError || fieldError.value === 'email') {
            fieldError.value = 'email'
            messageError.value = message
        }
        return false
    }
    if (fieldError.value === 'email') clearFieldError()
    return true
}

function getEmailError() {
    const email = String(user.value.email || '').trim()
    if (!email) return 'Você deve informar seu e-mail.'
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/.test(email)) return 'Informe um e-mail válido, como nome@exemplo.com.'
    return ''
}

function validateCellPhoneField(showError = false) {
    const message = getCellPhoneError()
    telefoneCelularRef.value?.setCustomValidity(message)
    if (message) {
        if (showError || fieldError.value === 'telefone_celular') {
            fieldError.value = 'telefone_celular'
            messageError.value = message
        }
        return false
    }
    if (fieldError.value === 'telefone_celular') clearFieldError()
    return true
}

function getCellPhoneError() {
    const phone = String(user.value.telefone_celular || '').replace(/\D/g, '')
    if (!phone) return 'Você deve informar seu telefone celular.'
    if (phone.length !== 11) return 'Informe seu telefone celular com DDD.'
    if (phone[2] !== '9') return 'Informe um telefone celular válido com DDD.'
    return ''
}

function setFieldError(field: string, message: string) {
    fieldError.value = field
    messageError.value = message
    focusField(field)
    return false
}

function clearFieldError() {
    fieldError.value = ''
    messageError.value = ''
}

function focusField(field: string) {
    const refs: Record<string, any> = {
        nome: nomeRef,
        email: emailRef,
        telefone_celular: telefoneCelularRef
    }
    refs[field]?.value?.focus?.()
}

function formatPhone(field: 'telefone_celular' | 'telefone_residencial' | 'telefone_comercial') {
    const digits = String(user.value[field] || '').replace(/\D/g, '').slice(0, 11)
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

function formatCpf(digits: string) {
    if (digits.length > 9) return `${digits.slice(0, 3)}.${digits.slice(3, 6)}.${digits.slice(6, 9)}-${digits.slice(9)}`
    if (digits.length > 6) return `${digits.slice(0, 3)}.${digits.slice(3, 6)}.${digits.slice(6)}`
    if (digits.length > 3) return `${digits.slice(0, 3)}.${digits.slice(3)}`
    return digits
}

function formatCnpj(digits: string) {
    if (digits.length > 12) return `${digits.slice(0, 2)}.${digits.slice(2, 5)}.${digits.slice(5, 8)}/${digits.slice(8, 12)}-${digits.slice(12)}`
    if (digits.length > 8) return `${digits.slice(0, 2)}.${digits.slice(2, 5)}.${digits.slice(5, 8)}/${digits.slice(8)}`
    if (digits.length > 5) return `${digits.slice(0, 2)}.${digits.slice(2, 5)}.${digits.slice(5)}`
    if (digits.length > 2) return `${digits.slice(0, 2)}.${digits.slice(2)}`
    return digits
}
</script>
<style scoped>
INPUT {
    line-height: 1.5 !important;
}
</style>
