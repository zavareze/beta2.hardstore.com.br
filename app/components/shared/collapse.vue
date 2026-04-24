<script setup lang="ts">
let uniqueId = 0

const props = defineProps<{
    isOpen?: boolean
    itemOpenClass?: string
}>()

const id = ++uniqueId
const stateIsOpen = ref(props.isOpen ?? false)

watch(() => props.isOpen, (val) => { val ? open() : close() })

const itemClasses = computed(() =>
    `${stateIsOpen.value ? (props.itemOpenClass || '') : ''} collapse-item-${id}`
)
const contentClasses = computed(() => `collapse-content-${id}`)

function getItem() { return document.querySelector<HTMLElement>(`.collapse-item-${id}`) }
function getContent() { return document.querySelector<HTMLElement>(`.collapse-content-${id}`) }

function open() {
    stateIsOpen.value = true
    const item = getItem(); const content = getContent()
    if (!item || !content) return
    const startH = content.getBoundingClientRect().height
    item.classList.add(props.itemOpenClass || '')
    const endH = content.getBoundingClientRect().height
    content.style.height = `${startH}px`
    content.getBoundingClientRect()
    content.style.height = `${endH}px`
}

function close() {
    stateIsOpen.value = false
    const item = getItem(); const content = getContent()
    if (!item || !content) return
    const startH = content.getBoundingClientRect().height
    content.style.height = `${startH}px`
    item.classList.remove(props.itemOpenClass || '')
    content.getBoundingClientRect()
    content.style.height = ''
}

function toggle() { stateIsOpen.value ? close() : open() }

onMounted(() => {
    const content = getContent()
    if (content) {
        content.addEventListener('transitionend', (e: TransitionEvent) => {
            if (e.propertyName === 'height') content.style.height = ''
        })
    }
})
</script>

<template>
    <slot
        :item-classes="itemClasses"
        :content-classes="contentClasses"
        :toggle="toggle"
    />
</template>
