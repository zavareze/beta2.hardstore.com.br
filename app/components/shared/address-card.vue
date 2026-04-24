<template>
    <div
        v-show="address !== null"
        :class="[
            'card',
            'address-card',
            {'address-card--featured': featured}
        ]"
    >
        <div class="address-card__body">
            <div
                v-show="badge"
                :class="[
                    'address-card__badge',
                    {'address-card__badge--muted': badgeMuted}
                ]"
            >
                {{ badge }}
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
                    {{ address.logradouro }}, {{ address.numero }}, {{ address.complemento }}<br />
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
            <div v-if="$slots.default" class="address-card__footer">
                <slot />
            </div>
        </div>
    </div>
</template>

<script setup lang="ts">
import type { IAddress } from '~/interfaces/address'

defineProps<{
    address: IAddress
    featured?: boolean
    badge?: string
    badgeMuted?: boolean
}>()
</script>
