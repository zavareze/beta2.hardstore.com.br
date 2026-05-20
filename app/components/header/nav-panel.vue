<template>
    <div
        :class="[
            'nav-panel',
            {'nav-panel--sticky': stickyMode}
        ]"
    >
        <div class="nav-panel__container container">
            <div class="nav-panel__row">
                <div v-if="layout === 'compact'" class="nav-panel__logo">
                    <AppLink to="/">
                        <!-- logo -->
                        <!--<LogoSmallSvg />-->
                        <!-- logo / end -->
                    </AppLink>
                </div>

                <div v-if="layout === 'default'" class="nav-panel__departments">
                    <Departments ref="departmentsRef" @onSetArea="onSetDepartmentsArea" />
                </div>

                <!-- .nav-links -->
                <NavLinks ref="navRef" class="nav-panel__nav-links" />
                <!-- .nav-links / end -->

                <div class="nav-panel__indicators">
                    <SearchScope>
                        <Indicator
                            v-if="layout === 'compact'"
                            ref="searchIndicatorRef"
                            trigger="click"
                            @open="searchRef?.focus()"
                        >
                            <template v-slot:icon>
                                <Search20Svg class="indicator__icon" />
                                <Cross20Svg class="indicator__icon indicator__icon--open" />
                            </template>

                            <Search
                                ref="searchRef"
                                location="indicator"
                                @close="searchIndicatorRef?.close()"
                            />
                        </Indicator>
                    </SearchScope>

                    <Indicator to="/shop/compare" :value="compareValue" aria-label="Comparar produtos">
                        <template v-slot:icon>
                            <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" class=""><path d="M9 15H7c-.6 0-1-.4-1-1V2c0-.6.4-1 1-1h2c.6 0 1 .4 1 1v12c0 .6-.4 1-1 1zM1 9h2c.6 0 1 .4 1 1v4c0 .6-.4 1-1 1H1c-.6 0-1-.4-1-1v-4c0-.6.4-1 1-1zM15 5h-2c-.6 0-1 .4-1 1v8c0 .6.4 1 1 1h2c.6 0 1-.4 1-1V6c0-.6-.4-1-1-1z"></path></svg>
                        </template>
                    </Indicator>

                    <Indicator :to="url.wishlist()" :value="wishlistValue" aria-label="Lista de desejos">
                        <template v-slot:icon>
                            <Heart20Svg />
                        </template>
                    </Indicator>

                    <Indicator
                        ref="cartIndicatorRef"
                        :to="url.cart()"
                        :value="cartValue"
                        trigger="click"
                        :close-delay-on-mouse-leave="500"
                        aria-label="Carrinho de compras"
                        @buttonClick="onCartClick"
                    >
                        <template v-slot:icon>
                            <Cart20Svg />
                        </template>

                        <Dropcart v-if="optionsStore.dropcartType === 'dropdown'" />
                    </Indicator>

                    <Indicator
                        ref="accountIndicatorRef"
                        :to="url.accountDashboard()"
                        trigger="click"
                        :close-delay-on-mouse-leave="500"
                        aria-label="Minha conta"
                    >
                        <template v-slot:icon>
                            <Person20Svg />
                        </template>

                        <AccountMenu />
                    </Indicator>
                </div>
            </div>
        </div>
    </div>
</template>

<script setup lang="ts">
import { ref, watchEffect, onMounted, onBeforeUnmount } from 'vue'
import { useOptionsStore } from '~/stores/options'
import { useWishlistStore } from '~/stores/wishlist'
import { useCompareStore } from '~/stores/compare'
import { useCartStore } from '~/stores/cart'
import { useOffcanvasCartStore } from '~/stores/offcanvasCart'
import Sticky from '~/services/sticky'
import departments from '~/services/departments'
import Heart20Svg from '~/svg/heart-20.svg'
import Cart20Svg from '~/svg/cart-20.svg'
import Person20Svg from '~/svg/person-20.svg'
import Search20Svg from '~/svg/search-20.svg'
import Cross20Svg from '~/svg/cross-20.svg'

type Layout = 'default' | 'compact'
type StickyMode = 'pullToShow' | 'alwaysOnTop' | false

withDefaults(defineProps<{
    layout?: Layout
    stickyMode?: StickyMode
}>(), {
    layout: 'default',
    stickyMode: false
})

const url = useUrl()
const optionsStore = useOptionsStore()
const wishlistStore = useWishlistStore()
const compareStore = useCompareStore()
const cartStore = useCartStore()
const offcanvasCartStore = useOffcanvasCartStore()

const cartValue = ref<number | null>(null)
const compareValue = ref<number | null>(null)
const wishlistValue = ref<number | null>(null)

const departmentsRef = ref<any>()
const navRef = ref<any>()
const searchIndicatorRef = ref<any>()
const cartIndicatorRef = ref<any>()
const accountIndicatorRef = ref<any>()
const searchRef = ref<any>()

let sticky: Sticky | null = null

const el = ref<HTMLElement | null>(null)

onMounted(() => {
    watchEffect(() => { cartValue.value = cartStore.quantity })
    watchEffect(() => { compareValue.value = compareStore.items.length })
    watchEffect(() => { wishlistValue.value = wishlistStore.items.length })

    const element = el.value || document.querySelector('.nav-panel') as HTMLElement

    sticky = new Sticky(element, {
        stuck: 'nav-panel--stuck',
        show: 'nav-panel--show'
    })

    sticky.on('stuck', () => {
        if (departmentsRef.value) {
            departmentsRef.value.setStickyState(true)
        }
    })
    sticky.on('fix', () => {
        if (departmentsRef.value) {
            departmentsRef.value.setStickyState(false)
        }
    })
    sticky.on('hide', () => {
        if (departmentsRef.value) {
            departmentsRef.value.closeMenu(true)
        }
        if (navRef.value) {
            navRef.value.closeSubmenu()
        }
        if (searchIndicatorRef.value) {
            searchIndicatorRef.value.close(true)
        }
        if (cartIndicatorRef.value) {
            cartIndicatorRef.value.close(true)
        }
        if (accountIndicatorRef.value) {
            accountIndicatorRef.value.close(true)
        }
    })

    sticky.start()
    sticky.calc(element, departments.element ? [departments.element] : [])
})

onBeforeUnmount(() => {
    if (sticky) {
        sticky.destroy()
    }
})

function onSetDepartmentsArea(area: Element) {
    const element = el.value || document.querySelector('.nav-panel') as Element

    if (sticky) {
        sticky.calc(element, area ? [area] : [])
    }
}

function onCartClick() {
    if (optionsStore.dropcartType === 'offcanvas') {
        offcanvasCartStore.open()
    }
}
</script>
