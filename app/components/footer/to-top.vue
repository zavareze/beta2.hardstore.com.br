<template>
    <div
        :class="[
            'totop',
            {'totop--show': show}
        ]"
    >
        <div class="totop__body">
            <div class="totop__start" />
            <div class="totop__container container" />
            <div class="totop__end">
                <button type="button" class="totop__button" @click="onClick">
                    <ArrowRoundedUp13x8Svg />
                </button>
            </div>
        </div>
    </div>
</template>

<script setup lang="ts">
import { ref, onMounted, onBeforeUnmount } from 'vue'
import ArrowRoundedUp13x8Svg from '~/svg/arrow-rounded-up-13x8.svg'

const show = ref(false)
const showFrom = 300

function onScroll(): void {
    show.value = window.pageYOffset >= showFrom
}

function onClick(): void {
    try {
        window.scrollTo({ top: 0, left: 0, behavior: 'smooth' })
    } catch {
        window.scrollTo(0, 0)
    }
}

onMounted(() => {
    document.addEventListener('scroll', onScroll, { passive: true })
})

onBeforeUnmount(() => {
    document.removeEventListener('scroll', onScroll)
})
</script>
