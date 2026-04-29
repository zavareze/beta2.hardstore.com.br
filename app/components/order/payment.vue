<template>
    <div class="row mt-3 no-gutters mx-n2">
        <div class="col-sm-12 col-12 px-2">
            <div class="card address-card">
                <div class="address-card__body">
                    <div class="address-card__badge address-card__badge--muted">
                        Pagamento
                    </div>
                    <div v-show="order.forma_pagamento && order.forma_pagamento === 4 && order.boleto && order.boleto.linha_digitavel && order.boleto.magic_link" class="mb-4">
                        <button type="button" class="btn btn-secondary btn-xl mt-2" @click="abreBoleto()">
                            <BarCodeSvg />
                            <div class="float-end ms-2 mt-1">
                                Imprimir Boleto
                            </div>
                        </button>
                        <button type="button" class="btn btn-secondary btn-xl btn-icon-svg mt-2" @click="copiarBoletoClipboard()">
                            <ScanCodeSvg />
                            <div class="float-end ms-2 mt-1">
                                Copiar Código Barras
                            </div>
                        </button>
                        <iframe v-show="order.boleto && order.boleto.linha_digitavel && order.boleto.magic_link"
                            class="mt-2"
                            style="border: 0px"
                            width="100%"
                            height="500px"
                            :src="magic_link"></iframe>
                    </div>
                    <div v-show="order.forma_pagamento === 1 && order.emv && !pixExpirado">
                        <qrcode-vue class="text-center" :value="order.emv" :size="200" level="L" render-as="canvas" />
                        <div class="mx-auto">
                            <button type="button" class="btn-primary btn-xl mt-2" @click="copiarPixClipboard()">
                                Pix Copia e Cola
                            </button>
                        </div>
                        <div class="pt-4">
                            <h3 class="pb-4">
                                Tempo de Validade da Chave PIX
                            </h3>
                            <canvas ref="canvasRef" width="500" />
                        </div>
                    </div>
                    <div v-show="order.forma_pagamento === 1 && pixExpirado">
                        <h2>Chave PIX Expirada</h2>
                        <p style="color: red;">
                            Não é possível efetuar o pagamento, por favor efetue um novo pedido.
                        </p>
                    </div>
                </div>
            </div>
        </div>
    </div>
</template>

<script setup lang="ts">
import { ref, onMounted, onUpdated } from 'vue'
import QrcodeVue from 'qrcode.vue'
import BarCodeSvg from '~/svg/barcode.svg'
import ScanCodeSvg from '~/svg/scancode.svg'

const props = defineProps<{
    order: any
}>()

const pixExpirado = ref(false)
const magic_link = ref('')
const canvasRef = ref<any>()

onMounted(() => {
    if (props.order.pix) {
        const now = new Date()
        const timeout = new Date(props.order.timeout)
        if (now > timeout) {
            pixExpirado.value = true
        } else {
            ringer(props.order.timeout)
        }
    }
    if (props.order && props.order.boleto && props.order.boleto.magic_link)
        magic_link.value = 'https://api.hardstore.com.br/api/boleto/show/' + props.order.boleto.magic_link.toString()
})

onUpdated(() => {
    if (props.order.pix) {
        const now = new Date()
        const timeout = new Date(props.order.timeout)
        if (now > timeout) {
            pixExpirado.value = true
        } else {
            ringer(props.order.timeout)
        }
    }
    if (props.order && props.order.boleto && props.order.boleto.magic_link)
        magic_link.value = 'https://api.hardstore.com.br/api/boleto/show/' + props.order.boleto.magic_link.toString()
})

function ringer(timeout: any) {
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
        ctx: (canvasRef.value as any).getContext('2d'),
        size: {
            w: (x.r_size + x.r_thickness) * x.r_count + (x.r_spacing * (x.r_count - 1)),
            h: (x.r_size + x.r_thickness)
        },
        actual_size: x.r_size + x.r_thickness,
        countdown_to_time: new Date(x.countdown_to).getTime()
    } as any
    ringerObj.ctx.textAlign = 'center'
    ringerObj.ctx.imageSmoothingEnabled = false
    ringerObj.ctx.webkitImageSmoothingEnabled = false
    ringerObj.ctx.mozImageSmoothingEnabled = false
    go(ringerObj)
}

function go(ringerObj: any) {
    let idx = 0
    ringerObj.time = (new Date().getTime()) - ringerObj.countdown_to_time
    for (const r_key in ringerObj.rings) { unit(ringerObj, idx++, r_key, ringerObj.rings[r_key]) }
    setTimeout(() => { go(ringerObj) }, ringerObj.update_interval)
}

function unit(ringerObj: any, idx: number, label: string, ring: any) {
    let x: number; let y: number; let value: number
    const ring_secs = ring.s
    value = ringerObj.time / ring_secs
    ringerObj.time -= Math.round(parseInt(value as any)) * ring_secs
    value = Math.abs(value)
    x = (ringerObj.r_size * 0.5 + ringerObj.r_thickness * 0.5)
    x += +(idx * (ringerObj.r_size + ringerObj.r_spacing + ringerObj.r_thickness))
    y = ringerObj.r_size * 0.5
    y += ringerObj.r_thickness * 0.5
    const degrees = 360 - (value / ring.max) * 360.0
    const endAngle = degrees * (Math.PI / 180)
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

function abreBoleto() {
    window.open('https://api.hardstore.com.br/api/boleto/show/' + props.order.boleto.magic_link.toString())
}

function copiarParaClipboard(codigo: string, mensagem: string) {
    if (typeof (navigator.clipboard) === 'undefined') {
        const textArea = document.createElement('textarea')
        textArea.value = codigo
        textArea.style.position = 'fixed'
        document.body.appendChild(textArea)
        textArea.focus()
        textArea.select()
        try {
            document.execCommand('copy')
            useNuxtApp().$notify?.({
                type: 'success text-success',
                text: mensagem + ' copiado com sucesso!',
                duration: 5000
            })
        } catch (err) {
            useNuxtApp().$notify?.({
                type: 'error text-error',
                text: 'Não foi possível copiar o ' + mensagem + '!',
                duration: 5000
            })
        }
        document.body.removeChild(textArea)
    } else {
        navigator.clipboard.writeText(codigo).then(function () {
            useNuxtApp().$notify?.({
                type: 'success text-success',
                text: mensagem + ' copiado com sucesso!',
                duration: 5000
            })
        }, function () {
            useNuxtApp().$notify?.({
                type: 'error text-error',
                text: 'Não foi possível copiar o ' + mensagem + '!',
                duration: 5000
            })
        })
    }
}

function copiarBoletoClipboard() {
    copiarParaClipboard(props.order.boleto.linha_digitavel, 'Código de Barras')
}

function copiarPixClipboard() {
    copiarParaClipboard(props.order.emv, 'Código PIX')
}
</script>
