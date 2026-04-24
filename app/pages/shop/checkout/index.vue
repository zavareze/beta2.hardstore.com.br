<template>
    <div>
        <client-only>
            <PageHeader
                title="Fechar Compra"
                :breadcrumb="[
                    { title: 'Home', url: url.home() },
                    { title: 'Carrinho', url: url.cart() },
                    { title: 'Pagamento', url: '' },
                ]"
            />
            <div class="checkout block">
                <div class="container">
                    <form ref="formulario" novalidate @submit.prevent="checkForm">
                        <div class="row">
                            <div v-if="!account.logged" class="col-12 mb-3">
                                <div class="alert alert-lg alert-warning">
                                    Já é Cliente?
                                    <AppLink :to="url.signIn('/shop/checkout')">
                                        Clique aqui para efetuar o login
                                    </AppLink>
                                </div>
                            </div>
                            <div v-if="account.logged" class="col-12 col-lg-6 col-xl-7">
                                <div class="card mb-lg-0">
                                    <div class="card-body">
                                        <button type="button" class="btn btn-primary btn-sm float-end" @click="router.push('/account/addresses/new?redirect=/shop/checkout')">
                                            Novo Endereço
                                        </button>
                                        <h3 class="card-title">
                                            Selecione seu Endereço
                                        </h3>
                                        <template v-for="(address, i) in account.addresses" :key="i">
                                            <div class="card address-card" @click="setAddress(address)">
                                                <div class="address-card__body">
                                                    <div
                                                        v-if="selectedAddress.id === address.id"
                                                        class="address-card__badge"
                                                    >
                                                        Selecionado
                                                    </div>
                                                    <span class="input-radio__body float-end" style="margin-top: 15px">
                                                        <input
                                                            type="radio"
                                                            name="checkoud_address"
                                                            class="float-end input-radio__input input-radio__circle"
                                                            :value="address.id"
                                                            :checked="selectedAddress.id === address.id"
                                                            @click="selectedAddress = address"
                                                        >
                                                        <span class="input-radio__circle" />
                                                    </span>
                                                    <div class="float-end pt-5">
                                                        <AppLink :to="url.accountAddress(address)" style="color: #cc3333">
                                                            Editar
                                                        </AppLink>
                                                    </div>
                                                    <div class="address-card__row">
                                                        <div class="address-card__row-title">
                                                            CEP
                                                        </div>
                                                        <div class="address-card__row-content">
                                                            {{ address.cep }}
                                                        </div>
                                                    </div>
                                                    <div class="address-card__row">
                                                        <div class="address-card__row-title">
                                                            Endereço
                                                        </div>
                                                        <div class="address-card__row-content">
                                                            {{ address.logradouro }}, {{ address.numero }}, {{ address.complemento }}<br>
                                                            {{ address.bairro }}
                                                        </div>
                                                    </div>
                                                    <div class="address-card__row">
                                                        <div class="address-card__row-title">
                                                            Cidade/UF
                                                        </div>
                                                        <div class="address-card__row-content">
                                                            {{ address.cidade }}/{{ address.uf }}
                                                        </div>
                                                    </div>
                                                    <br>
                                                    <p v-show="address.estimativa" style="color: red; font-weight: 400; font-size: smalll;">
                                                        Você receberá na {{ address.estimativa }}
                                                    </p>
                                                    <div v-show="address.error" class="alert alert-danger mb-3">
                                                        {{ address.error }}
                                                    </div>
                                                </div>
                                            </div>
                                            <div class="addresses-list__divider" style="height: 10px" />
                                        </template>
                                    </div>
                                </div>
                            </div>
                            <div v-if="!account.logged" class="col-12 col-lg-6 col-xl-7">
                                <div class="card mb-lg-0">
                                    <div class="card-body">
                                        <h3 class="card-title">
                                            Identificação
                                        </h3>
                                        <div class="form-group">
                                            <mdb-input
                                                id="checkout-nome"
                                                v-model="user.nome"
                                                label="Nome"
                                                type="text"
                                                required
                                                invalid-feedback="Você deve informar seu Nome"
                                            />
                                        </div>
                                        <div class="form-group">
                                            <mdb-select
                                                v-model="comboTipoPessoa"
                                                label="Tipo Pessoa"
                                                @change="checkTipoPessoa()"
                                            />
                                        </div>
                                        <div class="form-group">
                                            <mdb-input
                                                id="checkout-document"
                                                v-model="user.document"
                                                v-mdb-input-mask="documentMask"
                                                required
                                                invalid-feedback="Você deve informar seu CPF/CNPJ"
                                                type="text"
                                                label="CPF / CNPJ"
                                            />
                                        </div>
                                        <div class="form-group">
                                            <mdb-input
                                                id="checkout-email"
                                                v-model="user.email"
                                                type="text"
                                                label="Email"
                                                required
                                                invalid-feedback="Você deve informar seu E-mail"
                                            />
                                        </div>
                                        <div class="form-group">
                                            <mdb-input id="checkout-celular" v-model="user.telefone_celular" v-mdb-input-mask="'(♠♠) ♠♠♠♠♠-♠♠♠♠'" type="text" label="Telefone Celular" />
                                        </div>
                                        <div class="form-group">
                                            <mdb-input id="checkout-residencial" v-model="user.telefone_residencial" v-mdb-input-mask="'(♠♠) ♠♠♠♠-♠♠♠♠'" type="text" label="Telefone Residencial" />
                                        </div>
                                        <div class="form-group">
                                            <mdb-input id="checkout-comercial" v-model="user.telefone_comercial" v-mdb-input-mask="'(♠♠) ♠♠♠♠-♠♠♠♠'" type="text" label="Telefone Comercial" />
                                        </div>
                                        <div class="form-group">
                                            <mdb-input
                                                id="checkout-cep"
                                                v-model="user.cep"
                                                v-mdb-input-mask="'♠♠♠♠♠-♠♠♠'"
                                                type="text"
                                                label="CEP"
                                                :class="{ 'is-invalid': cepError }"
                                                @blur="buscaCEP()"
                                            />
                                            <div
                                                class="invalid-feedback"
                                                required
                                                invalidFeedback="Você deve informar seu CEP"
                                            >
                                                {{ cepError }}
                                            </div>
                                        </div>
                                        <div class="form-group">
                                            <mdb-input
                                                id="checkout-logradouro"
                                                v-model="user.logradouro"
                                                type="text"
                                                label="Logradouro"
                                                required
                                                invalid-feedback="Você deve informar seu Endereço"
                                            />
                                        </div>
                                        <div class="form-group">
                                            <mdb-input
                                                id="checkout-numero"
                                                ref="numeroRef"
                                                v-model="user.numero"
                                                type="text"
                                                label="Número"
                                                required
                                                invalid-feedback="Você deve informar seu Número"
                                            />
                                        </div>
                                        <div class="form-group">
                                            <mdb-input id="checkout-complemento" v-model="user.complemento" type="text" label="Complemento" />
                                        </div>
                                        <div class="form-group">
                                            <mdb-input
                                                id="checkout-bairro"
                                                v-model="user.bairro"
                                                type="text"
                                                label="Bairro"
                                                required
                                                invalid-feedback="Você deve informar seu Bairro"
                                            />
                                        </div>
                                        <div class="form-group">
                                            <mdb-input
                                                id="checkout-cidade"
                                                v-model="user.cidade"
                                                type="text"
                                                label="Cidade"
                                                required
                                                invalid-feedback="Você deve informar seu Cidade"
                                            />
                                        </div>
                                        <div class="form-group">
                                            <mdb-select
                                                v-model="comboUF"
                                                search
                                                label="UF"
                                                search-placeholder="Informe o Estado"
                                                required
                                                invalid-feedback="Você deve informar seu Estado"
                                                @change="changeUF()"
                                            />
                                        </div>
                                    </div>
                                </div>
                            </div>

                            <div class="col-12 col-lg-6 col-xl-5 mt-4 mt-lg-0">
                                <div class="card mb-0">
                                    <div class="card-body">
                                        <h3 class="card-title">
                                            Seu Pedido
                                        </h3>

                                        <table class="checkout__totals">
                                            <thead class="checkout__totals-header">
                                                <tr>
                                                    <th>Produto</th>
                                                    <th>Total</th>
                                                </tr>
                                            </thead>
                                            <tbody class="checkout__totals-products">
                                                <tr v-for="item in cart.items" :key="item.id">
                                                    <td>{{ item.product.name }} × {{ item.quantity }}</td>
                                                    <td>
                                                        <template v-if="currentPayment === 1 || currentPayment === 4">
                                                            <div style="text-decoration: line-through">
                                                                {{ price( (item.price/.85).toFixed(2) * item.quantity) }}
                                                            </div>
                                                            <div>{{ price(item.price * item.quantity) }}</div>
                                                        </template>
                                                        <template v-else>
                                                            <div>{{ price( (item.price/.85).toFixed(2) * item.quantity) }}</div>
                                                        </template>
                                                    </td>
                                                </tr>
                                            </tbody>
                                            <tbody class="checkout__totals-subtotals">
                                                <tr>
                                                    <th>Subtotal</th>
                                                    <td>
                                                        <template v-if="currentPayment === 1 || currentPayment === 4">
                                                            {{ price(cart.subtotal) }}
                                                        </template>
                                                        <template v-else>
                                                            {{ price(cart.subtotal/.85) }}
                                                        </template>
                                                    </td>
                                                </tr>
                                                <tr>
                                                    <th>Frete</th>
                                                    <td>{{ price(cart.shipping) }}</td>
                                                </tr>
                                            </tbody>
                                            <tfoot class="checkout__totals-footer">
                                                <tr>
                                                    <th>Total</th>
                                                    <td>
                                                        <template v-if="currentPayment === 1 || currentPayment === 4">
                                                            {{ price(cart.total) }}
                                                        </template>
                                                        <template v-else>
                                                            {{ price(cart.subtotal/.85+cart.shipping) }}
                                                        </template>
                                                    </td>
                                                </tr>
                                            </tfoot>
                                        </table>

                                        <div class="payment-methods">
                                            <ul class="payment-methods__list">
                                                <Collapse :is-open="currentPayment === 4">
                                                    <li class="payment-methods__item" :class="{ 'payment-methods__item--active': currentPayment === 4 }">
                                                        <label class="payment-methods__item-header">
                                                            <span class="payment-methods__item-radio input-radio">
                                                                <span class="input-radio__body">
                                                                    <input
                                                                        type="radio"
                                                                        class="input-radio__input"
                                                                        name="checkout_payment_method"
                                                                        :value="4"
                                                                        :checked="currentPayment === 4"
                                                                        @click="currentPayment = 4"
                                                                    >
                                                                    <span class="input-radio__circle" />
                                                                </span>
                                                            </span>
                                                            <span class="payment-methods__item-title">
                                                                Pix
                                                            </span>
                                                        </label>
                                                        <div class="payment-methods__item-container">
                                                            <div class="payment-methods__item-description text-muted">
                                                                Pague via PIX um novo sistema de Pagamentos Instantâneos criado pelo Banco Central e aceito por todos bancos. Você paga diretamente pelo seu aplicativo.
                                                            </div>
                                                        </div>
                                                    </li>
                                                </Collapse>
                                                <Collapse :is-open="currentPayment === 1" v-if="false && !cartStore.checkForVGA?.hasOnlyVGA">
                                                    <li class="payment-methods__item" :class="{ 'payment-methods__item--active': currentPayment === 1 }">
                                                        <label class="payment-methods__item-header">
                                                            <span class="payment-methods__item-radio input-radio">
                                                                <span class="input-radio__body">
                                                                    <input
                                                                        type="radio"
                                                                        class="input-radio__input"
                                                                        name="checkout_payment_method"
                                                                        :value="1"
                                                                        :checked="currentPayment === 1"
                                                                        @click="currentPayment = 1"
                                                                    >
                                                                    <span class="input-radio__circle" />
                                                                </span>
                                                            </span>
                                                            <span class="payment-methods__item-title">
                                                                Boleto Bancário
                                                            </span>
                                                        </label>
                                                        <div class="payment-methods__item-container">
                                                            <div class="payment-methods__item-description text-muted">
                                                                Pague no Boleto Bancário em qualquer agência bancária de sua preferência.Digite aqui
                                                            </div>
                                                        </div>
                                                    </li>
                                                </Collapse>
                                                <Collapse v-if="false" :is-open="currentPayment === 2">
                                                    <li class="payment-methods__item" :class="{ 'payment-methods__item--active': currentPayment === 2 }">
                                                        <label class="payment-methods__item-header">
                                                            <span class="payment-methods__item-radio input-radio">
                                                                <span class="input-radio__body">
                                                                    <input
                                                                        type="radio"
                                                                        class="input-radio__input"
                                                                        name="checkout_payment_method"
                                                                        :value="2"
                                                                        :checked="currentPayment === 2"
                                                                        @click="currentPayment = 2"
                                                                    >
                                                                    <span class="input-radio__circle" />
                                                                </span>
                                                            </span>
                                                            <span class="payment-methods__item-title">
                                                                Banricompras
                                                            </span>
                                                        </label>
                                                        <div class="payment-methods__item-container">
                                                            <div class="payment-methods__item-description text-muted">
                                                                <select v-model="parcelas" class="form-control">
                                                                    <option value="0">
                                                                        {{ price(cart.subtotal/.85*.88+cart.shipping) }} no Débito com 12% de desconto
                                                                    </option>
                                                                    <option value="1">
                                                                        {{ price(cart.subtotal/.85*.88+cart.shipping) }} Pré Datado 30 dias
                                                                    </option>
                                                                    <option v-for="parcela of [2,3,4,5,6,7,8,9,10,11,12]" :key="parcela" :value="parcela">
                                                                        {{ price(cart.total/.85) }} em {{ parcela }}x sem juros de {{ price((cart.total/.85)/parcela) }}
                                                                    </option>
                                                                </select>
                                                            </div>
                                                        </div>
                                                    </li>
                                                </Collapse>
                                                <Collapse :is-open="currentPayment === 3">
                                                    <li class="payment-methods__item" :class="{ 'payment-methods__item--active': currentPayment === 3 }">
                                                        <label class="payment-methods__item-header">
                                                            <span class="payment-methods__item-radio input-radio">
                                                                <span class="input-radio__body">
                                                                    <input
                                                                        type="radio"
                                                                        class="input-radio__input"
                                                                        name="checkout_payment_method"
                                                                        :value="3"
                                                                        :checked="currentPayment === 3"
                                                                        @click="currentPayment = 3"
                                                                    >
                                                                    <span class="input-radio__circle" />
                                                                </span>
                                                            </span>
                                                            <span class="payment-methods__item-title">
                                                                Cartão de Crédito
                                                            </span>
                                                        </label>
                                                        <div class="payment-methods__item-container">
                                                            <div class="payment-methods__item-description text-muted">
                                                                Pague com seu cartão de crédito ou débito em até 12x.
                                                            </div>
                                                        </div>
                                                    </li>
                                                </Collapse>
                                            </ul>
                                        </div>

                                        <div class="checkout__agree form-group">
                                            <div class="form-check">
                                                <span class="form-check-input input-check">
                                                    <span class="input-check__body">
                                                        <input
                                                            id="checkout-terms"
                                                            class="input-check__input"
                                                            type="checkbox"
                                                            checked
                                                        >
                                                        <span class="input-check__box" />
                                                        <Check9x7Svg class="input-check__icon" />
                                                    </span>
                                                </span>
                                                <label class="form-check-label" for="checkout-terms">
                                                    Aceito o contrato de compra e venda com seus
                                                    <AppLink :to="url.terms()">
                                                        Termos e Condições
                                                    </AppLink>
                                                    *
                                                </label>
                                            </div>
                                        </div>

                                        <button type="submit" class="btn btn-primary btn-xl btn-block">
                                            Fechar compra
                                        </button>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </form>
                </div>
            </div>
            <AppModal id="modalLoading" hide-footer no-close-on-backdrop>
                <template #modal-title>Processando...</template>
                <div class="text-center py-4"><div class="btn-loading" /></div>
            </AppModal>
            <paypal :data="paypalTransparent" />
            <pix :data="pix" />
            <MercadoPago v-model="parcelas"
                :valor="parseFloat((cart.subtotal/.85+cart.shipping).toFixed(2))"
                :valor1x="parseFloat((cart.subtotal/.85*.88+cart.shipping).toFixed(2))"
                :valor3x="parseFloat((cart.subtotal/.85*.9+cart.shipping).toFixed(2))"
             />
            <AppModal id="modalRecuperarSenha" hide-footer>
                <template #modal-title>Recuperar Senha</template>
                <h4>Seu CPF/CNPJ já possui cadastro com o email</h4>
                <h1>{{ email }}</h1>
                <h4>Recupere sua senha, <a href="#" @click.prevent="recuperarSenha()">Clique aqui!</a></h4>
            </AppModal>
        </client-only>
    </div>
