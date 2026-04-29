<template>
    <!-- .block-slideshow -->
    <div
        ref="el"
        :class="['block-slideshow', `block-slideshow--layout--${layout}`, 'block']"
    >
        <div class="container">
            <div class="row">
                <div v-if="layout === 'with-departments'" class="col-lg-3 d-none d-lg-block" />
                <div :class="['col-12', { 'col-lg-9': layout === 'with-departments' }]">
                    <div class="block-slideshow__body">
                        <Carousel :options="{
                            grabCursor: true,
                            loop: true,
                            autoplay: {
                                delay: 5000,
                                disableOnInteraction: false,
                                pauseOnMouseEnter: true,
                            },
                            pagination: {
                                type: 'progressbar',
                            },
                            speed: 600,
                            roundLengths: true,
                        }">
                            <CarouselSlide v-for="(slide, index) in slides" :key="index">
                                <AppLink class="block-slideshow__slide" :to="slide.url">
                                    <div
                                        class="block-slideshow__slide-image block-slideshow__slide-image--desktop"
                                        :style="{ backgroundImage: getDesktopImage(slide) }"
                                    />
                                    <div
                                        class="block-slideshow__slide-image block-slideshow__slide-image--mobile"
                                        :style="{ backgroundImage: getMobileImage(slide) }"
                                    />
                                </AppLink>
                            </CarouselSlide>
                        </Carousel>
                    </div>
                </div>
            </div>
        </div>
    </div>
    <!-- .block-slideshow / end -->
</template>

<script setup lang="ts">
import { ref, onMounted, onBeforeUnmount } from 'vue'
import departments from '~/services/departments'

type BlockSlideshowLayout = 'full' | 'with-departments'

interface Slide {
    title: string
    colorTitle?: string
    text: string
    colorText?: string
    imageClassic: string
    imageFull: string
    imageMobile: string
    url: string
}

const props = withDefaults(defineProps<{
    layout?: BlockSlideshowLayout
}>(), {
    layout: 'full'
})

const url = useUrl()
const el = ref<HTMLElement | null>(null)

const slides: Slide[] = [
    {
        title: ' ', text: ' ',
        imageClassic: '/images/banners/banner-promo-natal.png',
        imageFull: '/images/banners/banner-promo-natal.png',
        imageMobile: '',
        url: '/shop/promocao?sort=recents_desc'
    },
    {
        title: ' ', text: ' ',
        imageClassic: '/images/banners/banner-promo-roku.png',
        imageFull: '/images/banners/banner-promo-roku.png',
        imageMobile: '',
        url: `${url.catalog()}?filter_search=roku`
    },
    {
        title: ' ', text: ' ',
        imageClassic: '/images/banners/baly.png',
        imageFull: '/images/banners/baly.png',
        imageMobile: '',
        url: `${url.catalog()}?filter_search=redragon`
    },
    {
        title: ' ', text: ' ',
        imageClassic: '/images/banners/manu.jpeg',
        imageFull: '/images/banners/manu.jpeg',
        imageMobile: '',
        url: url.catalog()
    },
]

onMounted(() => { if (el.value) departments.set(el.value) })
onBeforeUnmount(() => { departments.set(null) })

function getDesktopImage(slide: Slide): string {
    const imgUrl = props.layout === 'with-departments' ? slide.imageClassic : slide.imageFull
    return `url(${url.img(imgUrl)})`
}

function getMobileImage(slide: Slide): string {
    return `url(${url.img(slide.imageMobile || (props.layout === 'with-departments' ? slide.imageClassic : slide.imageFull))})`
}
</script>
