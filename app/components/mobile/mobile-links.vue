<template>
    <ul :class="`mobile-links mobile-links--level--${level}`">
        <template v-for="(link, index) in links" :key="index">
            <li v-if="link.type === 'divider'" class="mobile-links__divider" />
            <li
                v-else
                :class="['mobile-links__item', openStates[index] ? 'mobile-links__item--open' : '']"
            >
                <div class="mobile-links__item-title">
                    <AppLink
                        v-if="link.type === 'link' && link.url"
                        :to="'/shop/'+link.url"
                        class="mobile-links__item-link"
                        @click="onItemClick(link)"
                    >
                        {{ link.title }}
                    </AppLink>
                    <span
                        v-else-if="link.type === 'link'"
                        class="mobile-links__item-link"
                    >
                        {{ link.title }}
                    </span>

                    <button
                        v-if="link.type === 'button'"
                        type="button"
                        class="mobile-links__item-link"
                        @click="onItemClick(link)"
                    >
                        {{ link.title }}
                    </button>

                    <button
                        v-if="link.children && link.children.length > 0"
                        class="mobile-links__item-toggle"
                        type="button"
                        @click="toggleItem(index)"
                    >
                        <ArrowRoundedDown12x7Svg class="mobile-links__item-arrow" />
                    </button>
                </div>
                <div
                    v-if="link.children && link.children.length > 0"
                    class="mobile-links__item-sub-links"
                >
                    <MobileLinks :links="link.children" :level="level + 1" @itemClick="onItemClick" />
                </div>
            </li>
        </template>
    </ul>
</template>

<script setup lang="ts">
import { ref } from 'vue'
import { useMobileMenuStore } from '~/stores/mobileMenu'
import ArrowRoundedDown12x7Svg from '~/svg/arrow-rounded-down-12x7.svg'

const props = withDefaults(defineProps<{
    level?: number
    links?: any[]
}>(), {
    level: 0,
    links: () => []
})

const emit = defineEmits<{
    itemClick: [item: any]
}>()

const mobileMenuStore = useMobileMenuStore()
const openStates = ref<Record<number, boolean>>({})

function toggleItem(index: number) {
    openStates.value[index] = !openStates.value[index]
}

function onItemClick(item: any) {
    mobileMenuStore.close()
}
</script>
