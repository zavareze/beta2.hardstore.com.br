<template>
    <div class="block order-success">
        <div class="container">
            <div class="order-success__body">
                <div class="order-success__header pb-3">
                    <Check100Svg class="order-success__icon" />
                    <h1 class="order-success__title">
                        Obrigado!
                    </h1>
                    <div class="order-success__subtitle">
                        Seu pedido foi recebido com sucesso
                    </div>
                    <div class="order-success__actions">
                        <AppLink to="/" class="btn btn-xs btn-secondary">
                            Ir para página inicial
                        </AppLink>
                    </div>
                    <br>
                    <Payment v-show="order.status_pedido === 1 && (order.forma_pagamento === 4 || order.forma_pagamento === 1)" :order="order" />
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
                                                <!--suppress HtmlUnknownTarget -->
                                                <img class="product-image__img" :src="'https://cdn-hardstore.s3-sa-east-1.amazonaws.com/' + item.id + '/1280x960/1.webp'" alt="">
                                            </AppLink>
                                        </div>
                                    </td>
                                    <td class="order-list__column-product">
                                        <AppLink :to="url.product(item)">
                                            {{ item.name }}
                                        </AppLink>
                                        <span class="order-list__options-label">Modelo:</span>
                                        <span class="order-list__options-value">{{ item.pn }}</span>
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

                <div class="row mt-3 no-gutters mx-n2">
                    <div class="col-sm-12 col-12 px-2">
                        <AddressCard
                            :address="order"
                            badge="Endereço de Entrega"
                            :badge-muted="true"
                        />
                    </div>
                </div>
            </div>
        </div>
    </div>
</template>

<script setup lang="ts">
import { useAccountStore } from '~/stores/account'
import { useCartStore } from '~/stores/cart'
import { useEcommerceTracking, toGA4Item } from '~/composables/useEcommerceTracking'
import { usePixelTracking } from '~/composables/usePixelTracking'
import Check100Svg from '~/svg/check-100.svg'

const account = useAccountStore()
const cartStore = useCartStore()
const url = useUrl()
const { price } = usePrice()
const tracking = useEcommerceTracking()
const pixel = usePixelTracking()

useHead({ title: 'Pedido efetuado com Sucesso' })

const order = computed(() => account.order)
const pixExpirado = ref(false)

const canvasRef = ref<HTMLCanvasElement | null>(null)

onMounted(() => {
    cartStore.clear()
    if (order.value.forma_pagamento === 1) {
        if (order.value.timeout)
            ringer(order.value.timeout)
    }

    const orderId = String(order.value.id)
    const guardKey = `gtm_purchase_${orderId}`
    if (!sessionStorage.getItem(guardKey) && order.value.products?.length) {
        sessionStorage.setItem(guardKey, '1')
        const items = (order.value.products as Array<{ id: number; name: string; price: number; quantity: number }>).map(p =>
            toGA4Item({ id: p.id, name: p.name, price: p.price }, p.quantity, p.price)
        )
        tracking.purchase(
            orderId,
            items,
            order.value.valor_total,
            0,
            order.value.valor_frete
        )
        pixel.purchase(
            orderId,
            order.value.valor_total,
            (order.value.products as Array<{ id: number }>).map(p => String(p.id)),
            (order.value.products as Array<unknown>).length
        )
    }
})

function ringer (timeout) {
    const x = {
        r_size: 100,
        r_thickness: 10,
        r_count: 4,
        r_spacing: 20,
        countdown_to: timeout
    }
    const ringerObj = {
        countdown_to: x.countdown_to,
        rings: {
            DIAS: { s: 86400000, max: 365 },
            HORAS: { s: 3600000, max: 24 },
            MINUTOS: { s: 60000, max: 60 },
            SEGUNDOS: { s: 1000, max: 60 }
        },
        r_count: x.r_count,
        r_spacing: x.r_spacing,
        r_size: x.r_size,
        r_thickness: x.r_thickness,
        update_interval: 1000,
        cvs: canvasRef.value as any,
        ctx: (canvasRef.value as any)?.getContext('2d'),
        size: {
            w: (x.r_size + x.r_thickness) * x.r_count + (x.r_spacing * (x.r_count - 1)),
            h: (x.r_size + x.r_thickness)
        },
        actual_size: x.r_size + x.r_thickness,
        countdown_to_time: new Date(x.countdown_to).getTime()
    }
    if (ringerObj.ctx) {
        ringerObj.ctx.textAlign = 'center'
        ringerObj.ctx.imageSmoothingEnabled = false
        ringerObj.ctx.webkitImageSmoothingEnabled = false
        ringerObj.ctx.mozImageSmoothingEnabled = false
    }
    go(ringerObj)
}

