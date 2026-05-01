<template>
    <div class="page-header">
        <div class="page-header__container container">
            <div class="page-header__breadcrumb">
                <nav aria-label="breadcrumb">
                    <ol class="breadcrumb">
                        <template v-for="(item, index) in breadcrumb" :key="index">
                            <li v-if="!item.hidden && index !== breadcrumb.length - 1" class="breadcrumb-item">
                                <AppLink :to="item.url">{{ item.title }}</AppLink>
                                <span class="breadcrumb-arrow">›</span>
                            </li>
                            <li v-else-if="!item.hidden" class="breadcrumb-item active">{{ item.title }}</li>
                        </template>
                    </ol>
                </nav>
            </div>
            <div v-if="title" class="page-header__title">
                <h1>{{ title }}</h1>
            </div>
        </div>
    </div>
</template>

<script setup lang="ts">
import type { ILink } from '~/interfaces/menus/link'

defineProps<{
    title?: string
    breadcrumb?: ILink[]
}>()
</script>