</template>

<script setup lang="ts">
import { useCartStore } from '~/stores/cart'
import { useAccountStore } from '~/stores/account'

const cartStore = useCartStore()
const account = useAccountStore()
const url = useUrl()
const router = useRouter()
const { price } = usePrice()

useHead({ title: 'Fechar Compra' })

const cart = computed(() => cartStore)

const currentPayment = ref(4)
const comboTipoPessoa = ref([{ text: 'Pessoa Física', value: '1', selected: true }, { text: 'Pessoa Jurídica', value: '2' }])
const comboUF = ref([{ text: 'AC', value: 'AC', selected: false }, { text: 'AL', value: 'AL' }, { text: 'AM', value: 'AM' }, { text: 'AP', value: 'AP' },
    { text: 'BA', value: 'BA' }, { text: 'CE', value: 'CE' }, { text: 'DF', value: 'DF' }, { text: 'ES', value: 'ES' },
    { text: 'GO', value: 'GO' }, { text: 'MA', value: 'MA' }, { text: 'MG', value: 'MG' }, { text: 'MS', value: 'MS' },
    { text: 'MT', value: 'MT' }, { text: 'PA', value: 'PA' }, { text: 'PB', value: 'PB' }, { text: 'PE', value: 'PE' },
    { text: 'PI', value: 'PI' }, { text: 'PR', value: 'PR' }, { text: 'RJ', value: 'RJ' }, { text: 'RN', value: 'RN' },
    { text: 'RO', value: 'RO' }, { text: 'RR', value: 'RR' }, { text: 'RS', value: 'RS' }, { text: 'SC', value: 'SC' },
    { text: 'SE', value: 'SE' }, { text: 'SP', value: 'SP' }, { text: 'TO', value: 'TO' }])

