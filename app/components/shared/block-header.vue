<template>
    <div class="block-header">
        <h3 class="block-header__title">{{ title }}</h3>
        <div class="block-header__divider" />

        <ul v-if="groups && groups.length > 0" class="block-header__groups-list">
            <li v-for="(group, index) in groups" :key="index">
                <button
                    type="button"
                    :class="['block-header__group', { 'block-header__group--active': group.current }]"
                    @click="emit('groupClick', group)"
                >
                    {{ group.name }}
                </button>
            </li>
        </ul>

        <div v-if="arrows" class="block-header__arrows-list">
            <button class="block-header__arrow block-header__arrow--left" type="button" @click="emit('prev')">
                <span class="arrow-icon">&#8249;</span>
            </button>
            <button class="block-header__arrow block-header__arrow--right" type="button" @click="emit('next')">
                <span class="arrow-icon">&#8250;</span>
            </button>
        </div>
    </div>
</template>

<script setup lang="ts">
import type { BlockHeaderGroup } from '~/interfaces/components'

defineProps<{
    title: string
    arrows?: boolean
    groups?: BlockHeaderGroup[]
}>()

const emit = defineEmits<{
    prev: []
    next: []
    groupClick: [group: BlockHeaderGroup]
}>()
</script>
