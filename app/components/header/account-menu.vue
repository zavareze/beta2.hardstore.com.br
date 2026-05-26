<template>
    <div class="account-menu">
        <BlockLoader v-show="isMounted && accountStore.isLoading" />
        <form class="account-menu__form" v-show="(!isMounted || !accountStore.isLogged) && !accountStore.isLoading" @submit.prevent="accountStore.fetchLogin({ user, password, redirect: '/account/dashboard' })">
            <div class="account-menu__form-title">
                Minha Conta
            </div>
            <div class="form-group">
                <input
                    id="header-signin-email"
                    v-model="user"
                    type="text"
                    placeholder="Email ou CPF/CNPJ"
                    class="form-control"
                    autocomplete="username"
                    @input="formatUserInput"
                />
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
                    <button type="button" @click="useModal().show('modalForgotPassword')" class="account-menu__form-forgot-link">Esqueceu?</button>
                    <div class="invalid-feedback">
                        {{ accountStore.hasError }}
                    </div>
                </div>
            </div>
            <div class="form-group account-menu__form-button">
                <button type="submit" class="btn btn-primary btn-sm">
                    Login
                </button>
            </div>
            <div class="account-menu__form-link">
                <AppLink :to="url.signUp()">
                    Crie sua conta
                </AppLink>
            </div>
        </form>
        <div v-show="isMounted && accountStore.isLogged && !accountStore.isLoading">
            <div class="account-menu__divider" />
            <AppLink :to="url.account()" class="account-menu__user">
                <div class="account-menu__user-avatar">
                    <UserAvatar :src="accountStore.user.avatar" :name="accountStore.user.nome" :size="40" />
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
                    <button class="account-menu__logout" @click="logout()">
                        Sair
                    </button>
                </li>
            </ul>
        </div>
        <ModalForgotPassword />
        <ModalFirstAccess />
    </div>
</template>

<script setup lang="ts">
import { ref, onMounted } from 'vue'
import { useAccountStore } from '~/stores/account'

const url = useUrl()
const accountStore = useAccountStore()

const isMounted = ref(false)
onMounted(() => { isMounted.value = true })

const user = ref('')
const password = ref('')
function change() {
    accountStore.error = ''
}

function formatUserInput () {
    if (!/^\d[\d.\-\/]*$/.test(user.value)) return

    const digits = user.value.replace(/\D/g, '')
    if (digits.length > 11) {
        const d = digits.slice(0, 14)
        user.value = formatCnpj(d)
        return
    }

    const d = digits.slice(0, 11)
    user.value = formatCpf(d)
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

function logout() {
    accountStore.logout()
}
</script>
<style scoped>
.account-menu__form-forgot-link {
    top: 8px;
    bottom: initial;
    border: none;
    cursor: pointer;
}
.account-menu__logout {
    background: none;
    border: none;
    padding: 0;
    cursor: pointer;
    font: inherit;
    color: inherit;
}
</style>
