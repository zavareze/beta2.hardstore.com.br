<template>
    <div>
        <client-only>
            <PageHeader
                title="Carrinho"
                :breadcrumb="[
                    { title: 'Home', url: '' },
                    { title: 'Carrinho', url: '' },
                ]"
            />

            <div v-if="!cart.quantity" class="block block-empty">
                <div class="container">
                    <div class="block-empty__body">
                        <div class="block-empty__message">
                            Seu carrinho está vazio!
                        </div>
                        <div class="block-empty__actions">
                            <AppLink to="/" class="btn btn-primary btn-sm">
                                Comece a comprar agora!
                            </AppLink>
                        </div>
                    </div>
                </div>
            </div>

            <div v-if="cart.quantity" class="cart block">
                <div class="container">
                    <table class="cart__table cart-table">
                        <thead class="cart-table__head">
                            <tr class="cart-table__row">
                                <th class="cart-table__column cart-table__column--image">
                                    Imagem
                                </th>
                                <th class="cart-table__column cart-table__column--product">
                                    Produto
                                </th>
                                <th class="cart-table__column cart-table__column--price">
                                    Preço
                                </th>
                                <th class="cart-table__column cart-table__column--quantity">
                                    Quantidade
                                </th>
                                <th class="cart-table__column cart-table__column--total">
                                    Total
                                </th>
                                <th class="cart-table__column cart-table__column--remove" aria-label="Remove" />
                            </tr>
                        </thead>
                        <tbody class="cart-table__body">
                            <tr v-for="item in cart.items" :key="item.id" class="cart-table__row">
                                <td class="cart-table__column cart-table__column--image">
                                    <div class="product-image">
                                        <AppLink :to="url.product(item.product)" class="product-image__body">
                                            <!--suppress HtmlUnknownTarget -->
                                            <img class="product-image__img" :src="'https://cdn-hardstore.s3-sa-east-1.amazonaws.com/' + item.product.id + '/1280x960/1.webp'" alt="">
                                        </AppLink>
                                    </div>
                                </td>
                                <td class="cart-table__column cart-table__column--product">
                                    <AppLink :to="url.product(item.product)" class="cart-table__product-name">
                                        {{ item.product.name }}
                                    </AppLink>
                                    <ul v-if="item.options.length > 0" class="cart-table__options">
                                        <li v-for="(option, index) in item.options" :key="index">
                                            {{ option.optionTitle }}: {{ option.valueTitle }}
                                        </li>
                                    </ul>
                                </td>
                                <td class="cart-table__column cart-table__column--price" data-title="Valor">
                                    {{ price(item.price) }}
                                </td>
                                <td class="cart-table__column cart-table__column--quantity" data-title="Quantidade">
                                    <InputNumber
                                        :value="getItemQuantity(item)"
                                        :min="1"
                                        :max="item.max"
                                        @input="handleChangeQuantity(item, $event); updateQuantities();"
                                        :error="item.error"
                                    />
                                </td>
                                <td class="cart-table__column cart-table__column--total" data-title="Total">
                                    {{ price(item.total) }}
                                </td>
                                <td class="cart-table__column cart-table__column--remove">
                                    <AsyncAction
                                        v-slot:default="{ run, isLoading }"
                                        :action="() => remover(item)"
                                    >
                                        <button
                                            type="button"
                                            :class="[
                                                'btn btn-light btn-sm btn-svg-icon',
                                                {'btn-loading': isLoading}
                                            ]"
                                            @click="run"
                                        >
                                            <Cross12Svg />
                                        </button>
                                    </AsyncAction>
                                </td>
                            </tr>
                        </tbody>
                    </table>
                    <div class="cart__actions">
                        <form class="cart__coupon-form">
                            <label for="input-coupon-code" class="sr-only">Cupom</label>
                            <input
                                id="input-coupon-code"
                                class="form-control"
                                type="text"
                                placeholder="Código Promocional"
                            >
                            <button type="submit" class="btn btn-primary">
                                Aplicar Promoção
                            </button>
                        </form>
                        <div class="cart__buttons">
                            <AppLink href="/" class="btn btn-light">
                                Continuar Comprando
                            </AppLink>
                            <AsyncAction
                                v-slot:default="{ run, isLoading }"
                                :action="() => updateQuantities()"
                            >
                                <button
                                    type="button"
                                    :class="[
                                        'btn btn-primary cart__update-button',
                                        {'btn-loading': isLoading}
                                    ]"
                                    :disabled="!cartNeedUpdate()"
                                    @click="run"
                                >
                                    Atualizar Carrinho
                                </button>
                            </AsyncAction>
                        </div>
                    </div>

                    <div class="row justify-content-end pt-md-5 pt-4">
                        <div class="col-12 col-md-7 col-lg-6 col-xl-7 pb-4">
                            <div class="card">
                                <div class="card-body">
                                    <h3 class="card-title">
                                        Frete e Prazo
                                    </h3>
                                    <div class="pt-4 pb-4">
                                        <table class="table">
                                            <tbody><tr>
                                                <td></td>
                                                <td>Forma de Envio</td>
                                                <td>Valor</td>
                                                <td>Estimativa</td>
                                            </tr>
                                            <tr v-if="account.calculoFrete.fretes.sedex && account.calculoFrete.fretes.sedex.valor"
                                            style="cursor: pointer"
                                            :style="{ backgroundColor: (shipping*1 === 1) ? '#f7f7f7' : '' }" @click="setShipping(1)">
                                                <td><span class="input-radio__body">
                                                        <input
                                                            type="radio"
                                                            class="input-radio__input"
                                                            name="checkout_payment_method"
                                                            :value="1"
                                                            :checked="shipping*1 === 1"
                                                            @click="setShipping(1)"
                                                        >
                                                        <span class="input-radio__circle" />
                                                    </span>
                                                </td>
                                                <td>Sedex <span v-if="account.calculoFrete.fretes.pac.gratis" class="badge text-bg-success">50% OFF</span></td>
                                                <td>{{ price(account.calculoFrete.fretes.sedex.valor) }}</td>
                                                <td>{{ account.calculoFrete.estimativa }}</td>
                                            </tr>
                                            <tr v-if="account.calculoFrete.fretes.pac"
                                            style="cursor: pointer"
                                            :style="{ backgroundColor: (shipping*1 === 2) ? '#f7f7f7' : '' }" @click="setShipping(2)">
                                                <td>
                                                    <span class="input-radio__body">
                                                        <input
                                                            type="radio"
                                                            class="input-radio__input"
                                                            name="checkout_payment_method"
                                                            :value="2"
                                                            :checked="shipping*1 === 2"
                                                            @click="setShipping(2)"
                                                        >
                                                        <span class="input-radio__circle" />
                                                    </span>
                                                </td>
                                                <td>PAC <span v-if="account.calculoFrete.fretes.pac.gratis" class="badge text-bg-success">Grátis</span></td>
                                                <td>{{ price(account.calculoFrete.fretes.pac.valor) }}</td>
                                                <td>{{ account.calculoFrete.estimativa_2 }}</td>
                                            </tr>
                                            <tr v-if="account.calculoFrete.fretes.motoboy"
                                            style="cursor: pointer"
                                            :style="{ backgroundColor: (shipping*1 === 3) ? '#f7f7f7' : '' }" @click="setShipping(3)">
                                                <td>
                                                    <span class="input-radio__body">
                                                        <input
                                                            type="radio"
                                                            class="input-radio__input"
                                                            name="checkout_payment_method"
                                                            :value="3"
                                                            :checked="shipping*1 === 3"
                                                            @click="setShipping(3)"
                                                        >
                                                        <span class="input-radio__circle" />
                                                    </span>
                                                </td>
                                                <td>Motoboy <span v-if="account.calculoFrete.fretes.motoboy.gratis" class="badge text-bg-success">Grátis</span></td>
                                                <td>{{ price(account.calculoFrete.fretes.motoboy.valor) }}</td>
                                                <td>{{ account.calculoFrete.estimativa_3 }}</td>
                                            </tr></tbody>
                                        </table>
                                    </div>
                                </div>
                            </div>
                        </div>

                        <div class="col-12 col-md-7 col-lg-6 col-xl-5">
                            <div class="card">
                                <div class="card-body">
                                    <h3 class="card-title">
                                        Totais
                                    </h3>
                                    <table class="cart__totals">
                                        <thead class="cart__totals-header">
                                                <tr>
                                                    <th>Subtotal</th>
                                                    <td>{{ price(cart.subtotal) }}</td>
                                                </tr>
                                            </thead>
                                            <tbody class="cart__totals-body">
                                                <tr>
                                                    <th>Frete</th>
                                                    <td>
                                                        {{ price(cartStore.shipping) }}
                                                        <div class="cart__calc-shipping">
                                                            <div @click="useModal().show('modalShippingCart')" style="cursor: pointer">
                                                                Calcular Entrega
                                                            </div>
                                                        </div>
                                                    </td>
                                                </tr>
                                            </tbody>
                                        <tfoot class="cart__totals-footer">
                                            <tr>
                                                <th>Total</th>
                                                <td>
                                                    <span style="font-weight: 500; font-size: larger;">{{ price(cart.total) }}</span><br />
                                                    <span style="font-size: small;">no boleto à vista</span>
                                                </td>
                                            </tr>
                                            <tr>
                                                <th></th>
                                                <td>
                                                    <span style="font-size: medium;">ou {{ price(cart.total/.85) }}</span><br />
                                                    <span style="font-size: small;">em 12X de {{ price(cart.total/.85/12) }} sem juros</span>
                                                </td>
                                            </tr>
                                        </tfoot>
                                    </table>
                                    <AppLink :to="url.checkout()" class="btn btn-primary btn-xl btn-block cart__checkout-button" @click="console.log(cartStore.shippingMethod)">
                                        Proceder para Pagamento
                                    </AppLink>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
            <modal-shipping
                :weight="cartStore.weight"
                :price="cart.subtotal"
                :stock="stock()"
                :local="1"
                :multiple="cartStore.multiple"
                @finish="setCEP($event)"
            />
        </client-only>
    </div>
