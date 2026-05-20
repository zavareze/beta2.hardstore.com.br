<template>
    <div class="product__gallery">
        <div class="product-gallery">
            <div class="product-gallery__featured">
                <button
                    v-if="layout !== 'quickview'"
                    type="button"
                    class="product-gallery__zoom"
                    @click="handleZoomButtonClick"
                >
                    <ZoomIn24Svg />
                </button>
                <Carousel ref="featured" :options="featuredGalleryOptions">
                    <CarouselSlide v-for="(image, index) in images" :key="index">
                        <div class="product-image product-image--location--gallery">
                            <a
                                :href="'https://cdn-hardstore.s3-sa-east-1.amazonaws.com/' + product.id + '/1280x960/' + image + '.webp'"
                                class="product-image__body"
                                target="_blank"
                                @click="handleFeaturedClick($event, index)"
                            >
                                <img
                                    ref="imageElements"
                                    class="product-image__img"
                                    :src="'https://cdn-hardstore.s3-sa-east-1.amazonaws.com/' + product.id + '/1280x960/' + image + '.webp'"
                                    alt=""
                                    width="1280"
                                    height="960"
                                    data-width="1280"
                                    data-height="960"
                                >
                                <img v-if="product.badge_promo" class="black-img" src="/images/black-friday.png" alt="" />
                            </a>
                        </div>
                    </CarouselSlide>
                    <template #fallback>
                        <div class="product-image product-image--location--gallery">
                            <a
                                :href="'https://cdn-hardstore.s3-sa-east-1.amazonaws.com/' + product.id + '/1280x960/' + images[0] + '.webp'"
                                class="product-image__body"
                            >
                                <img
                                    class="product-image__img"
                                    :src="'https://cdn-hardstore.s3-sa-east-1.amazonaws.com/' + product.id + '/1280x960/' + images[0] + '.webp'"
                                    :alt="product.name || ''"
                                    width="1280"
                                    height="960"
                                    fetchpriority="high"
                                >
                            </a>
                        </div>
                    </template>
                </Carousel>
            </div>
            <div class="product-gallery__carousel">
                <Carousel ref="thumbnails" :options="thumbnailOptions">
                    <CarouselSlide v-for="(image, index) in images" :key="index">
                        <a
                            :class="[
                                'product-gallery__carousel-item product-image',
                                {'product-gallery__carousel-item--active': index === currentIndex}
                            ]"
                            @click="handleThumbnailClick(index)"
                        >
                            <span class="product-image__body">
                                <img
                                    class="product-image__img product-gallery__carousel-image"
                                    :src="'https://cdn-hardstore.s3-sa-east-1.amazonaws.com/' + product.id + '/1280x960/' + image + '.webp'"
                                    alt=""
                                    width="1280"
                                    height="960"
                                    loading="lazy"
                                >
                            </span>
                        </a>
                    </CarouselSlide>
                </Carousel>
            </div>
        </div>
    </div>
</template>

<script setup lang="ts">
import { ref, onMounted } from 'vue'
import type { IProduct } from '~/interfaces/product'
import type { createGalleryFn, Gallery, GalleryOptions } from '~/services/photoswipe'
import ZoomIn24Svg from '~/svg/zoom-in-24.svg'

export type ProductGalleryLayout = 'standard' | 'sidebar' | 'columnar' | 'quickview';

const galleryOptions: Record<string, any> = {
    standard: {
        breakpoints: {
            380: { slidesPerView: 4 },
            480: { slidesPerView: 5 },
            768: { slidesPerView: 3 },
            992: { slidesPerView: 4 },
            1200: { slidesPerView: 5 }
        }
    },
    sidebar: {
        breakpoints: {
            380: { slidesPerView: 4 },
            480: { slidesPerView: 5 },
            768: { slidesPerView: 4 }
        }
    },
    columnar: {
        breakpoints: {
            380: { slidesPerView: 4 },
            480: { slidesPerView: 5 },
            768: { slidesPerView: 4 }
        }
    },
    quickview: {
        breakpoints: {
            380: { slidesPerView: 4 },
            480: { slidesPerView: 5 },
            768: { slidesPerView: 4 },
            1200: { slidesPerView: 5 }
        }
    }
}

