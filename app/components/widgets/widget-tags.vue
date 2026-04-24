<template>
    <div class="widget-tags widget">
        <h4 class="widget__title">
            Principais Tags
        </h4>
        <div class="tags tags--lg">
            <div class="tags__list">
                <a v-for="(tag, index) in shopStore.videos.tags" :key="index" @click="fetchTags(tag.tag)">
                    {{ tag.tag }}
                </a>
            </div>
        </div>
    </div>
</template>

<script setup lang="ts">
import { useShopStore } from '~/stores/shop'

const shopStore = useShopStore()

function fetchTags (tag: string) {
    shopStore.fetchYoutubePlaylist({ tag })
}
</script>