</template>

<script setup lang="ts">
import { useCartStore } from '~/stores/cart'
import { useAccountStore } from '~/stores/account'

const cartStore = useCartStore()
const account = useAccountStore()
const url = useUrl()
const { price } = usePrice()

useHead({ title: 'Carrinho' })

const cart = computed(() => cartStore)

export interface Quantity {
    itemId: number;
    value: string | number;
}

const quantities = ref<Quantity[]>([])
const shipping = ref(cartStore.shippingMethod || 1)
const cep = ref({ sedex: { valor: 0 }, pac: { valor: 0 }, motoboy: { valor: 0 } })

onMounted(() => {
    if (account.cep === '')
        setTimeout(() => {
            useModal().show('modalShippingCart')
        }, 1000)
    else {
        nextTick(() => setTimeout(() => {
            calculaFrete()
        }, 100))
    }
})

function setCEP (evt) {
    cep.value = evt
}

function calculaFrete () {
    const cepVal = account.cep
    if ((cepVal) && (cepVal.toString().replace(/\D/g,'').length === 8)) {
        let loja = true
        cartStore.items.forEach(itm => {
            if (itm.local != 1) {
                loja = false
            }
        })
        account.calculaFrete({
            cep: cepVal,
            peso: cartStore.weight,
            valor: cartStore.subtotal,
            encomenda: stock(),
            multiplo: filiais() >= 3,
            cart: true,
            loja,
            object: 'cart'
        }).then((result) => {
            if (!result.data.cep?.message) {
                account.setCEP(result.data.cep.cep)
            }
            setShipping(false)
        })
    }
}

