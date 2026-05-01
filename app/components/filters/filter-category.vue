<template>
    <div class="filter-categories">
        <ul class="filter-categories__list">
            <li
                v-if="currentSlug"
                :key="'[shop]'"
                class="filter-categories__item filter-categories__item--parent"
            >
                <ArrowRoundedLeft6x9Svg class="filter-categories__arrow" />
                <AppLink :to="'/shop/catalog'">
                    Todos Produtos
                </AppLink>
            </li>

            <template v-if="filter.items">
                <li v-for="parent in filter.items.parent" :key="parent.id" class="filter-categories__item filter-categories__item--parent">
                    <ArrowRoundedLeft6x9Svg class="filter-categories__arrow" />
                    <AppLink :to="'/shop/' + parent.slug">
                        {{ getCategoryName(parent) }}
                    </AppLink>
                </li>
                <li :key="filter.items.id" :class="[
                    'filter-categories__item',
                    {'filter-categories__item--current': currentSlug === filter.items.slug}
                ]">
                    <AppLink :to="filter.items.slug ? '/shop/' + filter.items.slug : '/shop/catalog'">
                        {{ getCategoryName(filter.items) }}
                    </AppLink>
                </li>
                <li v-for="child in filter.items.children" :key="child.id" class="filter-categories__item filter-categories__item--child">
                    <AppLink :to="'/shop/' + child.slug">
                        {{ getCategoryName(child) }}
                    </AppLink>
                </li>
            </template>
        </ul>
    </div>
</template>

<script setup lang="ts">
import { computed } from 'vue'
import ArrowRoundedLeft6x9Svg from '~/svg/arrow-rounded-left-6x9.svg'
import { useShopStore } from '~/stores/shop'

defineProps<{
    filter: any
}>()

const shopStore = useShopStore()

const currentSlug = computed(() => shopStore.categorySlug || '')

function getCategoryName(child: any): string {
    if (child.name) return child.name
    if (child.titulo) return child.titulo
    const found = shopStore.categoryList?.find((c: any) => c.id === child.id)
    return found?.name || child.slug
}
</script>
