<template>
    <div class="widget-search">
        <form class="widget-search__body">
            <input
                class="widget-search__input"
                placeholder="Procurar..."
                type="text"
                autoComplete="off"
                spellCheck="false"
                aria-label="Search"
                v-model="search"
                @change="doSearch()"
            >
            <button class="widget-search__button" type="button" @click="doSearch()">
                <Search20Svg />
            </button>
        </form>
    </div>
</template>

<script setup lang="ts">
import { ref } from 'vue'
import Search20Svg from '~/svg/search-20.svg'
import { useShopStore } from '~/stores/shop'

const shopStore = useShopStore()
const search = ref('')

function doSearch () {
    shopStore.fetchYoutubePlaylist({ search: search.value })
}
</script>
