<template>
    <div class="account-menu">
        <BlockLoader v-show="accountStore.isLoading" />
        <form class="account-menu__form" v-show="!accountStore.isLogged && !accountStore.isLoading">
            <div class="account-menu__form-title">
                Minha Conta
            </div>
            <div class="form-group">
                <input id="header-signin-email" v-model="user" type="text" placeholder="Email ou CPF" class="form-control" />
            </div>
            <div class="form-group">
                <div class="account-menu__form-forgot">
                    <input
                        id="header-signin-password"
                        v-model="password"
                        type="password"
                        placeholder="Senha"
                        class="form-control"
                        :class="{ 'is-invalid': accountStore.hasError }"
                        @keyup="change()"
                    />
                    <a @click="showForgotModal = true" class="account-menu__form-forgot-link">Esqueceu?</a>
                    <div class="invalid-feedback">
                        {{ accountStore.hasError }}
                    </div>
                </div>
            </div>
            <div class="form-group account-menu__form-button">
                <button type="button" class="btn btn-primary btn-sm" @click="accountStore.fetchLogin({ user, password, redirect: '/account/dashboard' })">
                    Login
                </button>
            </div>
            <div class="account-menu__form-link">
                <AppLink :to="url.signUp()">
                    Crie sua conta
                </AppLink>
            </div>
        </form>
        <div v-show="accountStore.isLogged && !accountStore.isLoading">
            <div class="account-menu__divider" />
            <AppLink :to="url.account()" class="account-menu__user">
                <div class="account-menu__user-avatar">
                    <img :src="accountStore.user.avatar" alt="">
                </div>
                <div class="account-menu__user-info">
                    <div class="account-menu__user-name">
                        {{ accountStore.user.nome }}
                    </div>
                    <div class="account-menu__user-email">
                        {{ accountStore.user.email }}
                    </div>
                </div>
            </AppLink>
            <div class="account-menu__divider" />
            <ul class="account-menu__links">
                <li>
                    <AppLink :to="url.accountProfile()">
                        Meu Cadastro
                    </AppLink>
                </li>
                <li>
                    <AppLink :to="url.accountOrders()">
                        Meus Pedidos
                    </AppLink>
                </li>
                <li>
                    <AppLink :to="url.accountAddresses()">
                        Meus Endereços
                    </AppLink>
                </li>
                <li>
                    <AppLink :to="url.accountPassword()">
                        Alterar Senha
                    </AppLink>
                </li>
            </ul>
            <div class="account-menu__divider" />
            <ul class="account-menu__links">
                <li>
                    <a style="cursor: pointer" @click="logout()">
                        Sair
                    </a>
                </li>
            </ul>
        </div>
        <ModalForgotPassword />
    </div>
</template>

<script setup lang="ts">
import { ref } from 'vue'
import { useAccountStore } from '~/stores/account'

const url = useUrl()
const accountStore = useAccountStore()

const user = ref('')
const password = ref('')
const showForgotModal = ref(false)

function change() {
    accountStore.error = ''
}

function logout() {
    accountStore.logout({})
}
</script>
<style scoped>
.account-menu__form-forgot-link {
    top: 8px;
    bottom: initial;
}
</style>