function go (ringerObj) {
    let idx = 0
    ringerObj.time = (new Date().getTime()) - ringerObj.countdown_to_time
    for (const r_key in ringerObj.rings) { unit(ringerObj, idx++, r_key, ringerObj.rings[r_key]) }
    setTimeout(() => { go(ringerObj) }, ringerObj.update_interval)
}

function unit (ringerObj, idx, label, ring) {
    let x; let y; let value; const ring_secs = ring.s
    value = ringerObj.time / ring_secs
    ringerObj.time -= Math.round(parseInt(value)) * ring_secs
    value = Math.abs(value)
    x = (ringerObj.r_size * 0.5 + ringerObj.r_thickness * 0.5)
    x += +(idx * (ringerObj.r_size + ringerObj.r_spacing + ringerObj.r_thickness))
    y = ringerObj.r_size * 0.5
    y += ringerObj.r_thickness * 0.5
    const degrees = 360 - (value / ring.max) * 360.0
    const endAngle = degrees * (Math.PI / 180)
    if (ringerObj.ctx) {
        ringerObj.ctx.save()
        ringerObj.ctx.translate(x, y)
        ringerObj.ctx.clearRect(ringerObj.actual_size * -0.5, ringerObj.actual_size * -0.5, ringerObj.actual_size, ringerObj.actual_size)
        ringerObj.ctx.strokeStyle = 'rgba(128,128,128,0.2)'
        ringerObj.ctx.beginPath()
        ringerObj.ctx.arc(0, 0, ringerObj.r_size / 2, 0, 2 * Math.PI, 2)
        ringerObj.ctx.lineWidth = ringerObj.r_thickness
        ringerObj.ctx.stroke()
        ringerObj.ctx.strokeStyle = 'rgba(253, 128, 1, 0.9)'
        ringerObj.ctx.beginPath()
        ringerObj.ctx.arc(0, 0, ringerObj.r_size / 2, 0, endAngle, 1)
        ringerObj.ctx.lineWidth = ringerObj.r_thickness
        ringerObj.ctx.stroke()
        ringerObj.ctx.fillStyle = 'black'
        ringerObj.ctx.font = '10px Helvetica'
        ringerObj.ctx.fillText(label, 0, 23)
        ringerObj.ctx.fillText(label, 0, 23)
        ringerObj.ctx.font = 'bold 35px Helvetica'
        ringerObj.ctx.fillText(Math.floor(value), 0, 10)
        ringerObj.ctx.restore()
    }
}

function abreBoleto () {
    window.open('https://api.hardstore.com.br/api/boleto/show/' + order.value.magic_link)
}

function copiarBoletoClipboard () {
    navigator.clipboard.writeText(order.value.linha_digitavel).then(function () {
        useNuxtApp().$notify?.({
            type: 'success text-success',
            text: 'Código de barras copiado com sucesso!',
            duration: 5000
        })
    }, function () {
        console.error('Unable to write to clipboard.')
        useNuxtApp().$notify?.({
            type: 'error text-error',
            text: 'Não foi possível copiar o código de barras!',
            duration: 5000
        })
    })
}

function copiarPixClipboard () {
    navigator.clipboard.writeText(order.value.emv).then(function () {
        useNuxtApp().$notify?.({
            type: 'success text-success',
            text: 'Código PIX copiado com sucesso!',
            duration: 5000
        })
    }, function () {
        console.error('Unable to write to clipboard.')
        useNuxtApp().$notify?.({
            type: 'error text-error',
            text: 'Não foi possível copiar o código PIX!',
            duration: 5000
        })
    })
}
</script>
<style scoped>
canvas {
  width: 500px;
  background: transparent;
  margin: 0px auto;
}
</style>
