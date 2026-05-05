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
                                        <div v-if="selectedAddress.id" class="alert alert-success border-success mb-4">
                                            <div class="d-flex flex-column gap-3">
                                                <div>
                                                    <div class="fw-semibold mb-2">
                                                        Endereço de entrega selecionado
                                                    </div>
                                                    <div>
                                                        <strong>CEP:</strong> {{ selectedAddress.cep }}
                                                    </div>
                                                    <div>
                                                        {{ selectedAddress.logradouro }}, {{ selectedAddress.numero }}
                                                        <template v-if="selectedAddress.complemento">, {{ selectedAddress.complemento }}</template>
                                                    </div>
                                                    <div>
                                                        {{ selectedAddress.bairro }} - {{ selectedAddress.cidade }}/{{ selectedAddress.uf }}
                                                    </div>
                                                    <div v-if="selectedAddress.estimativa" class="small mt-2">
                                                        Você receberá na {{ selectedAddress.estimativa }}
                                                    </div>
                                                </div>
                                            </div>
                                        </div>
                                        <div class="fw-semibold text-muted small mb-2">
                                            Trocar endereço
                                        </div>
                                        <template v-for="(address, i) in account.addresses" :key="i">
                                            <div
                                                :class="[
                                                    'card address-card',
                                                    { 'border-success shadow-sm': selectedAddress.id === address.id }
                                                ]"
                                                @click="setAddress(address)"
                                            >
                                                <div class="address-card__body">
                                                    <div
                                                        v-if="selectedAddress.id === address.id"
                                                        class="address-card__badge text-bg-success"
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
                                                            @change="setAddress(address)"
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
                                        <div v-show="createError" class="alert alert-danger mb-3">{{ createError }}</div>
                                        <div class="form-group">
                                            <div class="form-floating">
                                                <input
                                                    id="checkout-nome"
                                                    ref="nomeRef"
                                                    v-model="user.nome"
                                                    type="text"
                                                    class="form-control"
                                                    placeholder="Nome"
                                                    autocomplete="name"
                                                    required
                                                    :class="{ 'is-invalid': fieldError == 'nome' && messageError }"
                                                >
                                                <label for="checkout-nome">Nome</label>
                                                <div class="invalid-feedback">Você deve informar seu Nome Completo</div>
                                            </div>
                                        </div>
                                        <div class="form-group">
                                            <div class="form-floating">
                                                <select id="checkout-tipo-pessoa" v-model="user.tipo_pessoa" class="form-select" @change="checkTipoPessoa">
                                                    <option value="1">Pessoa Física</option>
                                                    <option value="2">Pessoa Jurídica</option>
                                                </select>
                                                <label for="checkout-tipo-pessoa">Tipo Pessoa</label>
                                            </div>
                                        </div>
                                        <div class="form-group">
                                            <div class="form-floating">
                                                <input
                                                    id="checkout-document"
                                                    ref="documentRef"
                                                    v-model="user.document"
                                                    type="text"
                                                    inputmode="numeric"
                                                    class="form-control"
                                                    placeholder="CPF / CNPJ"
                                                    autocomplete="off"
                                                    required
                                                    :class="{ 'is-invalid': fieldError == 'document' && messageError }"
                                                    @input="onDocumentInput"
                                                    @blur="validateDocumentField(true)"
                                                >
                                                <label for="checkout-document">CPF / CNPJ</label>
                                                <div class="invalid-feedback">
                                                    {{ fieldError == 'document' && messageError ? messageError : 'Você deve informar seu CPF/CNPJ' }}
                                                </div>
                                            </div>
                                        </div>
                                        <div class="form-group">
                                            <div class="form-floating">
                                                <input
                                                    id="checkout-email"
                                                    ref="emailRef"
                                                    v-model="user.email"
                                                    type="email"
                                                    class="form-control"
                                                    placeholder="email@exemplo.com"
                                                    autocomplete="email"
                                                    required
                                                    :class="{ 'is-invalid': fieldError == 'email' && messageError }"
                                                    @input="onEmailInput"
                                                    @blur="validateEmailField(true)"
                                                >
                                                <label for="checkout-email">Email</label>
                                                <div class="invalid-feedback">
                                                    {{ fieldError == 'email' && messageError ? messageError : 'Informe um e-mail válido, como nome@exemplo.com' }}
                                                </div>
                                            </div>
                                        </div>
                                        <div class="form-group">
                                            <div class="form-floating">
                                                <input
                                                    id="checkout-celular"
                                                    ref="telefoneCelularRef"
                                                    v-model="user.telefone_celular"
                                                    type="text"
                                                    inputmode="tel"
                                                    class="form-control"
                                                    placeholder="Telefone Celular"
                                                    autocomplete="tel"
                                                    required
                                                    :class="{ 'is-invalid': fieldError == 'telefone_celular' && messageError }"
                                                    @input="onCellPhoneInput"
                                                    @blur="validateCellPhoneField(true)"
                                                >
                                                <label for="checkout-celular">Telefone Celular</label>
                                                <div class="invalid-feedback">
                                                    {{ fieldError == 'telefone_celular' && messageError ? messageError : 'Informe seu telefone celular com DDD' }}
                                                </div>
                                            </div>
                                        </div>
                                        <div class="form-group">
                                            <div class="form-floating">
                                                <input
                                                    id="checkout-residencial"
                                                    v-model="user.telefone_residencial"
                                                    type="text"
                                                    inputmode="tel"
                                                    class="form-control"
                                                    placeholder="Telefone Residencial"
                                                    autocomplete="tel"
                                                    @input="formatPhone('telefone_residencial')"
                                                >
                                                <label for="checkout-residencial">Telefone Residencial</label>
                                            </div>
                                        </div>
                                        <div class="form-group">
                                            <div class="form-floating">
                                                <input
                                                    id="checkout-comercial"
                                                    v-model="user.telefone_comercial"
                                                    type="text"
                                                    inputmode="tel"
                                                    class="form-control"
                                                    placeholder="Telefone Comercial"
                                                    autocomplete="tel"
                                                    @input="formatPhone('telefone_comercial')"
                                                >
                                                <label for="checkout-comercial">Telefone Comercial</label>
                                            </div>
                                        </div>
                                        <div class="form-group">
                                            <div class="form-floating">
                                                <input
                                                    id="checkout-cep"
                                                    v-model="user.cep"
                                                    type="text"
                                                    inputmode="numeric"
                                                    maxlength="9"
                                                    class="form-control"
                                                    placeholder="CEP"
                                                    autocomplete="postal-code"
                                                    required
                                                    :class="{ 'is-invalid': cepError }"
                                                    @input="formatCep"
                                                    @blur="buscaCEP()"
                                                >
                                                <label for="checkout-cep">CEP</label>
                                                <div class="invalid-feedback">{{ cepError || 'Você deve informar seu CEP' }}</div>
                                            </div>
                                        </div>
                                        <div class="form-group">
                                            <div class="form-floating">
                                                <input
                                                    id="checkout-logradouro"
                                                    ref="logradouroRef"
                                                    v-model="user.logradouro"
                                                    type="text"
                                                    class="form-control"
                                                    placeholder="Logradouro"
                                                    autocomplete="address-line1"
                                                    required
                                                    :class="{ 'is-invalid': fieldError == 'logradouro' && messageError }"
                                                >
                                                <label for="checkout-logradouro">Logradouro</label>
                                                <div class="invalid-feedback">Você deve informar seu Endereço</div>
                                            </div>
                                        </div>
                                        <div class="form-group">
                                            <div class="form-floating">
                                                <input
                                                    id="checkout-numero"
                                                    ref="numeroRef"
                                                    v-model="user.numero"
                                                    type="text"
                                                    class="form-control"
                                                    placeholder="Número"
                                                    autocomplete="address-line2"
                                                    required
                                                    :class="{ 'is-invalid': fieldError == 'numero' && messageError }"
                                                >
                                                <label for="checkout-numero">Número</label>
                                                <div class="invalid-feedback">Você deve informar o Número</div>
                                            </div>
                                        </div>
                                        <div class="form-group">
                                            <div class="form-floating">
                                                <input
                                                    id="checkout-complemento"
                                                    v-model="user.complemento"
                                                    type="text"
                                                    class="form-control"
                                                    placeholder="Complemento"
                                                    autocomplete="address-line3"
                                                >
                                                <label for="checkout-complemento">Complemento</label>
                                            </div>
                                        </div>
                                        <div class="form-group">
                                            <div class="form-floating">
                                                <input
                                                    id="checkout-bairro"
                                                    ref="bairroRef"
                                                    v-model="user.bairro"
                                                    type="text"
                                                    class="form-control"
                                                    placeholder="Bairro"
                                                    autocomplete="address-level3"
                                                    required
                                                    :class="{ 'is-invalid': fieldError == 'bairro' && messageError }"
                                                >
                                                <label for="checkout-bairro">Bairro</label>
                                                <div class="invalid-feedback">Você deve informar seu Bairro</div>
                                            </div>
                                        </div>
                                        <div class="form-group">
                                            <div class="form-floating">
                                                <input
                                                    id="checkout-cidade"
                                                    ref="cidadeRef"
                                                    v-model="user.cidade"
                                                    type="text"
                                                    class="form-control"
                                                    placeholder="Cidade"
                                                    autocomplete="address-level2"
                                                    required
                                                    :class="{ 'is-invalid': fieldError == 'cidade' && messageError }"
                                                >
                                                <label for="checkout-cidade">Cidade</label>
                                                <div class="invalid-feedback">Você deve informar sua Cidade</div>
                                            </div>
                                        </div>
                                        <div class="form-group">
                                            <div class="form-floating">
                                                <select
                                                    id="checkout-uf"
                                                    v-model="user.uf"
                                                    class="form-select"
                                                    autocomplete="address-level1"
                                                    required
                                                    :class="{ 'is-invalid': fieldError == 'uf' && messageError }"
                                                >
                                                    <option value="" disabled>Informe o Estado</option>
                                                    <option v-for="uf in ufs" :key="uf" :value="uf">{{ uf }}</option>
                                                </select>
                                                <label for="checkout-uf">UF</label>
                                                <div class="invalid-feedback">Você deve informar seu Estado</div>
                                            </div>
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
                                                <li v-if="false && !cartStore.checkForVGA?.hasOnlyVGA" class="payment-methods__item" :class="{ 'payment-methods__item--active': currentPayment === 1 }">
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
                                                <li v-if="false" class="payment-methods__item" :class="{ 'payment-methods__item--active': currentPayment === 2 }">
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
            <Paypal :data="paypalTransparent" />
            <Pix :data="pixPayment" />
            <Mercadopago v-model="parcelas"
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
import Check9x7Svg from '~/svg/check-9x7.svg'

