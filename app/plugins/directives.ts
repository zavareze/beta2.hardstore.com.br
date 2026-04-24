import { defineNuxtPlugin } from '#app'
import { vMaska } from 'maska/vue'

export default defineNuxtPlugin((nuxtApp) => {
    nuxtApp.vueApp.directive('mask', vMaska)
    // v-lazy-load removed — replaced with native loading="lazy" attribute
})
