<template>
    <div :class="[$attrs.class, 'social-links', `social-links--shape--${shape}`]">
        <ul class="social-links__list">
            <li class="social-links__item">
                <a class="social-links__link social-links__link--type--youtube"
                   href="https://www.youtube.com/channel/UCRlekZxyrN0v1h3blYMJ9Zw" target="_blank">
                    <svg class="social-links__icon" viewBox="0 0 24 24" aria-hidden="true">
                        <path d="M23.5 6.2a3 3 0 0 0-2.1-2.1C19.5 3.6 12 3.6 12 3.6s-7.5 0-9.4.5A3 3 0 0 0 .5 6.2C0 8.1 0 12 0 12s0 3.9.5 5.8a3 3 0 0 0 2.1 2.1c1.9.5 9.4.5 9.4.5s7.5 0 9.4-.5a3 3 0 0 0 2.1-2.1c.5-1.9.5-5.8.5-5.8s0-3.9-.5-5.8zM9.6 15.6V8.4l6.3 3.6-6.3 3.6z" />
                    </svg>
                </a>
            </li>
            <li v-for="item in items" :key="item.type" class="social-links__item">
                <a :class="['social-links__link', `social-links__link--type--${item.type}`]"
                   :href="item.url" target="_blank">
                    <svg class="social-links__icon" viewBox="0 0 24 24" aria-hidden="true">
                        <path :d="item.path" />
                    </svg>
                </a>
            </li>
        </ul>
    </div>
</template>

<script setup lang="ts">
defineProps<{ shape?: string }>()

const items = [
    { type: 'facebook', path: 'M22.7 12.1C22.7 6.2 17.9 1.4 12 1.4S1.3 6.2 1.3 12.1c0 5.3 3.9 9.7 9 10.5v-7.4H7.6v-3.1h2.7V9.8c0-2.7 1.6-4.1 4-4.1 1.2 0 2.4.2 2.4.2v2.6h-1.3c-1.3 0-1.7.8-1.7 1.6v2h2.9l-.5 3.1h-2.4v7.4c5.1-.8 9-5.2 9-10.5z', url: 'https://www.facebook.com/hardstore' },
    { type: 'twitter', path: 'M21.5 7.1v.6c0 6.5-5 14-14 14-2.8 0-5.4-.8-7.5-2.2h1.2c2.3 0 4.4-.8 6.1-2.1-2.2 0-4-1.5-4.6-3.4.3.1.6.1.9.1.4 0 .9-.1 1.3-.2-2.3-.5-4-2.5-4-4.8V9c.7.4 1.4.6 2.3.6A4.9 4.9 0 0 1 1 5.5c0-.9.2-1.8.7-2.5 2.5 3 6.2 5 10.4 5.2-.1-.4-.1-.8-.1-1.1 0-2.7 2.2-4.9 4.9-4.9 1.4 0 2.7.6 3.6 1.6 1.1-.2 2.2-.6 3.1-1.2-.4 1.2-1.2 2.1-2.2 2.7 1-.1 1.9-.4 2.8-.8-.7 1-1.5 1.8-2.7 2.6z', url: 'https://twitter.com/hardstore' },
    { type: 'instagram', path: 'M12 2.2h4.8c1.3.1 2.2.3 3 .6.8.3 1.5.8 2.1 1.4.6.6 1.1 1.3 1.4 2.1.3.8.5 1.7.6 3V14.1c-.1 1.3-.3 2.2-.6 3-.3.8-.8 1.5-1.4 2.1-.6.6-1.3 1.1-2.1 1.4-.8.3-1.7.5-3 .6H7.2c-1.3-.1-2.2-.3-3-.6-.8-.3-1.5-.8-2.1-1.4-.6-.6-1.1-1.3-1.4-2.1-.3-.8-.5-1.7-.6-3V9.3c.1-1.3.3-2.2.6-3 .3-.8.8-1.5 1.4-2.1.6-.6 1.3-1.1 2.1-1.4.8-.3 1.7-.5 3-.6H12zm0 1.8H7.3c-1.2.1-1.8.3-2.3.5-.6.2-1 .5-1.4.9-.4.4-.7.8-.9 1.4-.2.5-.4 1.1-.5 2.3v4.7c.1 1.2.3 1.8.5 2.3.2.6.5 1 .9 1.4.4.4.8.7 1.4.9.5.2 1.1.4 2.3.5h9.4c1.2-.1 1.8-.3 2.3-.5.6-.2 1-.5 1.4-.9.4-.4.7-.8.9-1.4.2-.5.4-1.1.5-2.3V9.1c-.1-1.2-.3-1.8-.5-2.3-.2-.6-.5-1-.9-1.4-.4-.4-.8-.7-1.4-.9-.5-.2-1.1-.4-2.3-.5H12zm0 3.2a4.8 4.8 0 1 1 0 9.6 4.8 4.8 0 0 1 0-9.6zm0 1.8a3 3 0 1 0 0 6 3 3 0 0 0 0-6zm5-2.8a1.1 1.1 0 1 1 0 2.2 1.1 1.1 0 0 1 0-2.2z', url: 'https://www.instagram.com/hardstoreinf/' }
]
</script>
