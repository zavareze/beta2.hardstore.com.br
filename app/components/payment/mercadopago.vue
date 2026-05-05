<template>
    <AppModal id="modalMercadoPago" hide-footer size="md">
        <template #modal-title>Pagamento com Cartão</template>
        <CardForm :valor="valor" :valor1x="valor1x" :valor3x="valor3x" @submitCard="submitCard($event)" :btnSubmit="btnSubmit"
        @input-card-number="getPaymentMethods($event)"
        @input-card-installments="changeInstallments($event)"
        @close="closeModal()" :error="error" />
    </AppModal>
</template>

<script setup lang="ts">
import { ref, shallowRef, onMounted } from 'vue'

defineOptions({ inheritAttrs: false })
import { useAccountStore } from '~/stores/account'
import { useRouter } from 'vue-router'

const props = defineProps<{
    valor1x: number
    valor3x: number
    valor: number
}>()

const accountStore = useAccountStore()
const router = useRouter()

const appModal = useModal()
const mercadopago = shallowRef<any>(null)
const loading = ref(false)
const lastQueriedBin = ref('')
const cartao = ref({
    nome: '',
    numero: '',
    mes: '',
    ano: '',
    cvv: '',
    tokenId: '',
    paymentMethod: {} as any,
    valor: '',
    parcelas: 1
})
const error = ref('')
const btnSubmit = ref(true)

function closeModal() {
    appModal.hide('modalMercadoPago')
    cartao.value = { nome: '', numero: '', mes: '', ano: '', cvv: '', tokenId: '', paymentMethod: {} as any, valor: '', parcelas: 1 }
    error.value = ''
    btnSubmit.value = true
}

onMounted(() => {
    if (process.client) {
        mercadopago.value = new (window as any).MercadoPago('APP_USR-948b11fe-65c5-4dab-996b-2e7c1d9a7c45')
    }
})

async function getIdentificationTypes() {
    try {
        const identificationTypes = await mercadopago.value.getIdentificationTypes()
    } catch (e) {
        return console.error('Error getting identificationTypes: ', e)
    }
}

async function getPaymentMethods(cardNumber: string) {
    const sanitizedCart = cardNumber.replace(/[^0-9]+/g, '')
    cartao.value.numero = sanitizedCart
    if (sanitizedCart.length < 6) {
        lastQueriedBin.value = ''
        cartao.value.paymentMethod = {} as any
        return
    }
    const bin = sanitizedCart.substring(0, 6)
    if (bin === lastQueriedBin.value) return
    lastQueriedBin.value = bin
    try {
        const paymentMethods = await mercadopago.value.getPaymentMethods({ 'bin': bin })
        if (!paymentMethods.results?.length) return
        cartao.value.paymentMethod = Object.assign({}, paymentMethods.results[0])
        const additionalInfo = cartao.value.paymentMethod.additional_info_needed
        if (Array.isArray(additionalInfo) && additionalInfo.includes('issuer_id')) {
            getIssuers(bin)
        } else {
            getInstallments(bin)
        }
    } catch (e) {
        console.error('error getting payment methods: ', e)
    }
}

function changeInstallments(parcelas: number) {
    cartao.value.parcelas = parcelas
}

async function getIssuers(bin: string) {
    try {
        await mercadopago.value.getIssuers({ paymentMethodId: cartao.value.paymentMethod.id, bin })
        getInstallments(bin)
    } catch (e) {
        console.error('error getting issuers: ', e)
    }
}

async function getInstallments(bin: string) {
    const amount = cartao.value.parcelas === 1 ? props.valor1x.toString() : props.valor.toString()
    try {
        const installments = await mercadopago.value.getInstallments({
            amount,
            bin,
            paymentTypeId: 'credit_card'
        })
    } catch (e) {
        console.error('error getting installments: ', e)
    }
}

async function submitCard(cart: any) {
    error.value = ''
    const identificationNumber = accountStore.user.document.toString().replace(/\D/g, '')
    const identificationType = identificationNumber.length === 14 ? 'CNPJ' : 'CPF'
    try {
        const cartData = {
            cardNumber: cart.cardNumberNotMask.replace(/\D/g, ''),
            cardholderName: cart.cardName,
            identificationType: identificationType,
            identificationNumber: identificationNumber,
            securityCode: cart.cardCvv,
            cardExpirationMonth: cart.cardMonth.toString(),
            cardExpirationYear: cart.cardYear.toString().substr(2, 2),
        }

        if (cartData.cardNumber === '') error.value = 'Você não preencheu o Número do Cartão'
        if (cartData.cardholderName === '') error.value = 'Você não preencheu o Nome do Titular do Cartão'
        if (cartData.securityCode === '') error.value = 'Você não preencheu o Código de Segurança'
        if (cartData.cardExpirationMonth === '') error.value = 'Você não preencheu o Mês de Vencimento'
        if (cartData.cardExpirationYear === '') error.value = 'Você não preencheu o Ano de Vencimento'
        await getPaymentMethods(cartData.cardNumber)
        if (error.value !== '') {
            return
        }
        const token = await mercadopago.value.createCardToken(cartData)
        cartao.value.tokenId = token.id
        sendToServer()
    } catch (e) {
        console.error('error creating card token: ', e)
        error.value = 'Não foi possível processar os dados do cartão, verifique os dados digitados e tente novamente'
        btnSubmit.value = true
    }
}

function sendToServer() {
    if (btnSubmit.value) {
        btnSubmit.value = false
        if (!cartao.value.paymentMethod?.id) {
            error.value = 'Não foi possível identificar a bandeira do cartão. Digite o número completo.'
            btnSubmit.value = true
            return
        }
        const transactionAmount = cartao.value.parcelas === 1 ? props.valor1x : cartao.value.parcelas <= 3 ? props.valor3x : props.valor
        const email = accountStore.user.email
        const order = accountStore.order.id
        const identificationNumber = accountStore.user.document.toString().replace(/\D/g, '')
        const identificationType = identificationNumber.length === 14 ? 'CNPJ' : 'CPF'
        const data = {
            order,
            token: cartao.value.tokenId,
            issuerId: cartao.value.paymentMethod?.issuer?.id ?? null,
            paymentMethodId: cartao.value.paymentMethod.id,
            transactionAmount,
            installments: cartao.value.parcelas,
            description: '',
            payer: {
                email,
                identification: {
                    type: identificationType,
                    number: identificationNumber,
                },
            }
        }
        accountStore.createMercadoPago(data).then((res: any) => {
            console.log('account/createMercadoPago', res)
            if (res.status === 'approved') {
                router.push('/shop/checkout/success')
            } else {
                btnSubmit.value = true
                error.value = res.mensagem
            }
        }).catch((result: any) => {
            error.value = result.message
            useNuxtApp().$notify?.({
                group: 'api',
                type: 'error',
                text: result.message,
                duration: 5000
            })
            btnSubmit.value = true
        })
    }
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
