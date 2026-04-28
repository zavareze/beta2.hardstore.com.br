<template>
    <div
        ref="indicatorElement"
        :class="[
            'indicator',
            `indicator--trigger--${trigger}`,
            {
                'indicator--mobile': location === 'mobile-header',
                'indicator--hover': isHovered,
                'indicator--display': isDisplay,
                'indicator--open': isOpen,
            }
        ]"
        @mouseenter="onMouseEnter"
        @mouseleave="onMouseLeave"
    >
        <AppLink v-if="to && trigger !== 'click'" :to="to" class="indicator__button" @click="onClick">
            <span class="indicator__area">
                <slot name="icon" />
                <span v-if="value !== null" class="indicator__value">{{ value }}</span>
            </span>
        </AppLink>
        <a v-if="to && trigger === 'click'" :href="to" class="indicator__button" @click="onClick">
            <span class="indicator__area">
                <slot name="icon" />
                <span v-if="value !== null" class="indicator__value">{{ value }}</span>
            </span>
        </a>
        <button v-if="!to" type="button" class="indicator__button" @click="onClick">
            <span class="indicator__area">
                <slot name="icon" />
                <span v-if="value !== null" class="indicator__value">{{ value }}</span>
            </span>
        </button>
        <div v-if="$slots.default" ref="dropdownElement" class="indicator__dropdown">
            <slot />
        </div>
    </div>
</template>

<script setup lang="ts">
import { ref, onMounted, onBeforeUnmount } from 'vue'

type Trigger = 'none' | 'click' | 'hover'
type Location = 'nav-panel' | 'mobile-header'

const props = withDefaults(defineProps<{
    value?: number | null
    to?: string
    trigger?: Trigger
    location?: Location
    closeDelayOnMouseLeave?: number
}>(), {
    value: null,
    to: '',
    trigger: 'none',
    location: 'nav-panel',
    closeDelayOnMouseLeave: 0
})

const emit = defineEmits<{
    buttonClick: []
    open: []
    close: []
}>()

const indicatorElement = ref<HTMLElement | undefined>(undefined)
const dropdownElement = ref<HTMLElement | undefined>(undefined)
const isDisplay = ref(false)
const isOpen = ref(false)
const isHovered = ref(false)
let closeTimer: ReturnType<typeof setTimeout> | null = null

onMounted(() => {
    if (dropdownElement.value) {
        dropdownElement.value.addEventListener('transitionend', onTransitionEnd)
    }
    document.addEventListener('click', onGlobalClick)
})

onBeforeUnmount(() => {
    clearCloseTimer()
    if (dropdownElement.value) {
        dropdownElement.value.removeEventListener('transitionend', onTransitionEnd)
    }
    document.removeEventListener('click', onGlobalClick)
})

function onMouseEnter() {
    clearCloseTimer()
    isHovered.value = true
    if (props.trigger === 'hover' && dropdownElement.value) {
        open()
    }
}

function onMouseLeave() {
    isHovered.value = false
    if (props.trigger === 'hover' && dropdownElement.value) {
        close()
        return
    }
    if (props.closeDelayOnMouseLeave > 0 && isOpen.value) {
        closeTimer = setTimeout(() => {
            close()
            closeTimer = null
        }, props.closeDelayOnMouseLeave)
    }
}

function onClick(event: MouseEvent) {
    emit('buttonClick')
    if (props.trigger !== 'click') {
        return
    }
    if (event.cancelable) {
        event.preventDefault()
    }
    toggle()
}

function onGlobalClick(event: MouseEvent) {
    if (props.trigger !== 'click' || !isOpen.value) {
        return
    }

    const target = event.target as Node | null
    if (target && indicatorElement.value?.contains(target)) {
        return
    }

    close()
}

function onTransitionEnd(event: TransitionEvent) {
    if (
        dropdownElement.value === event.target &&
        event.propertyName === 'visibility' &&
        !isOpen.value
    ) {
        isDisplay.value = false
    }
}

function toggle() {
    if (isOpen.value) {
        close()
    } else {
        open()
    }
}

function open() {
    clearCloseTimer()
    isOpen.value = true
    isDisplay.value = true
    if (!dropdownElement.value) {
        return
    }
    const dropdownTop = dropdownElement.value.getBoundingClientRect().top
    const viewportHeight = window.innerHeight
    const paddingBottom = 20
    dropdownElement.value.style.maxHeight = `${viewportHeight - dropdownTop - paddingBottom}px`
    emit('open')
}

function close(immediately = false) {
    clearCloseTimer()
    isOpen.value = false
    if (immediately) {
        isDisplay.value = false
    }
    emit('close')
}

function clearCloseTimer() {
    if (closeTimer) {
        clearTimeout(closeTimer)
        closeTimer = null
    }
}

defineExpose({ open, close, toggle })
</script>
