<template>
    <AppModal id="modalPaymentPaypal" hide-footer size="lg">
        <template #modal-title>Pagamento via PayPal</template>
        <paypal-plus
            iframeHeight="470"
            country="BR"
            mode="live"
            ref="ppplus"
            :approvalUrl="data.approvalUrl"
            :firstName="data.firstName"
            :lastName="data.lastName"
            :taxId="data.taxId"
            :email="data.email"
            :phone="data.phone"
            :installmentTerm="data.installmentTerm"
            blockInstallment="true"
            @checkout="paypalOnContinue"
            @error="paypalOnError"
            buttonId="btnComprarPaypal"
        />
        <button type="button" class="btn btn-primary btn-xl w-100" :class="{ 'btn-loading': loading }" id="btnComprarPaypal" @click="comprarPaypal()">
            Comprar
        </button>
    </AppModal>
</template>

<script setup lang="ts">
import { ref } from 'vue'
import { useAccountStore } from '~/stores/account'
import { useRouter } from 'vue-router'

const props = defineProps<{
    data: any
}>()

const accountStore = useAccountStore()
const router = useRouter()

const ppplus = ref<any>()
const loading = ref(false)

function comprarPaypal() {
    ppplus.value?.pppContinue()
}

function paypalOnContinue(data: any) {
    const payerId = data.payer.payer_info.payer_id
    const payId = props.data.payId
    loading.value = true
    accountStore.executePaypal({ payerId, payId }).then((res: any) => {
        router.push('/shop/checkout/success')
        loading.value = false
    }).catch((result: any) => {
        useNuxtApp().$notify?.({
            group: 'api',
            type: 'error',
            text: result.message,
            duration: 5000
        })
        loading.value = false
    })
}

function paypalOnError(data: any) {
    // error handler
}
</script>

<style scoped>
#zoid-paypal-button-0ffb96d508 {
    font-size: 0;
    width: 100%;
    overflow: hidden;
    min-width: 75px;
}

#zoid-paypal-button-0ffb96d508.paypal-button-size-responsive {
    text-align: center;
}

#zoid-paypal-button-0ffb96d508 > .zoid-outlet {
    display: inline-block;
    min-width: 75px;
    max-width: 750px;
    position: relative;
}

#zoid-paypal-button-0ffb96d508.paypal-button-layout-vertical > .zoid-outlet {
    min-width: 75px;
}

#zoid-paypal-button-0ffb96d508 > .zoid-outlet {
    width:  150px;
    height: 25px;
}

    #zoid-paypal-button-0ffb96d508.paypal-button-size-responsive > .zoid-outlet {
    width: 100%;
}

#zoid-paypal-button-0ffb96d508 > .zoid-outlet > iframe {
    min-width: 100%;
    max-width: 100%;
    width: 75px;
    height: 100%;
    position: absolute;
    top: 0;
    left: 0;
}

#zoid-paypal-button-0ffb96d508 > .zoid-outlet > iframe.zoid-component-frame {
    z-index: 100;
}

#zoid-paypal-button-0ffb96d508 > .zoid-outlet > iframe.zoid-prerender-frame {
    transition: opacity .2s linear;
    z-index: 200;
}

#zoid-paypal-button-0ffb96d508 > .zoid-outlet > iframe.zoid-visible {
    opacity: 1;
}

#zoid-paypal-button-0ffb96d508 > .zoid-outlet > iframe.zoid-invisible {
    opacity: 0;
    pointer-events: none;
}
</style>
