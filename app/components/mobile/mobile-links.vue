<template>
    <ul :class="`mobile-links mobile-links--level--${level}`">
        <template v-for="(link, index) in links" :key="index">
            <Collapse
                v-slot:default="{ itemClasses, contentClasses, toggle }"
                item-open-class="mobile-links__item--open"
            >
                <li
                    v-if="link.type === 'link' || link.type === 'button'"
                    :class="[
                        'mobile-links__item',
                        itemClasses
                    ]"
                >
                    <div class="mobile-links__item-title">
                        <AppLink
                            v-if="link.type === 'link'"
                            :to="'/shop/'+link.url"
                            class="mobile-links__item-link"
                            @click="onItemClick(link)"
                        >
                            {{ link.title }}
                        </AppLink>

                        <button
                            v-if="link.type === 'button'"
                            type="button"
                            class="mobile-links__item-link"
                            @click="toggle; onItemClick(link)"
                        >
                            {{ link.title }}
                        </button>

                        <button
                            v-if="link.children && link.children.length > 0"
                            class="mobile-links__item-toggle"
                            type="button"
                            @click="toggle"
                        >
                            <ArrowRoundedDown12x7Svg class="mobile-links__item-arrow" />
                        </button>
                    </div>
                    <div
                        v-if="link.children && link.children.length > 0"
                        :class="['mobile-links__item-sub-links', contentClasses]"
                    >
                        <MobileLinks :links="link.children" :level="level + 1" @itemClick="onItemClick" />
                    </div>
                </li>
            </Collapse>
            <li v-if="link.type === 'divider'" class="mobile-links__divider" />
        </template>
    </ul>
</template>

<script setup lang="ts">
import { useMobileMenuStore } from '~/stores/mobileMenu'
import ArrowRoundedDown12x7Svg from '~/svg/arrow-rounded-down-12x7.svg'

withDefaults(defineProps<{
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

function onItemClick(item: any) {
    mobileMenuStore.close()
}
</script>
