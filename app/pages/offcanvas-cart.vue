<template>
    <div>
        <PageHeader
            title="Offcanvas Cart"
            :breadcrumb="[
                { title: 'Home', url: '/' },
                { title: 'Offcanvas Cart', url: '/' },
            ]"
        />

        <div class="block-empty__body">
            <div class="block-empty__message">
                Click on the button to open the offcanvas cart!
            </div>
            <div class="block-empty__actions">
                <button
                    type="button"
                    class="btn btn-primary btn-sm"
                    @click="offcanvasCart.open()"
                >
                    Open Cart
                </button>
            </div>
        </div>
    </div>
</template>

<script setup lang="ts">
import { useOptionsStore } from '~/stores/options'
import { useOffcanvasCartStore } from '~/stores/offcanvasCart'

const options = useOptionsStore()
const offcanvasCart = useOffcanvasCartStore()

options.setHeaderLayout('default')
options.setDropcartType('offcanvas')

useHead({ title: 'Offcanvas Cart' })
</script>
