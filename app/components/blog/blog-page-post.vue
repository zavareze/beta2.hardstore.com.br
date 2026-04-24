<template>
    <div>
        <PageHeader
            :breadcrumb="[
                { title: 'Home', url: '/' },
                { title: 'Blog', url: '/' },
                { title: 'Latest News', url: '/' },
            ]"
        />

        <div class="container">
            <div v-if="layout === 'classic'" class="row">
                <div v-if="sidebarPosition === 'start'" class="col-12 col-lg-4 order-1 order-lg-0">
                    <BlogSidebar :position="sidebarPosition" />
                </div>
                <div class="col-12 col-lg-8">
                    <BlogPost :layout="layout" />
                </div>
                <div v-if="sidebarPosition === 'end'" class="col-12 col-lg-4">
                    <BlogSidebar :position="sidebarPosition" />
                </div>
            </div>

            <div v-if="layout === 'full'" class="row justify-content-center">
                <div class="col-md-12 col-lg-9 col-xl-8">
                    <BlogPost :layout="layout" />
                </div>
            </div>
        </div>
    </div>
</template>

<script setup lang="ts">
defineProps<{
    layout: string
    sidebarPosition?: string
}>()
</script>
