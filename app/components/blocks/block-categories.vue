<template>
    <div :class="`block block--highlighted block-categories block-categories--layout--${layout}`">
        <div class="container">
            <BlockHeader :title="title" />

            <div class="block-categories__list">
                <div
                    v-for="(category, index) in categories"
                    :key="index"
                    :class="`block-categories__item category-card category-card--layout--${layout}`"
                >
                    <div class=" category-card__body">
                        <div class=" category-card__image">
                            <AppLink :to="'/shop/'+category.slug" :aria-label="'Ver categoria ' + category.name">
                                <!--suppress HtmlUnknownTarget -->
                                <img :src="category.image" alt="" width="130" height="176">
                            </AppLink>
                        </div>
                        <div class=" category-card__content">
                            <div class=" category-card__name">
                                <AppLink :to="'/shop/'+category.slug">
                                    {{ category.name }}
                                </AppLink>
                            </div>
                            <ul class="category-card__links">
                                <li v-for="(sub, subIndex) in category.children.slice(0, 5)" :key="subIndex">
                                    <AppLink :to="'/shop/'+sub.slug">
                                        {{ sub.name }}
                                    </AppLink>
                                </li>
                            </ul>
                            <div class="category-card__all">
                                <AppLink :to="'/shop/'+category.slug">
                                    Todos
                                </AppLink>
                            </div>
                            <div class="category-card__products">
                                {{ category.items }} Products
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    </div>
</template>

<script setup lang="ts">
import type { ICategory } from '~/interfaces/category'

type BlockCategoriesLayout = 'classic' | 'compact';

withDefaults(defineProps<{
    title: string
    layout?: BlockCategoriesLayout
    categories?: ICategory[]
}>(), {
    layout: 'classic',
    categories: () => []
})
</script>