const parcelas = ref(1)
const maskCPF = '♠♠♠.♠♠♠.♠♠♠-♠♠'
const maskCNPJ = '♠♠.♠♠♠.♠♠♠/♠♠♠♠-♠♠'
const documentMask = ref(maskCPF)
const user = ref({
    nome: '',
    tipo_pessoa: '1',
    document: '',
    email: '',
    telefone_celular: '',
    telefone_residencial: '',
    telefone_comercial: '',
    cep: account.cep || '',
    logradouro: '',
    numero: '',
    complemento: '',
    bairro: '',
    cidade: '',
    uf: ''
})

const urlShopline = ref('')
const paypalTransparent = ref({
    mode: 'live',
    approvalUrl: '',
    firstName: '',
    lastName: '',
    taxId: '',
    email: '',
    phone: '',
    installmentTerm: '',
    blockinstallment: ''
})
const pix = ref({ qrCode: '' })
const payments = ref([
    { value: null, text: 'Selecione a Bandeira' },
    { value: 1, text: 'VISA', src: 'https://static.hardstore.com.br/images/logo_visa.gif' },
    { value: 2, text: 'MASTERCARD', src: 'https://static.hardstore.com.br/images/logo_mastercard.png' },
    { value: 3, text: 'HIPERCARD', src: 'https://static.hardstore.com.br/images/logo_hipercard.png' },
    { value: 4, text: 'ELO', src: 'https://static.hardstore.com.br/images/logo_elo.png' }
])
const selected = ref({ value: null, text: 'Selecione a Bandeira' })
const cepError = ref('')
const createError = ref('')
const email = ref('')
const selectedAddress = ref(Object.assign({ error: '' }, account.addresses.filter(x => x.cep == account.cep)[0] || account.addresses[0]))
const numeroRef = ref<HTMLElement | null>(null)

