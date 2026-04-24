<template>
    <!-- site -->
    <div class="site">
        <div class="site__container">
            <!-- mobile site__header -->
            <header class="site__header d-lg-none">
                <MobileHeader sticky-mode="pullToShow" />
            </header>
            <!-- mobile site__header / end -->

            <!-- desktop site__header -->
            <header class="site__header d-lg-block d-none">
                <Header />
            </header>
            <!-- desktop site__header / end -->

            <!-- site__body -->
            <div class="site__body" style="background-image: url(/); background-repeat: no-repeat; background-position:top; background-position-y: -264px; background-attachment: fixed;">
                <slot />
            </div>
            <!-- site__body / end -->

            <!-- site__footer -->
            <footer class="site__footer">
                <Footer />
            </footer>
            <!-- site__footer / end -->
        </div>

        <!-- quickview-modal -->
        <Quickview />
        <!-- quickview-modal / end -->

        <!-- payment-options-modal -->
        <PaymentOptions />
        <!-- payment-options-modal / end -->

        <!-- mobilemenu -->
        <MobileMenu />
        <!-- mobilemenu / end -->

        <ClientOnly>
            <!--suppress HtmlUnknownTag -->
            <notifications classes="vue-toast" />
            <notifications group="compare" classes="vue-toast" @click.prevent="router.push('/shop/compare')">
                <template #body="props">
                    <div class="vue-toast success" @click="router.push('/shop/compare')">
                        <a class="title">{{props.item.title}}</a>
                        <a class="close" @click="props.close"><i class="fa fa-fw fa-close"></i></a>
                        <div v-html="props.item.text"></div>
                    </div>
                </template>
            </notifications>
            <notifications group="api" classes="vue-toast" position="top right" />
        </ClientOnly>
        <LazyDropcart v-if="dropcartType === 'offcanvas'" type="offcanvas" />
    </div>
    <!-- site / end -->
</template>

<script setup lang="ts">
import { ref, onMounted, nextTick, computed } from 'vue'
import { useRouter } from 'vue-router'
import { useOptionsStore } from '~/stores/options'
import { useHead } from '#app'

const optionsStore = useOptionsStore()
const router = useRouter()

const dropcartType = computed(() => optionsStore.dropcartType)

const bodyClasses = ref(['disable-transitions'])

useHead({
    bodyAttrs: {
        class: bodyClasses
    }
})

onMounted(async () => {
    await nextTick()
    bodyClasses.value = []
})
</script>
