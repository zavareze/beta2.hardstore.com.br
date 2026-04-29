<template>
    <div class="block block-brands">
        <div class="container">
            <div class="block-brands__slider">
                <Carousel ref="carouselbrands" :options="carouselOptions">
                    <CarouselSlide v-for="(brand, index) in brandsFilter()" :key="index">
                        <div class="block-brands__item">
                            <!--suppress HtmlUnknownTarget -->
                            <img :src="'https://static.hardstore.com.br/images/fabricantes/' + brand + '.webp'" loading="lazy" alt="" class="mx-auto" style="max-height: 40px; max-width: 100px">
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
</script>
<style scoped>
:deep(.swiper-slide) {
    width: auto;
}
.block-brands__slider {
    height: 105px;
}
</style>