function checkTipoPessoa () {
    if (comboTipoPessoa.value.filter(x => x.selected)[0].value == '1') {
        documentMask.value = maskCPF
    } else {
        documentMask.value = maskCNPJ
    }
}

function changeUF () {
    user.value.uf = comboUF.value.filter(x => x.selected)[0].value
}

function setUF (uf) {
    comboUF.value.forEach((option) => { option.selected = false })
    const found = comboUF.value.filter(x => x.value === uf)[0]
    if (found) found.selected = true
    comboUF.value.sort()
}

function changeDocumentMask () {
    let changed = false
    if (user.value.document.length >= 14) {
        if (documentMask.value != maskCNPJ) { changed = true }
        documentMask.value = maskCNPJ
    } else {
        if (documentMask.value != maskCPF) { changed = true }
        documentMask.value = maskCPF
    }
    if (changed) { user.value.document = '07.350.337/0001-78' }
}

function selectPayment (option) {
    selected.value = option
}

function weight () {
    let w = 0
    for (let i = 0; i < cartStore.items.length; i++) {
        w += cartStore.items[i].product.weight * cartStore.items[i].quantity
    }
    return w
}

function stock () {
    for (let i = 0; i < cartStore.items.length; i++) {
        if (!cartStore.items[i].product.stock) { return false }
    }
    return true
}