const cartStore = useCartStore()
const account = useAccountStore()
const url = useUrl()
const router = useRouter()
const { price } = usePrice()

useHead({ title: 'Fechar Compra' })

const cart = cartStore

const currentPayment = ref(4)

const parcelas = ref(1)
const ufs = ['AC','AL','AM','AP','BA','CE','DF','ES','GO','MA','MG','MS','MT','PA','PB','PE','PI','PR','RJ','RN','RO','RR','RS','SC','SE','SP','TO']
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

const fieldError = ref('')
const messageError = ref('')
const createError = ref('')

const nomeRef = ref<HTMLInputElement | null>(null)
const documentRef = ref<HTMLInputElement | null>(null)
const emailRef = ref<HTMLInputElement | null>(null)
const telefoneCelularRef = ref<HTMLInputElement | null>(null)
const logradouroRef = ref<HTMLInputElement | null>(null)
const bairroRef = ref<HTMLInputElement | null>(null)
const cidadeRef = ref<HTMLInputElement | null>(null)

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
const pixPayment = ref({ qrCode: '' })
const payments = ref([
    { value: null, text: 'Selecione a Bandeira' },
    { value: 1, text: 'VISA', src: 'https://static.hardstore.com.br/images/logo_visa.gif' },
    { value: 2, text: 'MASTERCARD', src: 'https://static.hardstore.com.br/images/logo_mastercard.png' },
    { value: 3, text: 'HIPERCARD', src: 'https://static.hardstore.com.br/images/logo_hipercard.png' },
    { value: 4, text: 'ELO', src: 'https://static.hardstore.com.br/images/logo_elo.png' }
])
const selected = ref({ value: null, text: 'Selecione a Bandeira' })
const cepError = ref('')
const email = ref('')
const selectedAddress = ref(Object.assign({ error: '' }, getInitialAddress()))
const numeroRef = ref<HTMLInputElement | null>(null)

