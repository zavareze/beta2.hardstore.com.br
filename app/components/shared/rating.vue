<template>
    <div class="rating">
        <div class="rating__body">
            <span
                v-for="star in stars"
                :key="star"
                :class="['rating__star', { 'rating__star--active': value >= star }]"
            />
        </div>
    </div>
</template>

<script setup lang="ts">
defineProps<{ value?: number }>()
const stars = [1, 2, 3, 4, 5]
</script>
