<template>
    <div>
        <PageHeader
            title="Minha Conta"
            :breadcrumb="[
                {title: 'Home', url: '/'},
                {title: 'Minha Conta', url: '/account/dashboard'},
            ]"
        />

        <div class="block">
            <div class="container">
                <div class="row">
                    <div class="col-12 col-lg-3 d-flex">
                        <div class="account-nav flex-grow-1">
                            <h4 class="account-nav__title">
                                Painel
                            </h4>
                            <ul>
                                <NuxtLink v-slot="{ isActive }" :exact="true" :to="url.accountDashboard()">
                                    <li :class="['account-nav__item', {'account-nav__item--active': isActive}]">
                                        <AppLink :to="url.accountDashboard()">
                                            Dashboard
                                        </AppLink>
                                    </li>
                                </NuxtLink>
                                <NuxtLink v-slot="{ isActive }" :exact="true" :to="url.accountOrders()">
                                    <li :class="['account-nav__item', {'account-nav__item--active': isActive}]">
                                        <AppLink :to="url.accountOrders()">
                                            Meus Pedidos
                                        </AppLink>
                                    </li>
                                </NuxtLink>
                                <NuxtLink v-slot="{ isActive }" :exact="true" :to="url.accountProfile()">
                                    <li :class="['account-nav__item', {'account-nav__item--active': isActive}]">
                                        <AppLink :to="url.accountProfile()">
                                            Meu Cadastro
                                        </AppLink>
                                    </li>
                                </NuxtLink>
                                <NuxtLink v-slot="{ isActive }" :exact="true" :to="url.accountAddresses()">
                                    <li :class="['account-nav__item', {'account-nav__item--active': isActive}]">
                                        <AppLink :to="url.accountAddresses()">
                                            Endereços
                                        </AppLink>
                                    </li>
                                </NuxtLink>
                                <NuxtLink v-slot="{ isActive }" :exact="true" :to="url.accountPassword()">
                                    <li :class="['account-nav__item', {'account-nav__item--active': isActive}]">
                                        <AppLink :to="url.accountPassword()">
                                            Alterar Senha
                                        </AppLink>
                                    </li>
                                </NuxtLink>
                                <NuxtLink v-slot="{ isActive }" :exact="true" to="/account/login">
                                    <li :class="['account-nav__item', {'account-nav__item--active': isActive}]">
                                        <AppLink to="/account/login">
                                            Sair
                                        </AppLink>
                                    </li>
                                </NuxtLink>
                            </ul>
                        </div>
                    </div>
                    <div class="col-12 col-lg-9 mt-4 mt-lg-0">
                        <slot />
                    </div>
                </div>
            </div>
        </div>
    </div>
</template>

<script setup lang="ts">
const url = useUrl()
</script>
