<template>
    <div>
        <PageHeader
            :breadcrumb="[
                { title: 'Home', url: '' },
                { title: 'Termos e Condições', url: '' },
            ]"
        />

        <div class="block">
            <div class="container">
                <div class="document">
                    <div class="document__header">
                        <h1 class="document__title">
                            Politicas de Privacidade
                        </h1>
                        <div class="document__subtitle">
                           Última Atualização em 30/03/2021
                        </div>
                    </div>
                    <div class="document__content typography">
                        <p>
                            Prezado Cliente, <br />
                            A Hardstore no compromisso de transparência, segurança e a privacidade de seus clientes que criou esta Política de Privacidade
                            Esta política se aplica à todas as pessoas que interagem com nossos serviços.
                        </p>
                        <p>A <strong>Hardstore</strong> é o controlador dos dados pessoais tratados em nossa plataforma/aplicativo/lojas físicas.</p>
                    </div>
                </div>
            </div>
        </div>
    </div>
</template>

<script setup lang="ts">
useHead({ title: 'Termos e Condições' })
</script>
