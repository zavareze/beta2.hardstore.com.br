<template>
    <!-- .megamenu -->
    <div
        :class="[
            'megamenu',
            {'megamenu--departments': location === 'departments'}
        ]"
    >
        <div
            class="megamenu__body"
            :style="bodyStyles"
        >
            <div class="row">
                <div
                    v-for="(column, index) in menu.columns"
                    :key="index"
                    :class="`col-${column.size}`"
                >
                    <MegamenuLinks :links="column.links" />
                </div>
            </div>
        </div>
    </div>
    <!-- .megamenu / end -->
</template>

<script setup lang="ts">
import { computed } from 'vue'
import type { IMegamenu } from '~/interfaces/menus/megamenu'

type Location = 'nav-panel' | 'departments';

const props = withDefaults(defineProps<{
    location?: Location
    menu?: IMegamenu | null
}>(), {
    location: 'nav-panel',
    menu: null
})

const url = useUrl()

const image = computed(() => {
    if (!props.menu || !props.menu.image) {
        return null
    }
    if (typeof props.menu.image === 'string') {
        return props.menu.image
    }
    return (props.menu.image as any)['ltr']
})

const bodyStyles = computed(() => {
    const img = image.value
    if (img) {
        return {
            backgroundImage: `url('${url.img(img)}')`
        }
    }
    return {}
})
</script>
