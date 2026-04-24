<template>
    <div
        :class="[
            'mobile-header',
            {'mobile-header--sticky': stickyMode}
        ]"
    >
        <div class="mobile-header__panel">
            <div class="container">
                <div class="mobile-header__body">
                    <button
                        type="button"
                        class="mobile-header__menu-button"
                        @click="mobileMenuStore.open()"
                    >
                        <Menu18x14Svg />
                    </button>
                    <AppLink to="/" class="mobile-header__logo">
                        <!-- mobile-logo -->
                        <LogoSmallSvg />
                        <!-- mobile-logo / end -->
                    </AppLink>

                    <Search
                        ref="searchRef"
                        location="mobile-header"
                        :class="[
                            'mobile-header__search',
                            {'mobile-header__search--open': searchIsOpen}
                        ]"
                        @close="onSearchClose"
                    />

                    <div class="mobile-header__indicators">
                        <Indicator
                            ref="searchButtonRef"
                            location="mobile-header"
                            class="d-md-none"
                            trigger="click"
                            @buttonClick="onSearchClick"
                        >
                            <template v-slot:icon>
                                <Search20Svg />
                            </template>
                        </Indicator>

                        <Indicator
                            :to="url.wishlist()"
                            :value="wishlistValue"
                            location="mobile-header"
                            class="d-sm-flex d-none"
                        >
                            <template v-slot:icon>
                                <Heart20Svg />
                            </template>
                        </Indicator>

                        <Indicator
                            :to="url.cart()"
                            :value="cartValue"
                            :trigger="optionsStore.dropcartType === 'dropdown' ? 'none' : 'click'"
                            location="mobile-header"
                            @buttonClick="onCartClick"
                        >
                            <template v-slot:icon>
                                <Cart20Svg />
                            </template>
                        </Indicator>
                    </div>
                </div>
            </div>
        </div>
    </div>
</template>

<script setup lang="ts">
import { ref, watchEffect, onMounted, onBeforeUnmount } from 'vue'
import { useOptionsStore } from '~/stores/options'
import { useWishlistStore } from '~/stores/wishlist'
import { useCartStore } from '~/stores/cart'
import { useOffcanvasCartStore } from '~/stores/offcanvasCart'
import { useMobileMenuStore } from '~/stores/mobileMenu'
import Sticky from '~/services/sticky'
import LogoSmallSvg from '~/svg/logo-hardstore-mobile.svg'
import Menu18x14Svg from '~/svg/menu-18x14.svg'
import Search20Svg from '~/svg/search-20.svg'
import Heart20Svg from '~/svg/heart-20.svg'
import Cart20Svg from '~/svg/cart-20.svg'

type StickyMode = 'pullToShow' | 'alwaysOnTop' | false

withDefaults(defineProps<{
    stickyMode?: StickyMode
}>(), {
    stickyMode: false
})

const url = useUrl()
const optionsStore = useOptionsStore()
const wishlistStore = useWishlistStore()
const cartStore = useCartStore()
const offcanvasCartStore = useOffcanvasCartStore()
const mobileMenuStore = useMobileMenuStore()

const cartValue = ref<number | null>(null)
const wishlistValue = ref<number | null>(null)

const searchRef = ref<any>()
const searchButtonRef = ref<any>()
const searchIsOpen = ref(false)

let sticky: Sticky
const teardown: Array<() => void> = []

onMounted(() => {
    watchEffect(() => { cartValue.value = cartStore.quantity })
    watchEffect(() => { wishlistValue.value = wishlistStore.items.length })

    document.addEventListener('click', onGlobalClick)
    teardown.push(() => document.removeEventListener('click', onGlobalClick))

    const element = document.querySelector('.mobile-header') as HTMLElement

    sticky = new Sticky(element, {
        stuck: 'mobile-header--stuck',
        show: 'mobile-header--show'
    })

    sticky.start()
    sticky.calc(element)
})

onBeforeUnmount(() => {
    sticky?.destroy()
    teardown.forEach(x => x())
})

function onSearchClick() {
    searchIsOpen.value = true
    setTimeout(() => {
        searchRef.value?.focus()
    }, 0)
}

function onSearchClose() {
    searchIsOpen.value = false
}

function onGlobalClick(event: MouseEvent) {
    const search = searchRef.value?.$el
    const searchButton = searchButtonRef.value?.$el

    if (event.target instanceof HTMLElement && !(
        search?.contains(event.target) ||
        searchButton?.contains(event.target)
    )) {
        searchIsOpen.value = false
    }
}

function onCartClick() {
    if (optionsStore.dropcartType === 'offcanvas') {
        offcanvasCartStore.open()
    }
}
</script>
