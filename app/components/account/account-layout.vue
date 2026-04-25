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
                                <li
                                    v-for="item in navItems"
                                    :key="item.to"
                                    :class="['account-nav__item', {'account-nav__item--active': isActive(item.to)}]"
                                >
                                    <NuxtLink :to="item.to">
                                        {{ item.title }}
                                    </NuxtLink>
                                </li>
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
const route = useRoute()

const navItems = [
    { title: 'Dashboard', to: url.accountDashboard() },
    { title: 'Meus Pedidos', to: url.accountOrders() },
    { title: 'Meu Cadastro', to: url.accountProfile() },
    { title: 'Endereços', to: url.accountAddresses() },
    { title: 'Alterar Senha', to: url.accountPassword() },
    { title: 'Sair', to: '/account/login' }
]

function isActive(to: string) {
    return route.path === to
}
</script>
