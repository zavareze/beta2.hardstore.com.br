<script setup lang="ts">
import { useAccountStore } from '~/stores/account'

const props = defineProps<{ to: string }>()
const url = useUrl()
const account = useAccountStore()

const isExternal = computed(() => url.isExternal(props.to))
const resolvedTo = computed(() => {
    if (isExternal.value) return props.to
    if (url.isSecure(props.to) && !account.logged) return '/account/login'
    return url.lang(props.to)
})
</script>

<template>
    <a v-if="isExternal" :href="resolvedTo"><slot /></a>
    <NuxtLink v-else :to="resolvedTo"><slot /></NuxtLink>
</template>
