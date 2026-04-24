<template>
    <AccountLayout>
        <div class="card">
            <div class="order-header">
                <div class="order-header__actions">
                    <AppLink :to="url.accountOrders()" class="btn btn-xs btn-secondary">
                        Voltar para lista de Pedidos
                    </AppLink>
                </div>
                <h5 class="order-header__title">
                    Pedido #{{ order.id }}
                </h5>
                <div class="order-header__subtitle">
                    Solicitado em
                    <mark class="order-header__date">{{ order.date }}</mark>
                    e atualmente
                    <mark class="order-header__status">{{ order.n_status_pedido }}</mark>.
                </div>
            </div>
            <div class="card-divider" />
            <div class="card-table">
                <div class="table-responsive-sm mb-0">
                    <table>
                        <thead>
                            <tr>
                                <th>Produto</th>
                                <th>Total</th>
                            </tr>
                        </thead>
                        <tbody class="card-table__body card-table__body--merge-rows">
                            <tr v-for="item in order.products" :key="item.id">
                                <td>{{ item.name }} × {{ item.quantity }}</td>
                                <td>{{ price(item.price*item.quantity) }}</td>
                            </tr>
                        </tbody>
                        <tbody
                            class="card-table__body card-table__body--merge-rows"
                        >
                            <tr>
                                <th>Subtotal</th>
                                <td>{{ price(order.valor_subtotal) }}</td>
                            </tr>
                            <tr>
                                <th>Desconto</th>
                                <td>{{ price(order.valor_frete+order.valor_subtotal-order.valor_pago-order.saldo_cartao) }}</td>
                            </tr>
                            <tr>
                                <th>Frete</th>
                                <td>{{ price(order.valor_frete) }}</td>
                            </tr>
                        </tbody>
                        <tfoot>
                            <tr>
                                <th>Total</th>
                                <td>{{ price(order.valor_total) }}</td>
                            </tr>
                        </tfoot>
                    </table>
                </div>
            </div>
        </div>
        <Payment v-if="order2.status_pedido === 1 && (order2.forma_pagamento === 4 || order2.forma_pagamento === 1)" :order="order2" />
        <div class="row mt-3 no-gutters mx-n2">
            <div class="col-sm-12 col-12 px-2">
                <AddressCard :address="order" featured badge="Endereço Entrega" badge-muted />
            </div>
        </div>
        <Tracking :rastreios="order2.rastreios" />
    </AccountLayout>
</template>

<script setup lang="ts">
import { useAccountStore } from '~/stores/account'

const account = useAccountStore()
const route = useRoute()
const router = useRouter()
const url = useUrl()
const { price } = usePrice()

useHead({ title: 'Detalhes Pedido' })

await useAsyncData('orderDetails', async () => {
    account.fetchOrder({})
    await account.selectedOrder({ id: route.params.id })
    if (account.selectedOrder && account.selectedOrder.magic_link != '')
        await account.getOrder(account.selectedOrder.magic_link)
    return true
})

const order2 = computed(() => account.order)
const pixExpirado = ref(false)
const order = ref(Object.assign({}, account.selectedOrder))

onBeforeMount(() => {
    if (!account.user.document)
        router.push('/account/login')
    if (!account.selectedOrder)
        router.push('/account/dashboard')
})

onMounted(() => {
    if (order2.value.pix) {
        const now = new Date()
        const timeout = new Date(order2.value.timeout)
        if (now > timeout)
            pixExpirado.value = true
        else
            ringer(order2.value.timeout)
    }
})

const canvasRef = ref<HTMLCanvasElement | null>(null)

function ringer (timeout) {
    var x = {
        r_size: 100,
        r_thickness: 10,
        r_count: 4,
        r_spacing: 20,
        countdown_to: timeout
    }
    var ringerObj = {
        countdown_to: x.countdown_to,
        rings: {
            'DIAS': {
                s: 86400000,
                max: 365},
            'HORAS': {
                s: 3600000,
                max: 24},
            'MINUTOS': {
                s: 60000,
                max: 60},
            'SEGUNDOS': {
                s: 1000,
                max: 60}
        },
        r_count: x.r_count,
        r_spacing: x.r_spacing,
        r_size: x.r_size,
        r_thickness: x.r_thickness,
        update_interval: 1000,
        cvs: canvasRef.value as any,
        ctx: (canvasRef.value as any)?.getContext('2d'),
        size: {
            w: (x.r_size + x.r_thickness) * x.r_count + (x.r_spacing*(x.r_count-1)),
            h: (x.r_size + x.r_thickness)
        },
        actual_size: x.r_size + x.r_thickness,
        countdown_to_time: new Date(x.countdown_to).getTime()
    }
    if (ringerObj.ctx) {
        ringerObj.ctx.textAlign = 'center'
        ringerObj.ctx.imageSmoothingEnabled = false;
        ringerObj.ctx.webkitImageSmoothingEnabled = false;
        ringerObj.ctx.mozImageSmoothingEnabled = false;
    }
    go(ringerObj)
}

