<template>
    <ul
        :class="[
            'megamenu__links',
            `megamenu__links--level--${level}`
        ]"
    >
        <li
            v-for="(link, index) in links"
            :key="index"
            :class="[
                'megamenu__item',
                {'megamenu__item--with-submenu': link.children}
            ]"
        >
            <AppLink v-if="link.title" :to="link.url">
                {{ link.title }}
            </AppLink>
            <MegamenuLinks v-if="link.children" :links="link.children" :level="level + 1" />
        </li>
    </ul>
</template>

<script setup lang="ts">
import type { INestedLink } from '~/interfaces/menus/link'

withDefaults(defineProps<{
    links?: INestedLink[]
    level?: number
}>(), {
    links: () => [],
    level: 0
})
</script>
