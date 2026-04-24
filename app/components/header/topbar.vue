<template>
    <!-- .topbar -->
    <div class="site-header__topbar topbar">
        <div class="topbar__container container">
            <div class="topbar__row">
                <div class="topbar__item topbar__item--link">
                    <AppLink :to="url.about()" class="topbar-link">
                        Sobre nós
                    </AppLink>
                </div>
                <div class="topbar__item topbar__item--link">
                    <AppLink :to="url.contacts()" class="topbar-link">
                        Contato
                    </AppLink>
                </div>
                <div class="topbar__item topbar__item--link">
                    <AppLink :to="url.trackOrder()" class="topbar-link">
                        Rastrear Pedido
                    </AppLink>
                </div>
                <div class="topbar__item topbar__item--link">
                    <AppLink to="/blog/category-list" class="topbar-link">
                        Blog
                    </AppLink>
                </div>
                <div class="topbar__spring" />
                <div class="topbar__item" :class="{ 'topbar__item--link': accountStore.isLogged && !accountStore.isLoading }">
                    <Dropdown v-show="accountStore.isLogged && !accountStore.isLoading"
                        :items="[
                            { title: 'Dashboard', url: url.accountDashboard()},
                            { title: 'Meus Pedidos', url: url.accountOrders()},
                            { title: 'Meu Cadastro', url: url.accountProfile()},
                            { title: 'Endereços', url: url.accountAddresses()},
                            { title: 'Alterar Senha', url: url.accountPassword()}
                        ]"
                    >
                        Minha Conta
                    </Dropdown>
                    <AppLink to="/account/login" v-show="!accountStore.isLogged && !accountStore.isLoading" class="topbar-link">
                        Minha Conta
                    </AppLink>
                </div>
                <div class="topbar__item topbar__item--link ms-3">
                    <AppLink to="/account/signin" class="topbar-link">
                        Cadastre-se
                    </AppLink>
                </div>
            </div>
        </div>
    </div>
    <!-- .topbar / end -->
</template>

<script setup lang="ts">
import { useAccountStore } from '~/stores/account'

const url = useUrl()
const accountStore = useAccountStore()
</script>
