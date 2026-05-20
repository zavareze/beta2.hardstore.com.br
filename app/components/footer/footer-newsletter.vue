<template>
    <div class="site-footer__widget footer-newsletter">
        <h2 class="footer-newsletter__title">
            Newsletter
        </h2>
        <div class="footer-newsletter__text">
             Assine nossa newsletter e receba semanalmente nossas novidades e promoções exclusivas!
        </div>

        <form class="footer-newsletter__form" novalidate>
            <div class="form-floating footer-newsletter__form-floating">
                <input
                    id="footer-newsletter-address"
                    class="footer-newsletter__form-input form-control"
                    :class="{ 'is-invalid': touched && !isValidEmail, 'is-valid': touched && isValidEmail }"
                    type="email"
                    placeholder="Seu e-mail..."
                    v-model="email"
                    @blur="touched = true"
                    @input="touched = true"
                >
                <label for="footer-newsletter-address">Seu e-mail</label>
                <div v-if="touched && !isValidEmail" class="invalid-feedback">
                    Informe um e-mail válido.
                </div>
            </div>

            <button class="footer-newsletter__form-button btn btn-primary" @click.prevent="addNewsletter()" :disabled="!isValidEmail">
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
import { ref, computed } from 'vue'
import { useAccountStore } from '~/stores/account'

const accountStore = useAccountStore()
const email = ref('')
const touched = ref(false)

const isValidEmail = computed(() => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email.value))

async function addNewsletter() {
    touched.value = true
    if (!isValidEmail.value) return
    const result = await accountStore.addNewsletter(email.value)
    useNuxtApp().$notify?.({
        group: 'api',
        type: 'success',
        text: result?.data?.message ?? 'E-mail cadastrado com sucesso!',
        duration: 5000
    })
}
</script>
