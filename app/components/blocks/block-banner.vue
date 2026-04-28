<template>
    <div class="block block-banner">
        <div class="container">
            <AppLink :to="data.url" class="block-banner__body">
                <div
                    class="block-banner__image block-banner__image--desktop" style="z-index: 0;"
                    :style="{ backgroundImage: getBackgroundImage(data.img) }"
                />
                <div
                    class="block-banner__image block-banner__image--mobile"
                    :style="{ backgroundImage: getBackgroundImage(data.mobile || data.img) }"
                />
                <div class="block-banner__title text-white">

                    <br class="block-banner__mobile-br">

                </div>
                <div class="block-banner__text text-white">

                </div>
                <div class="block-banner__button">
                    <span class="btn btn-sm btn-primary">Compre Agora</span>
                </div>
            </AppLink>
        </div>
    </div>
</template>

<script setup lang="ts">
const url = useUrl()

defineProps<{
    data: any
}>()

function getBackgroundImage(imagePath?: string) {
    return imagePath ? `url(${url.img(imagePath)})` : 'none'
}
</script>