function setAddress (address) {
    if (address) { selectedAddress.value = Object.assign({ error: '' }, address) }
    account.calculaFrete({
        cep: selectedAddress.value.cep,
        peso: weight(),
        valor: cartStore.subtotal,
        multiplo: cartStore.multiple,
        encomenda: stock(),
        object: 'checkout1'
    }).then((result) => {
        if (result.data.cep.message) {
            useNuxtApp().$notify?.({
                group: 'api',
                type: 'error text-error',
                text: result.data.cep.message,
                duration: 5000
            })
            selectedAddress.value.error = result.data.cep.message
        } else {
            selectedAddress.value.error = ''
            selectedAddress.value.estimativa = result.data.estimativa
            account.setCEP(result.data.cep.cep)
            switch (cartStore.shippingMethod * 1) {
            case 2:
                cartStore.setShipping({ shipping: result.data.pac.valor, shippingMethod: cartStore.shippingMethod })
                break
            case 3:
                cartStore.setShipping({ shipping: result.data.motoboy.valor, shippingMethod: cartStore.shippingMethod })
                break
            default:
                cartStore.setShipping({ shipping: result.data.sedex.valor, shippingMethod: cartStore.shippingMethod })
                break
            }
        }
    })
}

function calculaFrete () {
    let loja = true
    for (let i=0;cartStore.items.length;i++) {
        if (cartStore.items[i]?.local != 1) {
            loja = false
            break
        }
    }
    account.calculaFrete({
        cep: user.value.cep,
        peso: weight(),
        valor: cartStore.subtotal,
        encomenda: stock(),
        multiplo: cartStore.multiple,
        loja,
        object: 'checkout2'
    }).then((result) => {
        if (result.data.cep.message) {
            useNuxtApp().$notify?.({
                group: 'api',
                type: 'error text-error',
                text: result.data.cep.message,
                duration: 5000
            })
            cepError.value = result.data.cep.message
        } else {
            cepError.value = ''
            account.setCEP(result.data.cep.cep)
            user.value.cidade = result.data.cep.city
            setUF(result.data.cep.state)
            user.value.uf = result.data.cep.state
            user.value.bairro = result.data.cep.neighborhood
            user.value.logradouro = result.data.cep.street
            switch (cartStore.shippingMethod * 1) {
            case 2:
                cartStore.setShipping({ shipping: result.data.pac.valor, shippingMethod: cartStore.shippingMethod })
                break
            case 3:
                cartStore.setShipping({ shipping: result.data.motoboy.valor, shippingMethod: cartStore.shippingMethod })
                break
            default:
                cartStore.setShipping({ shipping: result.data.sedex.valor, shippingMethod: cartStore.shippingMethod })
                break
            }
        }
    })
}

