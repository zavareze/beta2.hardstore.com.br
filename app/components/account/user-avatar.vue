<template>
    <div
        class="user-avatar"
        :style="{ width: size + 'px', height: size + 'px' }"
    >
        <img v-if="src" :src="src" :alt="name" class="user-avatar__img" @error="imgError = true" v-show="!imgError">
        <div
            v-if="!src || imgError"
            class="user-avatar__initials"
            :style="{ background: bgColor, fontSize: Math.round(size / 2.5) + 'px' }"
        >
            {{ initials }}
        </div>
    </div>
</template>

<script setup lang="ts">
import { computed, ref, watch } from 'vue'

const props = withDefaults(defineProps<{
    src?: string
    name?: string
    size?: number
}>(), {
    src: '',
    name: '',
    size: 80
})

const imgError = ref(false)
watch(() => props.src, () => { imgError.value = false })

const initials = computed(() => {
    const parts = (props.name || '').trim().split(/\s+/).filter(Boolean)
    if (parts.length === 0) return '?'
    if (parts.length === 1) return parts[0].charAt(0).toUpperCase()
    return (parts[0].charAt(0) + parts[parts.length - 1].charAt(0)).toUpperCase()
})

const bgColor = computed(() => {
    const name = (props.name || '').trim()
    if (!name) return '#9ca3af'
    let hash = 0
    for (let i = 0; i < name.length; i++) hash = (hash * 31 + name.charCodeAt(i)) | 0
    const hue = Math.abs(hash) % 360
    return `hsl(${hue}, 45%, 45%)`
})
</script>

<style scoped>
.user-avatar {
    position: relative;
    border-radius: 50%;
    overflow: hidden;
    flex-shrink: 0;
    background: #e5e7eb;
}
.user-avatar__img {
    width: 100%;
    height: 100%;
    object-fit: cover;
    display: block;
}
.user-avatar__initials {
    width: 100%;
    height: 100%;
    display: flex;
    align-items: center;
    justify-content: center;
    color: #fff;
    font-weight: 600;
    letter-spacing: 0.5px;
    user-select: none;
}
</style>