const props = defineProps<{
    layout: ProductGalleryLayout
    images: string[]
    product: IProduct
}>()

const featured = ref<any>(null)
const thumbnails = ref<any>(null)
const imageElements = ref<HTMLImageElement[]>([])

const direction = ref('ltr')
const createGalleryPromise = ref<Promise<createGalleryFn> | null>(null)
const gallery = ref<Gallery | null>(null)
const currentIndex = ref(0)

const featuredGalleryOptions = {
    on: {
        slideChangeTransitionStart: handleFeaturedSlideChange
    }
}

const thumbnailOptions = Object.assign({
    spaceBetween: 10,
    slidesPerView: 3
}, galleryOptions[props.layout])

onMounted(() => {
    createGalleryPromise.value = import('~/services/photoswipe').then(module => module.default)
})

function handleFeaturedSlideChange(swiper: any) {
    currentIndex.value = swiper.activeIndex
}

function handleZoomButtonClick() {
    openPhotoswipe(currentIndex.value)
}

function handleFeaturedClick(event: MouseEvent, index: number) {
    if (props.layout === 'quickview') {
        return
    }
    event.preventDefault()
    openPhotoswipe(index)
}

function handleThumbnailClick(index: number) {
    currentIndex.value = index
    if (featured.value && featured.value.swiper) {
        featured.value.swiper.slideTo(index)
    }
}

function getIndexDependOnDir(index: number) {
    if (direction.value === 'rtl') {
        return props.images.length - 1 - index
    }
    return index
}

function openPhotoswipe(index: number) {
    const items = imageElements.value.map((tag, i) => {
        if (!tag) {
            throw new Error('Image ref is null')
        }
        const width = (tag.dataset.width ? parseFloat(tag.dataset.width) : null) || tag.naturalWidth
        const height = (tag.dataset.height ? parseFloat(tag.dataset.height) : null) || tag.naturalHeight
        return {
            src: 'https://cdn-hardstore.s3-sa-east-1.amazonaws.com/' + props.product.id + '/1280x960/' + props.images[i] + '.webp',
            msrc: 'https://cdn-hardstore.s3-sa-east-1.amazonaws.com/' + props.product.id + '/1280x960/' + props.images[i] + '.webp',
            w: width,
            h: height
        }
    })

    if (direction.value === 'rtl') {
        items.reverse()
    }

    const options: GalleryOptions = {
        getThumbBoundsFn: (idx) => {
            const tag = imageElements.value[getIndexDependOnDir(idx)]
            if (!tag) {
                return { x: 0, y: 0, w: 0 }
            }
            const width = tag.naturalWidth
            const height = tag.naturalHeight
            const rect = tag.getBoundingClientRect()
            const ration = Math.min(rect.width / width, rect.height / height)
            const fitWidth = width * ration
            const fitHeight = height * ration
            return {
                x: rect.left + (rect.width - fitWidth) / 2 + window.pageXOffset,
                y: rect.top + (rect.height - fitHeight) / 2 + window.pageYOffset,
                w: fitWidth
            }
        },
        index: getIndexDependOnDir(index),
        bgOpacity: 0.9,
        history: false
    }

    createGalleryPromise.value && createGalleryPromise.value.then((createGallery) => {
        gallery.value = createGallery(items, options)
        gallery.value.listen('beforeChange', () => {
            if (gallery.value && featured.value && featured.value.swiper) {
                featured.value.swiper.slideTo(
                    getIndexDependOnDir(gallery.value.getCurrentIndex()),
                    0
                )
            }
        })
        gallery.value.listen('destroy', () => {
            gallery.value = null
        })
        gallery.value.init()
    })
}
</script>
