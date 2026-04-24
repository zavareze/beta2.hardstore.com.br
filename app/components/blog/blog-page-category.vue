<template>
    <div>
        <PageHeader
            title="Últimas Novidades"
            :breadcrumb="[
                { title: 'Home', url: '/' },
                { title: 'Blog', url: '/blog/category-list' },
                { title: 'Últimas Novidades', url: '/blog/category-list' },
            ]"
        />

        <div class="container">
            <div class="row">
                <div v-if="sidebarPosition === 'start'" class="col-12 col-lg-4 order-1 order-lg-0">
                    <BlogSidebar :position="sidebarPosition" />
                </div>
                <div class="col-12 col-lg-8">
                    <div class="block">
                        <div class="posts-view">
                            <div :class="['posts-view__list', 'posts-list', `posts-list--layout--${layout}`]">
                                <div class="posts-list__body">
                                    <div v-for="(item, i) in shopStore.videos.videos" :key="i" class="posts-list__item">
                                        <PostCard :post="item" :layout="cardLayout" />
                                    </div>
                                </div>
                            </div>
                            <!--<div class="posts-view__pagination">
                                <Pagination
                                    :current="page"
                                    :siblings="2"
                                    :total="10"
                                    @page-change="setPage"
                                />
                            </div>-->
                        </div>
                    </div>
                </div>
                <div v-if="sidebarPosition === 'end'" class="col-12 col-lg-4">
                    <BlogSidebar :position="sidebarPosition" />
                </div>
            </div>
        </div>
    </div>
</template>

<script setup lang="ts">
import { computed, ref, onMounted } from 'vue'
import { useShopStore } from '~/stores/shop'

type Layout = 'classic' | 'grid' | 'list'
type SidebarPosition = 'start' | 'end'
type PostCardLayout = string
type PostCardLayoutMap = { [K in Layout]: PostCardLayout }

const postCartLayoutMap: PostCardLayoutMap = {
    classic: 'grid-lg',
    grid: 'grid-nl',
    list: 'list-nl'
}

const props = defineProps<{
    layout: Layout
    sidebarPosition: SidebarPosition
}>()

const shopStore = useShopStore()
const page = ref(1)

const cardLayout = computed((): PostCardLayout => {
    return postCartLayoutMap[props.layout]
})

function setPage(p: number): void {
    page.value = p
}

onMounted(() => {
    shopStore.fetchYoutube()
})
</script>
