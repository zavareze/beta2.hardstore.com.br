<template>
    <div
        :class="[
            'block block-sidebar',
            {
                'block-sidebar--open': isOpen,
                'block-sidebar--offcanvas--always': offcanvas === 'always',
                'block-sidebar--offcanvas--mobile': offcanvas === 'mobile',
            }
        ]"
    >
        <div ref="backdrop" class="block-sidebar__backdrop" @click="emit('closeSidebar')" />
        <div ref="body" class="block-sidebar__body">
            <div class="block-sidebar__header">
                <div class="block-sidebar__title">
                    Filtros
                </div>
                <button class="block-sidebar__close" type="button" @click="emit('closeSidebar')">
                    <Cross20Svg />
                </button>
            </div>

            <slot />
        </div>
    </div>
</template>

<script setup lang="ts">
import { ref, watch, onMounted, onBeforeUnmount } from 'vue'
import Cross20Svg from '~/svg/cross-20.svg'

export type CategorySidebarOffcanvas = 'always' | 'mobile';

const props = withDefaults(defineProps<{
    isOpen?: boolean
    offcanvas?: CategorySidebarOffcanvas
}>(), {
    isOpen: false,
    offcanvas: 'mobile',
})

const emit = defineEmits<{ closeSidebar: [] }>()

const backdrop = ref<HTMLElement | null>(null)
const body = ref<HTMLElement | null>(null)
const teardown: Array<() => void> = []
let media: MediaQueryList

watch(() => props.isOpen, (newValue: boolean) => {
    if (newValue) {
        const width = document.body.clientWidth
        document.body.style.overflow = 'hidden'
        document.body.style.paddingRight = `${document.body.clientWidth - width}px`
    } else {
        document.body.style.overflow = ''
        document.body.style.paddingRight = ''
    }
})

function onMediaChange () {
    if (props.offcanvas === 'mobile') {
        if (props.isOpen && !media.matches) {
            emit('closeSidebar')
        }
        // this is necessary to avoid the transition hiding the sidebar
        if (!props.isOpen && media.matches && backdrop.value && body.value) {
            const backdropEl = backdrop.value
            const bodyEl = body.value

            backdropEl.style.transition = 'none'
            bodyEl.style.transition = 'none'

            backdropEl.getBoundingClientRect() // force reflow

            backdropEl.style.transition = ''
            bodyEl.style.transition = ''
        }
    }
}

onMounted(() => {
    media = matchMedia('(max-width: 991px)')

    if (media.addEventListener) {
        media.addEventListener('change', onMediaChange)
    } else {
        // noinspection JSDeprecatedSymbols
        media.addListener(onMediaChange)
    }

    teardown.push(() => {
        if (media.removeEventListener) {
            media.removeEventListener('change', onMediaChange)
        } else {
            // noinspection JSDeprecatedSymbols
            media.removeListener(onMediaChange)
        }
    })
})

onBeforeUnmount(() => {
    teardown.forEach(x => x())
})
</script>
