<template>
    <div :class="['widget-categories', `widget-categories--location--${location} widget`]">
        <h4 class="widget__title">
            Categorias
        </h4>
        <ul class="widget-categories__list">
            <li v-for="(category, i) in categories" :key="i" class="widget-categories__item">
                <div class="widget-categories__row">
                    <a @click="fetchPlaylist(category.id)">
                        <ArrowRoundedRight6x9Svg class="widget-categories__arrow" />
                        {{ category.snippet.title }}
                    </a>
                </div>
            </li>
        </ul>
    </div>
</template>

<script setup lang="ts">
import ArrowRoundedRight6x9Svg from '~/svg/arrow-rounded-right-6x9.svg'
import { useShopStore } from '~/stores/shop'

export type WidgetCategoriesLocation = 'blog' | 'shop';

defineProps<{
    categories?: any[]
    location: WidgetCategoriesLocation
}>()

const shopStore = useShopStore()

function fetchPlaylist (playlist: any) {
    shopStore.fetchYoutubePlaylist({ playlist })
}
</script>