function checkForm (event) {
    event.target.classList.add('was-validated')
    createOrder()
}

function createOrder () {
    const payload = {
        userOrder: user.value,
        selectedAddress: selectedAddress.value,
        selected: selected.value,
        currentPayment: currentPayment.value,
        installments: parcelas.value * 1,
        cart: cartStore,
        order: account.order
    }
    useModal().show('modalLoading')
    account.createOrder(payload).then((result) => {
        const order = account.order
        switch (order.forma_pagamento) {
        case 6: case 7: case 8: case 9: case 19: case 37: case 57: case 76: case 87: case 97: case 100: case 10: case 11: case 12: case 13:
        case 14: case 16: case 17: case 18: case 38: case 39: case 40: case 41: case 42: case 45: case 46: case 47: case 48: case 50: case 51:
        case 52: case 53: case 54: case 55: case 58: case 59: case 60: case 61: case 62: case 78: case 79: case 80: case 81: case 82: case 83:
        case 84: case 85: case 88: case 89: case 90: case 91: case 92: case 93: case 94: case 95: case 96: case 101: case 102: case 103: case 104:
        case 105: case 106: case 107: case 108:
            openMercadoPago();
            useModal().hide('modalLoading')
            break
        case 1:
        case 4:
        default:
            router.push('/shop/checkout/success')
            break
        }
    }).catch((result) => {
        useModal().hide('modalLoading')
        createError.value = result.message
        if (result.statusCode == 401) {
            email.value = result.message
            useModal().show('modalRecuperarSenha')
        }
        useNuxtApp().$notify?.({
            group: 'api',
            type: 'error text-error',
            text: result.message,
            duration: 5000
        })
    })
}

