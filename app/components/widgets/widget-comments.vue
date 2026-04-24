<template>
    <div class="widget-comments widget">
        <h4 class="widget__title">
            Últimos Comentários
        </h4>
        <ul class="widget-comments__list">
            <li v-for="comment in comments" :key="comment.id" class="widget-comments__item">
                <b>{{ comment.snippet.topLevelComment.snippet.authorDisplayName }}</b>
                <a class="widget-comments__content" v-html="comment.snippet.topLevelComment.snippet.textDisplay"
                :href="'https://www.youtube.com/watch?v='+comment.snippet.videoId" target="_blank">
                </a>
                <div class="widget-comments__meta">
                    <div class="widget-comments__date">
                        {{ fixDate(comment.snippet.topLevelComment.snippet.publishedAt) }}
                    </div>
                </div>
            </li>
        </ul>
    </div>
</template>

<script setup lang="ts">
withDefaults(defineProps<{
    comments?: any[]
}>(), {
    comments: () => [],
})

function fixDate (date: string): string {
    let dt = date.split('T')
    return dt[0].split('-').reverse().join('/') + ' ' + dt[1].substr(0, 5)
}
</script>
<style scoped>

</style>
