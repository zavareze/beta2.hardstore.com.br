<template>
    <ol :class="['comments-list', `comments-list--level--${level}`]">
        <li v-for="comment in comments" :key="comment.id" class="comments-list__item">
            {{ comment }}
            <div class="comment">
                <div class="comment__avatar">
                    <img :src="comment.snippet.topLevelComment.snippet.authorProfileImageUrl" alt="">
                </div>
                <div class="comment__content">
                    <div class="comment__header">
                        <div class="comment__author">
                            {{ comment.snippet.topLevelComment.snippet.authorDisplayName }}
                        </div>
                        <div class="comment__reply">
                            <button type="button" class="btn btn-xs btn-light">
                                Responder
                            </button>
                        </div>
                    </div>
                    <div class="comment__text">
                        {{ comment.snippet.topLevelComment.snippet.textDisplay }}
                    </div>
                    <div class="comment__date">
                        {{ comment.snippet.topLevelComment.snippet.publishedAt }}
                    </div>
                </div>
            </div>
        </li>
    </ol>
</template>

<script setup lang="ts">
withDefaults(defineProps<{
    comments?: any[]
    level?: number
}>(), {
    comments: () => [],
    level: 0
})
</script>