function isDefaultAddress (address: any) {
    return account.isDefaultAddress(address)
}

function getInitialAddress () {
    const selectedStoreAddress = account.selectedAddress?.id
        ? account.addresses.find((address: any) => String(address.id) === String(account.selectedAddress.id))
        : null
    const accountCep = normalizeCep(account.cep)
    const defaultAddress = account.getDefaultAddress()

    return selectedStoreAddress ||
        defaultAddress ||
        account.addresses.find((address: any) => normalizeCep(address.cep) === accountCep) ||
        account.addresses[0]
}

function normalizeCep (value: string | number) {
    return String(value || '').replace(/\D/g, '')
}

function checkTipoPessoa (event?: Event) {
    const selectedType = (event?.target as HTMLSelectElement | null)?.value
    if (selectedType === '1' || selectedType === '2') user.value.tipo_pessoa = selectedType
    clearDocumentValidation()
    formatDocument()
    if (user.value.document) validateDocumentField(false)
}

function setUF (uf: string) {
    user.value.uf = uf
}

function onDocumentInput () {
    formatDocument()
    if (fieldError.value === 'document') validateDocumentField(false)
}

function onEmailInput () {
    if (fieldError.value === 'email') validateEmailField(false)
}

function onCellPhoneInput () {
    formatPhone('telefone_celular')
    if (fieldError.value === 'telefone_celular') validateCellPhoneField(false)
}

