<template>
    <div class="filter-price">
        <div class="filter-price__slider">
            <ClientOnly>
                <VueSlider
                    :key="`${filter.min}-${filter.max}`"
                    v-model="internalValue"
                    :min="filter.min"
                    :max="filter.max"
                    :height="6"
                    :dot-size="16"
                    tooltip="none"
                    @change="handleChange"
                />
            </ClientOnly>
        </div>
        <div class="filter-price__title">
            Preço:
            <span class="filter-price__min-value">{{ price(internalValue[0]) }}</span>
            –
            <span class="filter-price__max-value">{{ price(internalValue[1]) }}</span>
        </div>
    </div>
</template>

<script setup lang="ts">
import { ref, watch, onMounted } from 'vue'
import VueSlider from 'vue-slider-component'
import 'vue-slider-component/dist-css/vue-slider-component.css'

const props = defineProps<{
    filter: any
    value: number[]
}>()

const emit = defineEmits<{
    changeValue: [payload: any]
}>()

const { price } = usePrice()

const internalValue = ref<number[]>(props.value)
let timer: any = null
let timerActive = false
let isMounted = false

onMounted(() => { isMounted = true })

watch(() => [props.filter?.min, props.filter?.max], ([min, max]) => {
    if (!isMounted) return
    clearTimeout(timer)
    timerActive = false
    internalValue.value = [min as number, max as number]
})

watch(() => props.value, (value) => {
    if (!timerActive) {
        internalValue.value = value
    }
})

function handleChange(value: number[]) {
    clearTimeout(timer)

    timerActive = true
    timer = setTimeout(() => {
        timerActive = false

        emit('changeValue', {
            filter: props.filter,
            value
        })
    }, 500)
}
</script>
