<template>
    <div>
        <div v-if="isOpen" class="modal-overlay" @click="closeModal">
            <div class="quickview" @click.stop>
                <button class="quickview__close" type="button" @click="closeModal">
                    <Cross20Svg />
                </button>
                <table class="table">
                    <tbody>
                    <tr>
                        <td><b>Prazo</b></td>
                        <td><b>Parcela</b></td>
                        <td><b>Total</b></td>
                        <td><b>Desconto</b></td>
                    </tr>
                    <tr>
                        <td>1x</td>
                        <td>{{ price((storePrice/.85)*.88) }}</td>
                        <td>{{ price((storePrice/.85)*.88) }}</td>
                        <td>12%</td>
                    </tr>
                    <tr>
                        <td>2x</td>
                        <td>{{ price((storePrice/.85)*.9/2) }}</td>
                        <td>{{ price((storePrice/.85)*.9) }}</td>
                        <td>10%</td>
                    </tr>
                    <tr>
                        <td>3x</td>
                        <td>{{ price((storePrice/.85)*.9/3) }}</td>
                        <td>{{ price((storePrice/.85)*.9) }}</td>
                        <td>10%</td>
                    </tr>
                    <tr>
                        <td>4x</td>
                        <td>{{ price((storePrice/.85)/4) }}</td>
                        <td>{{ price(storePrice/.85) }}</td>
                        <td>-</td>
                    </tr>
                    <tr>
                        <td>5x</td>
                        <td>{{ price((storePrice/.85)/5) }}</td>
                        <td>{{ price(storePrice/.85) }}</td>
                        <td>-</td>
                    </tr>
                    <tr>
                        <td>6x</td>
                        <td>{{ price((storePrice/.85)/6) }}</td>
                        <td>{{ price(storePrice/.85) }}</td>
                        <td>-</td>
                    </tr>
                    <tr>
                        <td>7x</td>
                        <td>{{ price((storePrice/.85)/7) }}</td>
                        <td>{{ price(storePrice/.85) }}</td>
                        <td>-</td>
                    </tr>
                    <tr>
                        <td>8x</td>
                        <td>{{ price((storePrice/.85)/8) }}</td>
                        <td>{{ price(storePrice/.85) }}</td>
                        <td>-</td>
                    </tr>
                    <tr>
                        <td>9x</td>
                        <td>{{ price((storePrice/.85)/9) }}</td>
                        <td>{{ price(storePrice/.85) }}</td>
                        <td>-</td>
                    </tr>
                    <tr>
                        <td>10x</td>
                        <td>{{ price((storePrice/.85)/10) }}</td>
                        <td>{{ price(storePrice/.85) }}</td>
                        <td>-</td>
                    </tr>
                    <tr>
                        <td>11x</td>
                        <td>{{ price((storePrice/.85)/11) }}</td>
                        <td>{{ price(storePrice/.85) }}</td>
                        <td>-</td>
                    </tr>
                    <tr>
                        <td>12x</td>
                        <td>{{ price((storePrice/.85)/12) }}</td>
                        <td>{{ price(storePrice/.85) }}</td>
                        <td>-</td>
                    </tr>
                    </tbody>
                </table>
                <div>
                    <small>Aceitamos:</small><br>
                    <img loading="lazy" src="/images/paypal-logo.png" alt="" style="max-height: 40px;" class="ps-2" />
                    <img loading="lazy" src="/images/visa-mastercard.png" alt="" style="max-height: 24px;" class="ps-2" />
                    <img loading="lazy" src="/images/banricompras-logo.png" alt="" style="max-height: 24px;" class="ps-2" />
                    <img loading="lazy" src="/images/hipercard-logo.png" alt="" style="max-height: 24px;" class="ps-2" />
                    <img loading="lazy" src="/images/elo-logo.png" alt="" style="max-height: 24px;" class="ps-2" />
                </div>
            </div>
        </div>
    </div>
</template>

<script setup lang="ts">
import { ref, watch } from 'vue'
import { usePaymentOptionsStore } from '~/stores/paymentOptions'
import Cross20Svg from '~/svg/cross-20.svg'

const paymentOptionsStore = usePaymentOptionsStore()
const { price } = usePrice()

const isOpen = computed(() => paymentOptionsStore.open)
const storePrice = computed(() => paymentOptionsStore.price)
const showProduct = ref(false)

watch(isOpen, (newValue: boolean) => {
    if (newValue) {
        setTimeout(() => {
            showProduct.value = true
        }, 50)
    } else {
        showProduct.value = false
    }
})

function closeModal() {
    paymentOptionsStore.close()
}
</script>