function recuperarSenha () {
    account.recoverPassword(email.value).then((result) => {
        useModal().hide('modalRecuperarSenha')
        useNuxtApp().$notify?.({
            type: 'sucess text-success',
            text: 'Recuperação de senha solicitada com sucesso!',
            duration: 5000
        })
    })
}

function openPaypal (data) {
    paypalTransparent.value = data
    console.log('paypalTransparent', paypalTransparent.value)
    useModal().show('modalPaymentPaypal')
}

function openPix () {
    useModal().show('modalPaymentPix')
}

function openMercadoPago () {
    useModal().show('modalMercadoPago')
}

function buscaCEP (noFocus?) {
    cepError.value = ''
    if (user.value.cep.toString().replace(/\D/g, '').length !== 8) {
        cepError.value = 'O CEP deve ter 8 digitos'
    } else {
        account.buscaCEP(user.value.cep).then((result) => {
            if (result.message) {
                cepError.value = result.message
            } else {
                if (!noFocus) { numeroRef.value?.focus() }
                setUF(result.state)
                user.value.uf = result.state
                user.value.cidade = result.city
                user.value.bairro = result.neighborhood
                user.value.logradouro = result.street
            }
        })
    }
}

onMounted(() => {
    if (!account.logged) {
        calculaFrete()
    } else {
        try {
            setAddress(account.addresses[0])
        } catch {
        }
    }
    const items: any[] = []
    const products: any[] = []
    cartStore.items.map(item => {
        items.push({
            item_name: item.product.name,
            item_id: item.product.id,
            price: item.price,
            quantity: item.quantity
        })
        products.push({
            name: item.product.name,
            id: item.product.id,
            price: item.price,
            quantity: item.quantity
        })
    })
    // @ts-ignore
    useNuxtApp().$gtm?.push({ ecommerce: null })
    // @ts-ignore
    useNuxtApp().$gtm?.push({
        event: 'checkout',
        ecommerce: {
            checkout: {
                products
            }
        }
    })
})

onBeforeMount(() => {
    if (account.cep == '') {
        router.push(url.cart())
    }
    if (cartStore.quantity < 1) {
        router.push(url.cart())
    }
    account.checkToken()
})
</script>
<style scoped>
h3 {
  margin: 40px 0 0;
}
ul {
  list-style-type: none;
  padding: 0;
}
li {
  display: absolute;
  margin: 0 10px;
  z-index: 10;
}
a {
  color: #42b983;
}
.back {
  background-image: linear-gradient(
      to bottom,
      rgba(255, 255, 0, 0.5),
      rgba(0, 0, 255, 0.5)
    ),
    url("https://mdn.mozillademos.org/files/7693/catfront.png");
}
</style>