function validateDocumentField (showError = false) {
    const message = getDocumentError()
    documentRef.value?.setCustomValidity(message)
    if (message) {
        if (showError || fieldError.value === 'document') {
            fieldError.value = 'document'
            messageError.value = message
            createError.value = message
        }
        return false
    }
    if (fieldError.value === 'document') {
        fieldError.value = ''
        messageError.value = ''
        createError.value = ''
    }
    return true
}

function getDocumentError () {
    const document = user.value.document.replace(/\D/g, '')
    const isCnpj = user.value.tipo_pessoa === '2' || document.length > 11
    if (!document) return 'Você deve informar seu CPF/CNPJ.'
    if (isCnpj) {
        if (document.length !== 14) return 'CNPJ inválido, verifique e tente novamente.'
        if (!isValidCnpj(document)) return 'CNPJ inválido, verifique e tente novamente.'
        return ''
    }
    if (document.length !== 11) return 'CPF inválido, verifique e tente novamente.'
    if (!isValidCpf(document)) return 'CPF inválido, verifique e tente novamente.'
    return ''
}

function clearDocumentValidation () {
    documentRef.value?.setCustomValidity('')
    if (fieldError.value === 'document') {
        fieldError.value = ''
        messageError.value = ''
        createError.value = ''
    }
}

function validateEmailField (showError = false) {
    const message = getEmailError()
    emailRef.value?.setCustomValidity(message)
    if (message) {
        if (showError || fieldError.value === 'email') {
            fieldError.value = 'email'
            messageError.value = message
            createError.value = message
        }
        return false
    }
    if (fieldError.value === 'email') {
        fieldError.value = ''
        messageError.value = ''
        createError.value = ''
    }
    return true
}

