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
                                <form v-show="!account.isLoading">
                                    <div class="form-group">
                                        <label for="login-email">CPF ou E-mail</label>
                                        <input
                                            id="login-email"
                                            v-model="user"
                                            class="form-control"
                                            type="text"
                                            placeholder="Informe o CPF ou Email"
                                        >
                                    </div>
                                    <div class="form-group">
                                        <label for="login-password">Senha</label>
                                        <input
                                            id="login-password"
                                            v-model="password"
                                            class="form-control"
                                            type="password"
                                            placeholder="Senha"
                                            :class="{ 'is-invalid': account.hasError }"
                                            @keyup="change()"
                                        >
                                        <div class="invalid-feedback">
                                            {{ account.hasError }}
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
                                                    <Check9x7Svg class="input-check__icon" />
                                                </span>
                                            </span>
                                            <label class="form-check-label" for="login-remember">Lembre-se</label>
                                        </div>
                                    </div>
                                    <button type="button" class="btn btn-primary mt-4" @click="account.fetchLogin({ user, password, redirect: route.query.redirect })">
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
                                <form>
                                    <div class="form-group">
                                        <label for="register-email">E-mail</label>
                                        <input
                                            id="register-email"
                                            class="form-control"
                                            v-model="novo.email"
                                            type="email"
                                            placeholder="Digite seu email"
                                        >
                                    </div>
                                    <div class="form-group">
                                        <label for="register-cep">CEP</label>
                                        <input
                                            id="register-password"
                                            class="form-control"
                                            v-model="novo.cep"
                                            v-mdb-input-mask="'♠♠♠♠♠-♠♠♠'"
                                            type="text"
                                            placeholder="CEP"
                                        >
                                    </div>
                                    <button type="button" class="btn btn-primary mt-4" @click="registrar()">
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
const novo = ref({
    email: '',
    cep: ''
})

onMounted(() => {
    account.logout({})
    account.init()
    if (route.query.magic_link)
        account.fetchMagicLink({ magicLink: route.query.magic_link, redirect: route.query.redirect })
})

function change () {
    account.setError('')
}

function registrar () {
    router.push('/account/signin?email=' + novo.value.email + '&cep=' + novo.value.cep)
}

function lembrar () {
    if (!rememberUser.value)
        account.fetchRememberUser(user.value)
    else
        account.fetchRememberUser('')
}
</script>
