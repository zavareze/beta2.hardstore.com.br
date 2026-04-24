<template>
    <div class="widget-posts widget">
        <h4 class="widget__title">
            Latest Posts
        </h4>
        <div class="widget-posts__list">
            <div v-for="post in posts" :key="post.id" class="widget-posts__item">
                <div class="widget-posts__image">
                    <AppLink :to="url.blogPost()">
                        <!--suppress HtmlUnknownTarget -->
                        <img :src="url.img(postImage(post))" alt="">
                    </AppLink>
                </div>
                <div class="widget-posts__info">
                    <div class="widget-posts__name">
                        <AppLink :to="url.blogPost()">
                            {{ post.title }}
                        </AppLink>
                    </div>
                    <div class="widget-posts__date">
                        {{ post.date }}
                    </div>
                </div>
            </div>
        </div>
    </div>
</template>

<script setup lang="ts">
import type { IPost } from '~/interfaces/post'

withDefaults(defineProps<{
    posts?: IPost[]
}>(), {
    posts: () => [],
})

const url = useUrl()

function postImage (post: IPost): string {
    return post.image.replace(/\.jpg$/, '-thumbnail.jpg')
}
</script>
