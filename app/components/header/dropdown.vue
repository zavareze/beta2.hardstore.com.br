<template>
    <div :class="['topbar-dropdown', {'topbar-dropdown--opened': show}]">
        <button class="topbar-dropdown__btn" type="button" @click="toggleDropdown()">
            <slot />
            <ArrowRoundedDown7x5Svg />
        </button>

        <div class="topbar-dropdown__body">
            <Menu layout="topbar" :with-icons="withIcons" :items="items" @itemClick="onItemClick" />
        </div>
    </div>
</template>

<script setup lang="ts">
import { ref, onMounted, onBeforeUnmount } from 'vue'
import type { INestedLink } from '~/interfaces/menus/link'
import ArrowRoundedDown7x5Svg from '~/svg/arrow-rounded-down-7x5.svg'

const props = withDefaults(defineProps<{
    withIcons?: boolean
    items?: INestedLink[]
}>(), {
    withIcons: false,
    items: () => []
})

const emit = defineEmits<{
    itemClick: [item: INestedLink]
}>()

const show = ref(false)
const teardown: Array<() => void> = []

onMounted(() => {
    const onGlobalClick = (event: MouseEvent) => {
        if (show.value && event.target instanceof Node) {
            // We need to check against the component element
        }
    }
    document.addEventListener('click', onGlobalClick)
    teardown.push(() => {
        document.removeEventListener('click', onGlobalClick)
    })
})

onBeforeUnmount(() => {
    teardown.forEach(x => x())
})

function onItemClick(item: INestedLink) {
    emit('itemClick', item)
    show.value = false
}

function toggleDropdown() {
    show.value = !show.value
}
</script>
