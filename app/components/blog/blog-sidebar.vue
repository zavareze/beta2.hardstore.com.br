<template>
    <div :class="['block', 'block-sidebar', `block-sidebar--position--${position}`]">
        <div class="block-sidebar__item">
            <WidgetSearch />
        </div>
        <div class="block-sidebar__item">
            <WidgetAboutUs />
        </div>
        <div class="block-sidebar__item">
            <WidgetCategories :categories="categories" location="blog" />
        </div>
        <div class="block-sidebar__item">
            <WidgetPosts :posts="posts" />
        </div>
        <div class="block-sidebar__item">
            <WidgetNewsletter />
        </div>
        <div class="block-sidebar__item">
            <WidgetComments :comments="comments" />
        </div>
        <div class="block-sidebar__item">
            <WidgetTags />
        </div>
    </div>
</template>

<script setup lang="ts">
import { ref, onMounted } from 'vue'
import { useShopStore } from '~/stores/shop'

withDefaults(defineProps<{
    position?: string
}>(), {
    position: 'start'
})

const shopStore = useShopStore()
const categories = ref([])
const posts = ref(null)
const comments = ref([])

onMounted(async () => {
    const playlistResult = await shopStore.fetchPlaylist()
    if (playlistResult) {
        categories.value = playlistResult.items
    }
    const commentsResult = await shopStore.fetchComments()
    if (commentsResult) {
        comments.value = commentsResult.items
    }
})
</script>
