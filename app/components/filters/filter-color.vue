<template>
    <div class="filter-color">
        <div class="filter-color__list">
            <div
                v-for="item in filter.items"
                :key="item.slug"
                class="filter-color__item"
            >
                <span
                    :class="[
                        'filter-color__check input-check-color',
                        {
                            'input-check-color--white': colorType(item.color) === 'white',
                            'input-check-color--light': colorType(item.color) === 'light',
                        }
                    ]"
                    :style="{ color: item.color }"
                >
                    <label class="input-check-color__body">
                        <input
                            class="input-check-color__input"
                            type="checkbox"
                            :value="item.slug"
                            :checked="value.includes(item.slug)"
                            :disabled="item.count === 0"
                            @change="handleChange"
                        >
                        <span class="input-check-color__box" />
                        <Check12x9Svg class="input-check-color__icon" />
                        <span class="input-check-color__stick" />
                    </label>
                </span>
            </div>
        </div>
    </div>
</template>

<script setup lang="ts">
import { colorType } from '~/services/color'
import Check12x9Svg from '~/svg/check-12x9.svg'

const props = defineProps<{
    filter: any
    value: string[]
}>()

const emit = defineEmits<{
    changeValue: [payload: any]
}>()

function handleChange(event: Event) {
    const target = event.target as HTMLInputElement
    if (target) {
        const value = target.value

        if (target.checked && !props.value.includes(value)) {
            emit('changeValue', {
                filter: props.filter,
                value: [...props.value, value]
            })
        }
        if (!target.checked && props.value.includes(value)) {
            emit('changeValue', {
                filter: props.filter,
                value: props.value.filter(x => x !== value)
            })
        }
    }
}
</script>
