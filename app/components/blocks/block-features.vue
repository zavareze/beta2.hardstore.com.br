<template>
    <div :class="`block block-features block-features--layout--${layout}`">
        <div class="container">
            <div class="block-features__list" style="background-color:white">
                <div class="block-features__item">
                    <div class="block-features__icon">
                        <FiFreeDelivery48Svg />
                    </div>
                    <div class="block-features__content">
                        <div class="block-features__title">
                            Frete Grátis
                        </div>
                        <div class="block-features__subtitle">
                            Pedidos acima R$ 3.500* <p class="small" style="margin:0px">Para Regisão Sul</p>
                        </div>
                    </div>
                </div>
                <div class="block-features__divider" />
                <div class="block-features__item">
                    <div class="block-features__icon">
                        <Fi24Hours48Svg />
                    </div>
                    <div class="block-features__content">
                        <div class="block-features__title">
                            Atendimento Online
                        </div>
                        <div class="block-features__subtitle">
                            Via Chat/Whatsapp
                        </div>
                    </div>
                </div>
                <div class="block-features__divider" />
                <div class="block-features__item">
                    <div class="block-features__icon">
                        <FiPaymentSecurity48Svg />
                    </div>
                    <div class="block-features__content">
                        <div class="block-features__title">
                            Pagamento Seguro
                        </div>
                        <div class="block-features__subtitle">
                            Certificado SSL - HTTPS
                        </div>
                    </div>
                </div>
                <div class="block-features__divider" />
                <NuxtLink class="block-features__item" style="cursor: pointer; color: black;" to="/shop/promocao">
                    <div class="block-features__icon">
                        <FiTag48Svg />
                    </div>
                    <div class="block-features__content">
                        <div class="block-features__title">
                            Promoções
                        </div>
                        <div class="block-features__subtitle">
                            Descontos de até {{ shopStore.maxDiscount }}%
                        </div>
                    </div>
                </NuxtLink>
            </div>
        </div>
    </div>
</template>

<script setup lang="ts">
import { useShopStore } from '~/stores/shop'
import FiFreeDelivery48Svg from '~/svg/fi-free-delivery-48.svg'
import Fi24Hours48Svg from '~/svg/fi-24-hours-48.svg'
import FiPaymentSecurity48Svg from '~/svg/fi-payment-security-48.svg'
import FiTag48Svg from '~/svg/fi-tag-48.svg'

type BlockFeaturesLayout = 'classic' | 'boxed'

withDefaults(defineProps<{
    layout?: BlockFeaturesLayout
}>(), {
    layout: 'classic'
})

const shopStore = useShopStore()

await useAsyncData('maxDiscount', async () => {
    await shopStore.fetchMaxDiscount()
    return shopStore.maxDiscount
})
</script>
