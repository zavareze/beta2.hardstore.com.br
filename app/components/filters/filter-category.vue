<template>
    <div class="filter-categories">
        <ul class="filter-categories__list">
            <li
                v-if="filter.value"
                :key="'[shop]'"
                class="filter-categories__item filter-categories__item--parent"
            >
                <ArrowRoundedLeft6x9Svg class="filter-categories__arrow" />
                <AppLink :to="'/'">
                    Todos Produtos
                </AppLink>
            </li>

            <template>
                <li v-for="parent in filter.items.parent" :key="parent.id" class="filter-categories__item filter-categories__item--parent">
                    <ArrowRoundedLeft6x9Svg class="filter-categories__arrow" />
                    <AppLink :to="'/shop/' + parent.slug">
                        {{ parent.name }}
                    </AppLink>
                </li>
                <li :key="filter.items.id" :class="[
                    'filter-categories__item',
                    {'filter-categories__item--current': filter.value === filter.items.slug}
                ]">
                    <AppLink :to="'/shop/' + filter.items.slug">
                        {{ filter.items.name }}
                    </AppLink>
                </li>
                <li v-for="child in filter.items.children" :key="child.id" class="filter-categories__item filter-categories__item--child">
                    <AppLink :to="'/shop/' + child.slug">
                        {{ child.name }}
                    </AppLink>
                </li>
            </template>
        </ul>
    </div>
</template>

<script setup lang="ts">
import ArrowRoundedLeft6x9Svg from '~/svg/arrow-rounded-left-6x9.svg'

defineProps<{
    filter: any
}>()
</script>