function getEmailError () {
    const email = user.value.email.trim()
    if (!email) return 'Você deve informar seu e-mail.'
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/.test(email)) return 'Informe um e-mail válido, como nome@exemplo.com.'
    return ''
}

function validateCellPhoneField (showError = false) {
    const message = getCellPhoneError()
    telefoneCelularRef.value?.setCustomValidity(message)
    if (message) {
        if (showError || fieldError.value === 'telefone_celular') {
            fieldError.value = 'telefone_celular'
            messageError.value = message
            createError.value = message
        }
        return false
    }
    if (fieldError.value === 'telefone_celular') {
        fieldError.value = ''
        messageError.value = ''
        createError.value = ''
    }
    return true
}

function getCellPhoneError () {
    const phone = user.value.telefone_celular.replace(/\D/g, '')
    if (!phone) return 'Você deve informar seu telefone celular.'
    if (phone.length !== 11) return 'Informe seu telefone celular com DDD.'
    if (phone[2] !== '9') return 'Informe um telefone celular válido com DDD.'
    return ''
}

function setFieldError (field: string, message: string) {
    fieldError.value = field
    messageError.value = message
    createError.value = message
    focusField(field)
    return false
}

function focusField (field: string) {
    const refs: Record<string, any> = {
        nome: nomeRef, document: documentRef, email: emailRef,
        telefone_celular: telefoneCelularRef, logradouro: logradouroRef,
        numero: numeroRef, bairro: bairroRef, cidade: cidadeRef
    }
    refs[field]?.value?.focus?.()
}

function validateCheckoutForm () {
    if (!validateDocumentField(true)) return false
    if (!validateEmailField(true)) return false
    if (!validateCellPhoneField(true)) return false
    const cep = user.value.cep.replace(/\D/g, '')
    if (!/\S+\s+\S+/.test(user.value.nome.trim()))
        return setFieldError('nome', 'Você deve informar seu Nome e Sobrenome.')
    if (cep.length !== 8) {
        cepError.value = 'O CEP deve ter 8 dígitos'
        createError.value = cepError.value
        return false
    }
    if (!user.value.logradouro.trim()) return setFieldError('logradouro', 'Você deve informar seu Logradouro.')
    if (!user.value.numero.trim()) return setFieldError('numero', 'Você deve informar seu Número.')
    if (!user.value.bairro.trim()) return setFieldError('bairro', 'Você deve informar seu Bairro.')
    if (!user.value.cidade.trim()) return setFieldError('cidade', 'Você deve informar sua Cidade.')
    if (!/^[A-Z]{2}$/.test(user.value.uf)) return setFieldError('uf', 'Você deve informar seu Estado.')
    user.value.email = user.value.email.trim()
    user.value.document = user.value.document.replace(/\D/g, '')
    user.value.cep = cep.length === 8 ? `${cep.slice(0, 5)}-${cep.slice(5)}` : user.value.cep
    return true
}

function formatCep () {
    const digits = user.value.cep.replace(/\D/g, '').slice(0, 8)
    user.value.cep = digits.length > 5 ? `${digits.slice(0, 5)}-${digits.slice(5)}` : digits
}

function formatDocument () {
    const isCnpj = user.value.tipo_pessoa === '2'
    const maxLength = isCnpj ? 14 : 11
    const digits = user.value.document.replace(/\D/g, '').slice(0, maxLength)
    user.value.document = isCnpj ? formatCnpj(digits) : formatCpf(digits)
}

function formatCpf (digits: string) {
    if (digits.length > 9) return `${digits.slice(0, 3)}.${digits.slice(3, 6)}.${digits.slice(6, 9)}-${digits.slice(9)}`
    if (digits.length > 6) return `${digits.slice(0, 3)}.${digits.slice(3, 6)}.${digits.slice(6)}`
    if (digits.length > 3) return `${digits.slice(0, 3)}.${digits.slice(3)}`
    return digits
}

