<template>
    <div class="site-header" style="color:white; background-color: black; background-image: url(/images/background-blackCarbonFiber.jpg); background-size: 33%;">
        <Topbar />

        <div v-if="layout === 'default'" class="site-header__middle container">
            <div class="site-header__logo">
                <AppLink to="/">
                    <img src="/images/logo-hardstore2026.webp" width="320" style="margin-right:40px;max-width: 290px;">
                </AppLink>
            </div>
            <div class="site-header__search">
                <Search location="header" />
            </div>
            <div class="site-header__phone">
                <div class="site-header__phone-title">

                </div>
                <div class="site-header__phone-number">
                    {{ theme.contacts.phone }} <p style="font-size:10px; text-transform: uppercase; margin-bottom:3px">Matriz - Porto Alegre</p>
                </div>
                <div class="site-header__phone-number">
                    (54) 3066-5080 <p style="font-size:10px; text-transform: uppercase">Filial - Caxias do Sul</p>
                </div>
            </div>
        </div>
        <div class="site-header__nav-panel">
            <NavPanel :layout="layout" sticky-mode="alwaysOnTop" />
        </div>
    </div>
</template>

<script setup lang="ts">
import { computed } from 'vue'
import { useOptionsStore } from '~/stores/options'
import theme from '~/data/theme'

const optionsStore = useOptionsStore()
const layout = computed(() => optionsStore.headerLayout)
</script>
<style scoped>
.modal-dialog {
  position: absolute;
  top: 50px;
  right: 100px;
  bottom: 0;
  left: 0;
  z-index: 10040;
  overflow: auto;
  overflow-y: auto;
}
</style>
