<template>
    <div :class="[$attrs.class, 'social-links', `social-links--shape--${shape}`]">
        <ul class="social-links__list">
            <li class="social-links__item">
                <a class="social-links__link social-links__link--type--youtube"
                   href="https://www.youtube.com/channel/UCRlekZxyrN0v1h3blYMJ9Zw" target="_blank">
                    <i class="fab fa-youtube" />
                </a>
            </li>
            <li v-for="item in items" :key="item.type" class="social-links__item">
                <a :class="['social-links__link', `social-links__link--type--${item.type}`]"
                   :href="item.url" target="_blank">
                    <i :class="item.icon" />
                </a>
            </li>
        </ul>
    </div>
</template>

<script setup lang="ts">
defineProps<{ shape?: string }>()

const items = [
    { type: 'facebook', icon: 'fab fa-facebook-f', url: 'https://www.facebook.com/hardstore' },
    { type: 'twitter', icon: 'fab fa-twitter', url: 'https://twitter.com/hardstore' },
    { type: 'instagram', icon: 'fab fa-instagram', url: 'https://www.instagram.com/hardstoreinf/' }
]
</script>
