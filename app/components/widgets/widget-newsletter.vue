<template>
    <div class="widget-newsletter widget">
        <h4 class="widget-newsletter__title">
            Newsletter
        </h4>
        <div class="widget-newsletter__text">
            Assine nossa newsletter e receba semanalmente nossas novidades e promoções exclusivas!
        </div>
        <form class="widget-newsletter__form" action="">
            <label for="widget-newsletter-email" class="sr-only">Seu Email...</label>
            <input id="widget-newsletter-email" type="text" class="form-control" placeholder="Seu Email..." v-model="email">
            <button type="button" class="btn btn-primary mt-3" @click.prevent="addNewsletter()">
                Assinar
            </button>
        </form>
    </div>
</template>

<script setup lang="ts">
import { ref } from 'vue'
import { useAccountStore } from '~/stores/account'

const accountStore = useAccountStore()
const email = ref('')

async function addNewsletter () {
    const result = await accountStore.addNewsletter(email.value)
    useNuxtApp().$notify?.({
        group: 'api',
        type: 'success',
        text: result.message,
        duration: 5000,
    })
}
</script>
