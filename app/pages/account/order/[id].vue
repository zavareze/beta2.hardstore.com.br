<template>
    <div class="block order-success">
        <div class="container">
            <div class="order-success__body">
                <div class="order-success__header pb-3">
                    <div class="order-success__actions">
                        <AppLink to="/" class="btn btn-xs btn-secondary">
                            Ir para página inicial
                        </AppLink>
                    </div>
                    <Payment v-show="order.status_pedido === 1 && (order.forma_pagamento === 4 || order.forma_pagamento === 1)" :order="order" />
                </div>
                <div class="order-success__meta">
                    <ul class="order-success__meta-list">
                        <li class="order-success__meta-item">
                            <span class="order-success__meta-title">Pedido:</span>
                            <span class="order-success__meta-value">#{{ order.id }}</span>
                        </li>
                        <li class="order-success__meta-item">
                            <span class="order-success__meta-title">Data Pedido:</span>
                            <span class="order-success__meta-value">{{ order.date }}</span>
                        </li>
                        <li class="order-success__meta-item">
                            <span class="order-success__meta-title">Total:</span>
                            <span class="order-success__meta-value">{{ price(order.valor_total) }}</span>
                        </li>
                        <li class="order-success__meta-item">
                            <span class="order-success__meta-title">Forma de Pagamento:</span>
                            <span class="order-success__meta-value">{{ order.nforma_pagamento }}</span>
                        </li>
                    </ul>
                </div>

                <div class="card">
                    <div class="order-list">
                        <table>
                            <thead class="order-list__header">
                                <tr>
                                    <th class="order-list__column-label" :colspan="2">
                                        Produto
                                    </th>
                                    <th class="order-list__column-quantity">
                                        Quantidade
                                    </th>
                                    <th class="order-list__column-total">
                                        Total
                                    </th>
                                </tr>
                            </thead>
                            <tbody class="order-list__products">
                                <tr v-for="item in order.products" :key="item.id">
                                    <td class="order-list__column-image">
                                        <div class="product-image">
                                            <AppLink :to="url.product(item)" class="product-image__body">
                                                <img class="product-image__img" :src="'https://cdn-hardstore.s3-sa-east-1.amazonaws.com/' + item.id + '/1280x960/1.webp'" alt="">
                                            </AppLink>
                                        </div>
                                    </td>
                                    <td class="order-list__column-product">
                                        <AppLink :to="url.product(item)" class="order-list__product-name">
                                            {{ item.name }}
                                        </AppLink>
                                        <div class="order-list__product-meta">
                                            <span>Cód: {{ item.id }}</span>
                                            <span v-if="item.pn">P/N: {{ item.pn }}</span>
                                        </div>
                                    </td>
                                    <td class="order-list__column-quantity" data-title="Quantidade:">
                                        {{ item.quantity }}
                                    </td>
                                    <td class="order-list__column-total">
                                        {{ price(item.price*item.quantity) }}
                                    </td>
                                </tr>
                            </tbody>
                            <tbody class="order-list__subtotals">
                                <tr>
                                    <th class="order-list__column-label" colspan="2">
                                        Subtotal
                                    </th>
                                    <td class="order-list__column-total" colspan="2">
                                        {{ price(order.valor_subtotal) }}
                                    </td>
                                </tr>
                                <tr>
                                    <th class="order-list__column-label" colspan="2">
                                        Frete
                                    </th>
                                    <td class="order-list__column-total" colspan="2">
                                        {{ price(order.valor_frete) }}
                                    </td>
                                </tr>
                            </tbody>
                            <tfoot class="order-list__footer">
                                <tr>
                                    <th class="order-list__column-label" colspan="2">
                                        Total
                                    </th>
                                    <td class="order-list__column-total" colspan="2">
                                        {{ price(order.valor_total) }}
                                    </td>
                                </tr>
                            </tfoot>
                        </table>
                    </div>
                </div>
                <OrderStatus v-if="order.shipping_status" :order="order.shipping_status" />
                <div class="row mt-3 no-gutters mx-n2">
                    <div class="col-sm-12 col-12 px-2">
                        <AddressCard
                            :address="order"
                            badge="Endereço de Entrega"
                            :badge-muted="true"
                        />
                    </div>
                </div>
                <Tracking :rastreios="order.rastreios" />
            </div>
        </div>
    </div>
</template>
<script setup lang="ts">
import { useAccountStore } from '~/stores/account'

const account = useAccountStore()
const route = useRoute()
const url = useUrl()
const { price } = usePrice()

useHead({ title: 'Pedido efetuado com Sucesso' })

const order = ref({})

onMounted(() => {
    account.getOrder(route.params.id as string).then((result) => {
        order.value = result
    })
})
</script>
<style scoped>
canvas {
  width: 500px;
  background: transparent;
  margin: 0px auto;
}
.order-list__product-name {
    display: block;
    font-size: 14px;
    line-height: 1.4;
}
.order-list__product-meta {
    display: flex;
    flex-wrap: wrap;
    gap: 10px;
    font-size: 12px;
    color: #6c757d;
    margin-top: 4px;
}
.order-list__product-meta span {
    white-space: nowrap;
}
</style>
