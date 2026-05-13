<template>
    <div class="block block-brands">
        <div class="container">
            <div class="block-brands__slider">
                <Carousel ref="carouselbrands" :options="carouselOptions">
                    <CarouselSlide v-for="(brand, index) in brandsFilter()" :key="index">
                        <div class="block-brands__item">
                            <!--suppress HtmlUnknownTarget -->
                            <img
                                :src="brandImageCandidates(brand)[0]"
                                :data-brand-id="brand"
                                :data-fallback-index="0"
                                loading="lazy"
                                alt=""
                                class="mx-auto"
                                style="max-height: 40px; max-width: 100px"
                                @error="onBrandImageError"
                            >
                        </div>
                    </CarouselSlide>
                </Carousel>
            </div>
        </div>
    </div>
</template>

<script setup lang="ts">
import { ref, onMounted } from 'vue'
import { useShopStore } from '~/stores/shop'
import type { SwiperOptions } from 'swiper/types'

const carouselOptions: SwiperOptions = {
    grabCursor: true,
    loop: true,
    autoplay: {
        delay: 1000,
        disableOnInteraction: false
    },
    speed: 300,
    roundLengths: true,
    slidesPerView: 2,
    breakpoints: {
        1200: { slidesPerView: 8 },
        992: { slidesPerView: 7 },
        768: { slidesPerView: 4 },
        576: { slidesPerView: 3 }
    }
}

const shopStore = useShopStore()
const carouselbrands = ref<any>(null)

onMounted(() => {
    if (!shopStore.brands) {
        shopStore.fetchBrand()
    }
    setTimeout(() => {
        if (carouselbrands.value?.swiper) {
            carouselbrands.value.swiper.update()
        }
    }, 1000)
})

function brandsFilter() {
    const brands = [1,83,9,35,25,26,29,21,160,18,315,31,157,195,379,322,7,42,22,114,340,19,27,225]
    return brands
}

function brandImageCandidates(brandId: number) {
    const file = `${brandId}.webp`
    return [
        `/images/fabricantes/${file}`,
        `https://cdn-hardstore.s3-sa-east-1.amazonaws.com/images/fabricantes/${file}`,
        `https://static.hardstore.com.br/images/fabricantes/${file}`
    ]
}

function onBrandImageError(event: Event) {
    const target = event.target as HTMLImageElement | null
    if (!target) {
        return
    }

    const brandId = Number(target.dataset.brandId || '')
    const currentIndex = Number(target.dataset.fallbackIndex || '0')
    if (!brandId) {
        return
    }

    const candidates = brandImageCandidates(brandId)
    const nextIndex = currentIndex + 1

    if (nextIndex >= candidates.length) {
        target.style.display = 'none'
        return
    }

    target.dataset.fallbackIndex = String(nextIndex)
    target.src = candidates[nextIndex]
}
</script>
<style scoped>
:deep(.swiper-slide) {
    width: auto;
}
.block-brands__slider {
    height: 105px;
}
</style>