function setShipping (ship) {
    if (ship)
        shipping.value = ship
    if (shipping.value)
        switch (shipping.value * 1) {
            case 2:
                cartStore.setShipping({ shipping: account.calculoFrete.fretes.pac.valor, shippingMethod: shipping.value })
                break
            case 3:
                cartStore.setShipping({ shipping: account.calculoFrete.fretes.motoboy.valor, shippingMethod: shipping.value })
                break
            default:
                cartStore.setShipping({ shipping: account.calculoFrete.fretes.sedex.valor, shippingMethod: shipping.value })
                break
        }
}

function filiais () {
    const fil: any[] = []
    for (let i=0;i<cartStore.items.length;i++) {
        fil[cartStore.items[i].local] = 1
    }
    console.log('filiais', fil);
    return fil.length
}

function weight () {
    let w = 0
    for (let i=0;i<cartStore.items.length;i++) {
        w += cartStore.items[i].product.weight*cartStore.items[i].quantity
    }
    return w
}

function stock () {
    for (let i=0;i<cartStore.items.length;i++) {
        if (!cartStore.items[i].product.stock)
            return false
    }
    return true
}

function handleChangeQuantity (item: any, quantity: number) {
    const itemQuantity = quantities.value.find(x => x.itemId === item.id)
    if (itemQuantity) {
        itemQuantity.value = quantity
    } else {
        quantities.value.push({
            itemId: item.id,
            value: quantity
        })
    }
}

function getItemQuantity (item: any) {
    return item.quantity
}

async function remover (item) {
    await cartStore.remove({ itemId: item.id })
    calculaFrete()
}

async function updateQuantities () {
    await cartStore.updateQuantities(quantities.value.map(x => ({
        ...x,
        value: typeof x.value === 'string' ? parseFloat(x.value) : x.value
    })))
    calculaFrete()
}

function cartNeedUpdate () {
    return quantities.value.filter((x) => {
        const item = cartStore.items.find(item => item.id === x.itemId)
        return item && item.quantity !== x.value && x.value !== ''
    }).length > 0
}
</script>
