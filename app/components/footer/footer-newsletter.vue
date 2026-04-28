<template>
    <div class="site-footer__widget footer-newsletter">
        <h5 class="footer-newsletter__title">
            Newsletter
        </h5>
        <div class="footer-newsletter__text">
             Assine nossa newsletter e receba semanalmente nossas novidades e promoções exclusivas!
        </div>

        <form class="footer-newsletter__form">
            <div class="form-floating footer-newsletter__form-floating">
                <input
                    id="footer-newsletter-address"
                    class="footer-newsletter__form-input form-control"
                    type="email"
                    placeholder="Seu e-mail..."
                    v-model="email"
                >
                <label for="footer-newsletter-address">Seu e-mail</label>
            </div>

            <button class="footer-newsletter__form-button btn btn-primary" @click.prevent="addNewsletter()">
                Assinar
            </button>
        </form>

        <div class="footer-newsletter__text footer-newsletter__text--social">
            Siga as nossas redes sociais
        </div>

        <social-links class="footer-newsletter__social-links" shape="circle" />
    </div>
</template>

<script setup lang="ts">
import { ref } from 'vue'
import { useAccountStore } from '~/stores/account'

const accountStore = useAccountStore()
const email = ref('')

async function addNewsletter() {
    const result = await accountStore.addNewsletter(email.value)
    useNuxtApp().$notify?.({
        group: 'api',
        type: 'success',
        text: result.message,
        duration: 5000
    })
}
</script>
