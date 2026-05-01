<template>
    <ul class="pagination justify-content-center">
        <li :class="['page-item', {'disabled': current <= 1}]">
            <button
                type="button"
                class="page-link page-link--with-arrow"
                aria-label="Previous"
                @click="setPage(current - 1)"
            >
                <ArrowRoundedLeft8x13Svg class="page-link__arrow page-link__arrow--left" aria-hidden="true" />
            </button>
        </li>

        <li v-for="page in pages" :key="page" :class="['page-item', {active: page === current}]">
            <button type="button" class="page-link" @click="setPage(page)">
                {{ page }}
                <span v-if="page === current" class="sr-only">(atual)</span>
            </button>
        </li>
        <li :class="['page-item', {'disabled': current >= total}]">
            <button
                type="button"
                class="page-link page-link--with-arrow"
                aria-label="Next"
                @click="setPage(current + 1)"
            >
                <ArrowRoundedRight8x13Svg class="page-link__arrow page-link__arrow--right" aria-hidden="true" />
            </button>
        </li>
    </ul>
</template>

<script setup lang="ts">
import { computed } from 'vue'
import ArrowRoundedLeft8x13Svg from '~/svg/arrow-rounded-left-8x13.svg'
import ArrowRoundedRight8x13Svg from '~/svg/arrow-rounded-right-8x13.svg'

const props = withDefaults(defineProps<{
    siblings?: number
    current?: number
    total?: number
}>(), {
    siblings: 1,
    current: 1,
    total: 1
})

const emit = defineEmits<{
    'page-change': [value: number]
}>()

const pages = computed(() => {
    const pagesArr: number[] = []
    const min = Math.max(
        1,
        props.current - props.siblings - Math.max(
            0,
            props.siblings - props.total + props.current
        )
    )
    const max = Math.min(props.total, min + props.siblings * 2)

    for (let i = min; i <= max; i += 1) {
        pagesArr.push(i)
    }

    return pagesArr
})

function setPage(value: number) {
    if (value < 1 || value > props.total || value === props.current) {
        return
    }
    emit('page-change', value)
}
</script>
