<template>
    <div :class="cardClasses">
        <div class="post-card__image">
            <AppLink :to="'https://www.youtube.com/watch?v='+post.id" target="_blank">
                <!--suppress HtmlUnknownTarget -->
                <img :src="post.thumbnail" loading="lazy" alt="">
            </AppLink>
        </div>
        <div class="post-card__info">
            <div class="post-card__name">
                <AppLink :to="'https://www.youtube.com/watch?v='+post.id" target="_blank">
                    {{ post.title }}
                </AppLink>
            </div>
            <div class="post-card__date">
                {{ post.publishedAt.substr(0,10).split('-').reverse().join('/') }}
            </div>
            <div class="post-card__content">
                {{ post.description }}
            </div>
            <div class="post-card__read-more">
                <AppLink :to="'https://www.youtube.com/watch?v='+post.id" class="btn btn-secondary btn-sm" target="_blank">
                    Veja mais
                </AppLink>
            </div>
        </div>
    </div>
</template>

<script setup lang="ts">
import { computed } from 'vue'
import type { PostCardLayout } from '~/interfaces/components'

const props = defineProps<{
    layout?: PostCardLayout
    post: any
}>()

const cardClasses = computed(() => [
    'post-card',
    {
        'post-card--layout--grid': props.layout && ['grid-nl', 'grid-lg'].includes(props.layout),
        'post-card--layout--list': props.layout && ['list-nl', 'list-sm'].includes(props.layout),
        'post-card--size--nl': props.layout && ['grid-nl', 'list-nl'].includes(props.layout),
        'post-card--size--lg': props.layout === 'grid-lg',
        'post-card--size--sm': props.layout === 'list-sm'
    }
])
</script>