function go (ringerObj) {
    var idx=0;
    ringerObj.time = (new Date().getTime()) - ringerObj.countdown_to_time;
    for(var r_key in ringerObj.rings) unit(ringerObj, idx++,r_key,ringerObj.rings[r_key]);
    setTimeout(() => { go(ringerObj) }, ringerObj.update_interval);
}

function unit (ringerObj, idx,label,ring) {
    var x,y, value, ring_secs = ring.s;
    value = ringerObj.time/ring_secs
    ringerObj.time-=Math.round(parseInt(value)) * ring_secs;
    value = Math.abs(value);
    x = (ringerObj.r_size*.5 + ringerObj.r_thickness*.5);
    x +=+(idx*(ringerObj.r_size+ringerObj.r_spacing+ringerObj.r_thickness));
    y = ringerObj.r_size*.5;
    y += ringerObj.r_thickness*.5;
    var degrees = 360-(value / ring.max) * 360.0;
    var endAngle = degrees * (Math.PI / 180);
    if (ringerObj.ctx) {
        ringerObj.ctx.save();
        ringerObj.ctx.translate(x,y);
        ringerObj.ctx.clearRect(ringerObj.actual_size*-0.5,ringerObj.actual_size*-0.5,ringerObj.actual_size,ringerObj.actual_size);
        ringerObj.ctx.strokeStyle = "rgba(128,128,128,0.2)";
        ringerObj.ctx.beginPath();
        ringerObj.ctx.arc(0,0,ringerObj.r_size/2,0,2 * Math.PI, 2);
        ringerObj.ctx.lineWidth =ringerObj.r_thickness;
        ringerObj.ctx.stroke();
        ringerObj.ctx.strokeStyle = "rgba(253, 128, 1, 0.9)";
        ringerObj.ctx.beginPath();
        ringerObj.ctx.arc(0,0,ringerObj.r_size/2,0,endAngle, 1);
        ringerObj.ctx.lineWidth =ringerObj.r_thickness;
        ringerObj.ctx.stroke();
        ringerObj.ctx.fillStyle = "black";
        ringerObj.ctx.font = '10px Helvetica';
        ringerObj.ctx.fillText(label, 0, 23);
        ringerObj.ctx.fillText(label, 0, 23);
        ringerObj.ctx.font = 'bold 35px Helvetica';
        ringerObj.ctx.fillText(Math.floor(value), 0, 10);
        ringerObj.ctx.restore();
    }
}

function abreBoleto () {
    window.open('https://api.hardstore.com.br/api/boleto/show/'+order2.value.boleto.magic_link.toString())
}

function copiarParaClipboard(codigo, mensagem) {
    if (typeof(navigator.clipboard)=='undefined') {
        var textArea = document.createElement("textarea");
        textArea.value = codigo;
        textArea.style.position="fixed";
        document.body.appendChild(textArea);
        textArea.focus();
        textArea.select();
        try {
            document.execCommand('copy');
            useNuxtApp().$notify?.({
                type: 'success text-success',
                text: mensagem+' copiado com sucesso!',
                duration: 5000
            })
        } catch (err) {
            useNuxtApp().$notify?.({
                type: 'error text-error',
                text: 'Não foi possível copiar o '+mensagem+'!',
                duration: 5000
            })
        }
        document.body.removeChild(textArea)
    } else
        navigator.clipboard.writeText(codigo).then(function() {
            useNuxtApp().$notify?.({
                type: 'success text-success',
                text: mensagem+' copiado com sucesso!',
                duration: 5000
            })
        }, function() {
            useNuxtApp().$notify?.({
                type: 'error text-error',
                text: 'Não foi possível copiar o '+mensagem+'!',
                duration: 5000
            })
        });
}

function copiarBoletoClipboard() {
    copiarParaClipboard(order2.value.boleto.linha_digitavel, 'Código de Barras')
}

function copiarPixClipboard() {
    copiarParaClipboard(order2.value.emv, 'Código PIX')
}
</script>
