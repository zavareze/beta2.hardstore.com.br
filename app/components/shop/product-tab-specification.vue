<template>
    <div class="spec">
        <h3 class="spec__header">
            Especificações
        </h3>
        <div v-for="(section, index) in product.detalhe" :key="index" class="spec__section">
            <h4 class="spec__section-title">
                {{ section.nome }}
            </h4>
            <div v-for="(attribute, attributeIndex) in section.itens" :key="attributeIndex" class="spec__row">
                <div class="spec__name">
                    {{ attribute[0] }}
                </div>
                <div class="spec__value" v-html="attribute[1]">
                </div>
            </div>
        </div>
        <div class="spec__disclaimer">
            Informações técnicas e características podem variar, esta informações são de referência na epoca de sua publicação.<br />
            As imagens apresentadas são meramente ilustrativas e podem variar de acordo com o lote do fabricante.
        </div>
    </div>
</template>

<script setup lang="ts">
import type { IProduct } from '~/interfaces/product'

defineProps<{
    product: IProduct
}>()
</script>
