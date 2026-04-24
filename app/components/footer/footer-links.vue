<template>
    <div class="site-footer__widget footer-links">
        <h5 class="footer-links__title">
            {{ title }}
        </h5>
        <ul class="footer-links__list">
            <li v-for="(link, i) in links" :key="i" class="footer-links__item">
                <a :to="link.url" class="footer-links__link">
                    {{ link.title }}
                </a>
            </li>
        </ul>
    </div>
</template>

<script setup lang="ts">
withDefaults(defineProps<{
    title?: string
    links?: any[]
}>(), {
    title: '',
    links: () => []
})
</script>
