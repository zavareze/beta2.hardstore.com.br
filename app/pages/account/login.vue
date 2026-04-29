<template>
    <div>
        <PageHeader
            title="Minha Conta"
            :breadcrumb="[
                {title: 'Home', url: '/'},
                {title: 'Minha Conta', url: '/account/dashboard'},
                {title: 'Login', url: '/account/login'},
            ]"
        />

        <div class="block">
            <div class="container">
                <div class="row">
                    <div class="col-md-6 d-flex flex-column">
                        <div class="card flex-grow-1 mb-md-0">
                            <div class="card-body">
                                <h3 class="card-title">
                                    Login
                                </h3>
                                <BlockLoader v-show="account.isLoading" />
                                <form v-show="!account.isLoading" @submit.prevent="account.fetchLogin({ user, password, redirect: loginRedirect })">
                                    <div class="form-group">
                                        <div class="form-floating">
                                            <input
                                                id="login-email"
                                                v-model="user"
                                                class="form-control"
                                                type="text"
                                                placeholder="CPF ou CNPJ"
                                                autocomplete="username"
                                                required
                                                @input="formatUserInput"
                                            >
                                            <label for="login-email">CPF/CNPJ</label>
                                        </div>
                                    </div>
                                    <div class="form-group">
                                        <div class="form-floating">
                                            <input
                                                id="login-password"
                                                v-model="password"
                                                class="form-control"
                                                type="password"
                                                placeholder="Senha"
                                                autocomplete="current-password"
                                                required
                                                :class="{ 'is-invalid': account.hasError }"
                                                @keyup="change()"
                                            >
                                            <label for="login-password">Senha</label>
                                            <div class="invalid-feedback">
                                                {{ account.hasError }}
                                            </div>
                                        </div>
                                        <small class="form-text text-muted">
                                            <a @click="useModal().show('modalForgotPassword')">Esqueci minha Senha</a>
                                        </small>
                                    </div>
                                    <div class="form-group">
                                        <div class="form-check">
                                            <span class="form-check-input input-check">
                                                <span class="input-check__body">
                                                    <input
                                                        id="login-remember"
                                                        class="input-check__input"
                                                        type="checkbox"
                                                        v-model="rememberUser"
                                                        @click="lembrar()"
                                                    >
                                                    <span class="input-check__box" />
                                                    <svg class="input-check__icon" xmlns="http://www.w3.org/2000/svg" width="9px" height="7px" viewBox="0 0 9 7" aria-hidden="true" focusable="false">
                                                        <path d="M9.002,1.396 L3.461,7.002 L-0.002,3.498 L1.383,2.096 L3.461,4.199 L7.617,-0.006 L9.002,1.396 Z" />
                                                    </svg>
                                                </span>
                                            </span>
                                            <label class="form-check-label" for="login-remember">Lembrar meus dados</label>
                                        </div>
                                    </div>
                                    <button type="submit" class="btn btn-primary mt-4">
                                        Entrar
                                    </button>
                                </form>
                            </div>
                        </div>
                    </div>
                    <div class="col-md-6 d-flex flex-column mt-4 mt-md-0">
                        <div class="card flex-grow-1 mb-0">
                            <div class="card-body">
                                <h3 class="card-title">
                                    Registrar
                                </h3>
                                <form @submit.prevent="registrar()">
                                    <div class="form-group">
                                        <div class="form-floating">
                                            <input
                                                id="register-email"
                                                class="form-control"
                                                v-model="novo.email"
                                                type="email"
                                                placeholder="email@exemplo.com"
                                                autocomplete="email"
                                                required
                                            >
                                            <label for="register-email">E-mail</label>
                                        </div>
                                    </div>
                                    <div class="form-group">
                                        <div class="form-floating">
                                            <input
                                                id="register-cep"
                                                class="form-control"
                                                v-model="novo.cep"
                                                type="text"
                                                inputmode="numeric"
                                                maxlength="9"
                                                placeholder="CEP"
                                                autocomplete="postal-code"
                                                required
                                                @input="formatCep"
                                            >
                                            <label for="register-cep">CEP</label>
                                        </div>
                                    </div>
                                    <button type="submit" class="btn btn-primary mt-4">
                                        Registrar-se
                                    </button>
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

useHead({ title: 'Log In' })

const user = ref(account.rememberUser || '')
const password = ref('')
const rememberUser = ref(account.rememberUser || false)
const loginRedirect = computed(() => {
    const redirect = route.query.redirect
    return Array.isArray(redirect) ? redirect[0] || undefined : redirect || undefined
})
const novo = ref({
    email: '',
    cep: ''
})

onMounted(() => {
    account.logout()
    account.init()
    if (route.query.magic_link)
        account.fetchMagicLink({ magicLink: String(route.query.magic_link), redirect: loginRedirect.value })
})

function change () {
    account.setError('')
}

function formatUserInput () {
    if (!/^\d[\d.\-\/]*$/.test(user.value)) return
    const digits = user.value.replace(/\D/g, '')
    if (digits.length > 11) {
        const d = digits.slice(0, 14)
        if (d.length > 12) user.value = `${d.slice(0, 2)}.${d.slice(2, 5)}.${d.slice(5, 8)}/${d.slice(8, 12)}-${d.slice(12)}`
        else if (d.length > 8) user.value = `${d.slice(0, 2)}.${d.slice(2, 5)}.${d.slice(5, 8)}/${d.slice(8)}`
        else if (d.length > 5) user.value = `${d.slice(0, 2)}.${d.slice(2, 5)}.${d.slice(5)}`
        else if (d.length > 2) user.value = `${d.slice(0, 2)}.${d.slice(2)}`
        else user.value = d
    } else {
        const d = digits.slice(0, 11)
        if (d.length > 9) user.value = `${d.slice(0, 3)}.${d.slice(3, 6)}.${d.slice(6, 9)}-${d.slice(9)}`
        else if (d.length > 6) user.value = `${d.slice(0, 3)}.${d.slice(3, 6)}.${d.slice(6)}`
        else if (d.length > 3) user.value = `${d.slice(0, 3)}.${d.slice(3)}`
        else user.value = d
    }
}

function registrar () {
    router.push('/account/signin?email=' + encodeURIComponent(novo.value.email) + '&cep=' + encodeURIComponent(novo.value.cep))
}

function formatCep () {
    const digits = novo.value.cep.replace(/\D/g, '').slice(0, 8)
    novo.value.cep = digits.length > 5 ? `${digits.slice(0, 5)}-${digits.slice(5)}` : digits
}

function lembrar () {
    if (!rememberUser.value)
        account.fetchRememberUser(user.value)
    else
        account.fetchRememberUser('')
}
</script>
