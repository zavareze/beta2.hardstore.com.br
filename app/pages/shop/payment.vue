<template>
    <div>
        <client-only>
            <PageHeader
                title="Pagamento"
                :breadcrumb="[
                    { title: 'Home', url: '' },
                    { title: 'Pagamento', url: '' },
                ]"
            />

            <div v-if="!cart.quantity" class="block block-empty">
                <div class="container">
                    <div class="block-empty__body">
                        <div class="block-empty__message">
                            Seu carrinho está vazio!
                        </div>
                        <div class="block-empty__actions">
                            <AppLink to="/" class="btn btn-primary btn-sm">
                                Comece a comprar agora!
                            </AppLink>
                        </div>
                    </div>
                </div>
            </div>

            <div v-if="cart.quantity" class="cart block">
                <div class="container">
                    <div class="ng-wizard-main ng-wizard-theme-dots" ng-reflect-ng-class="ng-wizard-main ng-wizard-theme">
                        <ul class="nav nav-tabs step-anchor">
                            <li class="nav-item" v-for="(step, index) of steps" :key="index" :class="{ 'done': aba > index, 'active': aba === index }">
                                <a class="nav-link" @click="aba = index">{{ step[0] }}<br><small>{{ step[1] }}</small></a>
                            </li>
                        </ul>
                    </div>
                    <div v-if="aba===1">
                        aba 1
                    </div>
                    <div v-if="aba===2">
                        aba 2
                    </div>
                    <div v-if="aba===3">
                        aba 3
                    </div>
                    <div v-if="aba===4">
                        aba 4
                    </div>
                    <div v-if="aba===5">
                        aba 5
                    </div>
                    <div v-if="aba===6">
                        aba 6
                    </div>
                    <div v-if="aba===7">
                        aba 7
                    </div>
                </div>
            </div>
        </client-only>
    </div>
</template>
<script setup lang="ts">
import { useCartStore } from '~/stores/cart'

const cartStore = useCartStore()

useHead({ title: 'Carrinho' })

const cart = computed(() => cartStore)
const aba = ref(1)
const steps = ref([
    ['Step 1', 'Step 1 Description'],
    ['Step 2', 'Step 2 Description'],
    ['Step 3', 'Step 3 Description'],
    ['Step 4', 'Step 4 Description'],
    ['Step 5', 'Step 5 Description'],
    ['Step 6', 'Step 6 Description'],
    ['Step 7', 'Step 7 Description']
])
</script>
<style scoped>
.ng-wizard-main {
    position: relative;
    display: block;
    margin: 0;
    padding: 0;
    border-radius: .25rem !important;
}
.ng-wizard-theme-dots>ul.step-anchor:before {
    content: " ";
    position: absolute;
    top: 70px;
    bottom: 0;
    width: 100%;
    height: 5px;
    background-color: #f5f5f5;
    border-radius: 3px;
    z-order: 0;
    z-index: 95;
}
.ng-wizard-theme-dots>ul.step-anchor>li.done>a {
    color: #5cb85c;
}
.ng-wizard-theme-dots>ul.step-anchor>li.done>a:after {
    background: #5cb85c;
}

.ng-wizard-theme-dots>ul.step-anchor>li.active>a {
    color: #5bc0de;
}
.ng-wizard-theme-dots>ul.step-anchor>li.active>a:after {
    background: #5bc0de;
}

.ng-wizard-theme-dots>ul.step-anchor>li.danger>a {
    color: #d9534f;
}
.ng-wizard-theme-dots>ul.step-anchor>li.danger>a:after {
    background: #d9534f;
}

.ng-wizard-theme-dots>ul.step-anchor>li.disabled>a,
.ng-wizard-theme-dots>ul.step-anchor>li.disabled>a:hover {
    color: #eee !important;
}

.ng-wizard-theme-dots>ul.step-anchor>li>a {
    position: relative;
    cursor: pointer;
    text-align: center;
    font-weight: bold;
    background: transparent;
    border: none;
    color: #ccc;
    text-decoration: none;
    outline-style: none;
    z-index: 96;
    display: block;
}
.ng-wizard-theme-dots>ul.step-anchor>li>a:after {
    content: ' ';
    position: relative;
    left: 43%;
    bottom: 2px;
    margin-top: 10px;
    display: block;
    width: 15px;
    height: 15px;
    background: #f5f5f5;
    border-radius: 50%;
    z-index: 99;
}
</style>
