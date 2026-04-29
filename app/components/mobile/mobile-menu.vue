<template>
    <div
        :class="[
            'mobilemenu',
            {'mobilemenu--open': mobileMenuStore.isOpen}
        ]"
    >
        <div class="mobilemenu__backdrop" @click="mobileMenuStore.close()" />
        <div class="mobilemenu__body">
            <div class="mobilemenu__header">
                <div class="mobilemenu__title">
                    Menu
                </div>
                <button type="button" class="mobilemenu__close" @click="mobileMenuStore.close()">
                    <Cross20Svg />
                </button>
            </div>
            <div class="mobilemenu__content">
                <ClientOnly>
                    <MobileLinks :links="shopStore.categoryListMobile" @itemClick="onItemClick" />
                </ClientOnly>
            </div>
        </div>
    </div>
</template>

<script setup lang="ts">
import { useMobileMenuStore } from '~/stores/mobileMenu'
import { useShopStore } from '~/stores/shop'
import Cross20Svg from '~/svg/cross-20.svg'

const mobileMenuStore = useMobileMenuStore()
const shopStore = useShopStore()

if (!shopStore.categoryList) {
    shopStore.fetchCategory({ categorySlug: null })
}

function onItemClick(item: any) {
    mobileMenuStore.close()
}
</script>
