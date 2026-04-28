<template>
    <div class="block block-posts" :data-layout="layout" :data-mobile-columns="mobileGridColumns">
        <div class="container">
            <BlockHeader
                arrows
                :title="title"
                @next="handleNextClick"
                @prev="handlePrevClick"
            />
            <div class="block-posts__slider">
                <Carousel ref="carousel" :options="carouselOptions">
                    <CarouselSlide v-for="(post, i) in posts" :key="i">
                        <PostCard :post="post" />
                    </CarouselSlide>
                </Carousel>
            </div>
        </div>
    </div>
</template>

<script setup lang="ts">
import { ref, onMounted, computed } from 'vue'
import type { SwiperOptions } from 'swiper/types'

type BlockPostsLayout = 'list' | 'grid-3' | 'grid-4';
type BlockPostsMobileGridColumns = 1 | 2;

const carouselOptionsBase: SwiperOptions = {
    autoplay: {
        delay: 5000
    },
    speed: 550,
    pagination: {
        clickable: true
    },
    roundLengths: true
}
const carouselOptionsByLayout: Record<string, SwiperOptions> = {
    list: {
        breakpoints: {
            0: { slidesPerView: 2 },
            992: { slidesPerView: 2 }
        }
    },
    'grid-3': {
        breakpoints: {
            768: { slidesPerView: 2 },
            992: { slidesPerView: 3 }
        }
    },
    'grid-4': {
        breakpoints: {
            460: { slidesPerView: 2, spaceBetween: 20 },
            768: { slidesPerView: 2, spaceBetween: 20 },
            992: { slidesPerView: 3, spaceBetween: 24 },
            1200: { slidesPerView: 4, spaceBetween: 20 }
        }
    }
}
const carouselBreakpointsByMobileGridColumns: Record<number, SwiperOptions['breakpoints']> = {
    1: {
        0: { slidesPerView: 1 },
        460: { slidesPerView: 2 }
    },
    2: {
        460: { slidesPerView: 2, spaceBetween: 20 },
        400: { slidesPerView: 2, spaceBetween: 16 },
        320: { slidesPerView: 2, spaceBetween: 12 }
    }
}

const props = withDefaults(defineProps<{
    title: string
    layout?: BlockPostsLayout
    mobileGridColumns?: BlockPostsMobileGridColumns
    posts?: any[]
}>(), {
    layout: 'list',
    mobileGridColumns: 1,
    posts: () => []
})

const carousel = ref<any>(null)

const carouselOptions = computed<SwiperOptions>(() => {
    const swiperOptions: SwiperOptions = Object.assign(
        {},
        carouselOptionsBase,
        carouselOptionsByLayout[props.layout]
    )
    if (props.layout.startsWith('grid-')) {
        swiperOptions.breakpoints = Object.assign(
            {},
            swiperOptions.breakpoints,
            carouselBreakpointsByMobileGridColumns[props.mobileGridColumns]
        )
    }
    return swiperOptions
})

onMounted(() => {
    setTimeout(() => {
        carousel.value?.swiper?.update()
    }, 1000)
})

function handleNextClick() {
    carousel.value?.swiper?.slideNext()
}

function handlePrevClick() {
    carousel.value?.swiper?.slidePrev()
}
</script>
