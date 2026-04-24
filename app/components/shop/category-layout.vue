<template>
    <div>
        <div v-if="columns > 3" class="container">
            <div class="block">
                <slot name="productsView" />
                <slot name="textoSeo" class="categoria-seo" />
            </div>

            <slot name="sidebar" />
        </div>

        <div v-if="columns <= 3" class="container">
            <div :class="`shop-layout shop-layout--sidebar--${sidebarPosition}`">
                <div v-if="sidebarPosition === 'start'" class="shop-layout__sidebar">
                    <slot name="sidebar" />
                </div>

                <div class="shop-layout__content">
                    <div class="block">
                        <slot name="productsView" />
                        <slot name="textoSeo" class="categoria-seo" />
                    </div>
                </div>

                <div v-if="sidebarPosition === 'end'" class="shop-layout__sidebar">
                    <slot name="sidebar" />
                </div>
            </div>
        </div>
    </div>
</template>

<script setup lang="ts">
export type CategoryLayoutColumns = 3 | 4 | 5;
export type CategoryLayoutSidebarPosition = 'start' | 'end';

withDefaults(defineProps<{
    columns?: CategoryLayoutColumns
    sidebarPosition?: CategoryLayoutSidebarPosition
}>(), {
    columns: 3,
    sidebarPosition: 'start',
})
</script>
