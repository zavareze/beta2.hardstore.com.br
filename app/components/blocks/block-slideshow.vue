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
                        <ClientOnly>
                            <Carousel :options="carouselOptions">
                                <CarouselSlide v-for="(slide, index) in slidesToRender" :key="index">
                                    <AppLink class="block-slideshow__slide" :to="slide.url" :aria-label="slide.title || 'Ver oferta'">
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
                            <template #fallback>
                                <div v-if="slidesToRender[0]" style="height: 100%;">
                                    <AppLink class="block-slideshow__slide" :to="slidesToRender[0].url" :aria-label="slidesToRender[0].title || 'Ver oferta'" style="height: 100%;">
                                        <div
                                            class="block-slideshow__slide-image block-slideshow__slide-image--desktop"
                                            :style="{ backgroundImage: getDesktopImage(slidesToRender[0]) }"
                                        />
                                        <div
                                            class="block-slideshow__slide-image block-slideshow__slide-image--mobile"
                                            :style="{ backgroundImage: getMobileImage(slidesToRender[0]) }"
                                        />
                                    </AppLink>
                                </div>
                            </template>
                        </ClientOnly>
                    </div>
                </div>
            </div>
        </div>
    </div>
    <!-- .block-slideshow / end -->
</template>

<script setup lang="ts">
import { computed, ref, onMounted, onBeforeUnmount } from 'vue'
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
    slidesData?: Slide[]
}>(), {
    layout: 'full',
    slidesData: () => []
})

const url = useUrl()
const el = ref<HTMLElement | null>(null)

const slidesToRender = computed(() => {
    return props.slidesData && props.slidesData.length > 0 ? props.slidesData : []
})

useHead(() => {
    const firstSlide = slidesToRender.value[0]
    if (!firstSlide) {
        return {}
    }

    const desktopImage = url.img(props.layout === 'with-departments' ? firstSlide.imageClassic : firstSlide.imageFull)
    const mobileImage = url.img(firstSlide.imageMobile || (props.layout === 'with-departments' ? firstSlide.imageClassic : firstSlide.imageFull))

    return {
        link: [
            { rel: 'preload', as: 'image', href: desktopImage, media: '(min-width: 576px)', fetchpriority: 'high' },
            { rel: 'preload', as: 'image', href: mobileImage, media: '(max-width: 575.98px)', fetchpriority: 'high' }
        ]
    }
})

const carouselOptions = computed(() => ({
    grabCursor: slidesToRender.value.length > 1,
    loop: slidesToRender.value.length > 1,
    pagination: { clickable: slidesToRender.value.length > 1 },
    autoplay: slidesToRender.value.length > 1
        ? {
            delay: 5000,
            disableOnInteraction: false,
            pauseOnMouseEnter: false
        }
        : false,
    speed: 600
}))

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