function formatCnpj (digits: string) {
    if (digits.length > 12) return `${digits.slice(0, 2)}.${digits.slice(2, 5)}.${digits.slice(5, 8)}/${digits.slice(8, 12)}-${digits.slice(12)}`
    if (digits.length > 8) return `${digits.slice(0, 2)}.${digits.slice(2, 5)}.${digits.slice(5, 8)}/${digits.slice(8)}`
    if (digits.length > 5) return `${digits.slice(0, 2)}.${digits.slice(2, 5)}.${digits.slice(5)}`
    if (digits.length > 2) return `${digits.slice(0, 2)}.${digits.slice(2)}`
    return digits
}

function formatPhone (field: 'telefone_celular' | 'telefone_residencial' | 'telefone_comercial') {
    const digits = user.value[field].replace(/\D/g, '').slice(0, 11)
    if (digits.length > 10) user.value[field] = `(${digits.slice(0, 2)}) ${digits.slice(2, 7)}-${digits.slice(7)}`
    else if (digits.length > 6) user.value[field] = `(${digits.slice(0, 2)}) ${digits.slice(2, 6)}-${digits.slice(6)}`
    else if (digits.length > 2) user.value[field] = `(${digits.slice(0, 2)}) ${digits.slice(2)}`
    else user.value[field] = digits
}

function isValidCpf (cpf: string) {
    if (!/^\d{11}$/.test(cpf) || /^(\d)\1+$/.test(cpf)) return false
    for (let t = 9; t < 11; t++) {
        let sum = 0
        for (let c = 0; c < t; c++) sum += Number(cpf[c]) * ((t + 1) - c)
        if (Number(cpf[t]) !== ((10 * sum) % 11) % 10) return false
    }
    return true
}

function isValidCnpj (cnpj: string) {
    if (!/^\d{14}$/.test(cnpj) || /^(\d)\1+$/.test(cnpj)) return false
    const calcDigit = (base: string, weights: number[]) => {
        const rest = weights.reduce((t, w, i) => t + Number(base[i]) * w, 0) % 11
        return rest < 2 ? 0 : 11 - rest
    }
    return Number(cnpj[12]) === calcDigit(cnpj.slice(0, 12), [5,4,3,2,9,8,7,6,5,4,3,2])
        && Number(cnpj[13]) === calcDigit(cnpj.slice(0, 13), [6,5,4,3,2,9,8,7,6,5,4,3,2])
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
    if (address) {
        account.selectAddress(address.id)
        selectedAddress.value = Object.assign({ error: '' }, address)
    }
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
    for (let i=0;i<cartStore.items.length;i++) {
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
    if (!account.logged && !validateCheckoutForm()) return
    createOrder()
}

function createOrder () {
    const payload = {
        userOrder: user.value,
        selectedAddress: selectedAddress.value,
        selected: selected.value,
        currentPayment: currentPayment.value,
        installments: parcelas.value * 1,
        cart: JSON.parse(JSON.stringify(cartStore.$state)),
        order: { id: account.order?.id || null }
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
            useModal().hide('modalLoading')
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

function buscaCEP (noFocus?: boolean) {
    cepError.value = ''
    const cep = user.value.cep.replace(/\D/g, '')
    if (cep.length !== 8) {
        cepError.value = 'O CEP deve ter 8 dígitos'
    } else if (cep !== account.cep.replace(/\D/g, '')) {
        calculaFrete()
        if (!noFocus) nextTick(() => numeroRef.value?.focus())
    } else {
        account.buscaCEP(cep).then((result) => {
            if (result.message) {
                cepError.value = result.message
            } else {
                if (!noFocus) numeroRef.value?.focus()
                setUF(result.state)
                user.value.cidade = result.city
                user.value.bairro = result.neighborhood
                user.value.logradouro = result.street
            }
        }).catch(() => {
            cepError.value = 'Não foi possível consultar o CEP agora.'
        })
    }
}

onMounted(async () => {
    if (!account.logged) {
        calculaFrete()
    } else {
        try {
            if (!account.addresses.length) await account.getAddresses()
            setAddress(getInitialAddress())
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
