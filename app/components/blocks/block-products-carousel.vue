<template>
    <div
        :class="[
            'block block-products-carousel',
            {
                'block-products-carousel--loading': loading,
                'block-products-carousel--has-items': columns.length > 0,
            }
        ]"
        :data-layout="layout"
        :data-mobile-grid-columns="mobileGridColumns"
    >
        <div :class="{container: !withSidebar}">
            <BlockHeader
                :title="title"
                :groups="groups"
                arrows
                @next="handleNextClick"
                @prev="handlePrevClick"
                @group-click="$emit('groupClick', $event)"
            />

            <div class="block-products-carousel__slider">
                <div class="block-products-carousel__preloader" />

                <Carousel ref="carousel" :options="carouselOptions">
                    <CarouselSlide v-for="(column, index) in columns" :key="index">
                        <div class="block-products-carousel__column">
                            <div v-for="product in column" :key="product.id" class="block-products-carousel__cell">
                                <ProductCard :product="product" />
                            </div>
                        </div>
                    </CarouselSlide>
                </Carousel>
            </div>
        </div>
    </div>
</template>

<script setup lang="ts">
import { ref, watch, computed, onUpdated } from 'vue'
type SwiperOptions = Record<string, any>
import type { IProduct } from '~/interfaces/product'
import type { BlockHeaderGroup } from '~/interfaces/components'

type BlockProductsCarouselLayout = 'grid-4' | 'grid-4-sm' | 'grid-5' | 'horizontal';
type BlockProductsCarouselMobileGridColumns = 1 | 2;

function buildColumns(rows: number, products: any[]): any[][] {
    const columns: any[] = []
    if (rows > 0) {
        const productsQueue = products.slice()
        while (productsQueue.length > 0) {
            columns.push(productsQueue.splice(0, rows))
        }
    }
    return columns
}

const carouselOptionsBase: SwiperOptions = {
    autoplay: {
        delay: 5000
    },
    pagination: {},
    roundLengths: true
}
const carouselOptionsByLayout: Record<string, SwiperOptions> = {
    'grid-4': {
        breakpoints: {
            1200: { slidesPerView: 4, spaceBetween: 14 },
            992: { slidesPerView: 4, spaceBetween: 10 },
            768: { slidesPerView: 3, spaceBetween: 10 }
        }
    },
    'grid-4-sm': {
        breakpoints: {
            1200: { slidesPerView: 4, spaceBetween: 14 },
            992: { slidesPerView: 3, spaceBetween: 10 },
            768: { slidesPerView: 3, spaceBetween: 10 }
        }
    },
    'grid-5': {
        breakpoints: {
            1200: { slidesPerView: 5, spaceBetween: 12 },
            992: { slidesPerView: 4, spaceBetween: 10 },
            768: { slidesPerView: 3, spaceBetween: 10 }
        }
    },
    horizontal: {
        breakpoints: {
            1200: { slidesPerView: 3, spaceBetween: 14 },
            992: { slidesPerView: 3, spaceBetween: 10 },
            768: { slidesPerView: 2, spaceBetween: 10 },
            576: { slidesPerView: 1 },
            475: { slidesPerView: 1 },
            0: { slidesPerView: 1 }
        }
    }
}
const carouselBreakpointsByMobileGridColumns: Record<number, SwiperOptions['breakpoints']> = {
    1: {
        475: { slidesPerView: 2, spaceBetween: 10 },
        0: { slidesPerView: 1, spaceBetween: 14 }
    },
    2: {
        420: { slidesPerView: 2, spaceBetween: 10 },
        320: { slidesPerView: 2, spaceBetween: 0 },
        0: { slidesPerView: 1, spaceBetween: 0 }
    }
}

const props = withDefaults(defineProps<{
    title: string
    layout?: BlockProductsCarouselLayout
    mobileGridColumns?: BlockProductsCarouselMobileGridColumns
    rows?: number
    products?: IProduct[]
    groups?: BlockHeaderGroup[]
    withSidebar?: boolean
    loading?: boolean
}>(), {
    layout: 'grid-4',
    mobileGridColumns: 1,
    rows: 1,
    products: () => [],
    groups: () => [],
    withSidebar: false,
    loading: false
})

const emit = defineEmits<{
    groupClick: [event: any]
}>()

const carousel = ref<any>(null)
const columns = ref<IProduct[][]>(buildColumns(props.rows, props.products))
const updateCarousel = ref(false)

const carouselOptions = computed<SwiperOptions>(() => {
    const swiperOptions = Object.assign(
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

watch([() => props.rows, () => props.products], () => {
    columns.value = buildColumns(props.rows, props.products)
    updateCarousel.value = true
})

onUpdated(() => {
    if (updateCarousel.value) {
        updateCarousel.value = false
        carousel.value?.swiper?.update()
    }
})

function handleNextClick() {
    carousel.value?.swiper?.slideNext()
}

function handlePrevClick() {
    carousel.value?.swiper?.slidePrev()
}
</script>
