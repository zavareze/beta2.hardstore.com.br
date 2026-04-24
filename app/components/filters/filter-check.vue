<template>
    <div class="filter-list">
        <div class="filter-list__list">
            <label
                v-for="item in filter.items"
                :key="item.slug"
                :class="[
                    'filter-list__item',
                    {'filter-list__item--disabled': item.count === 0}
                ]"
            >
                <span class="filter-list__input input-check">
                    <span class="input-check__body">
                        <input
                            class="input-check__input"
                            type="checkbox"
                            :value="item.slug"
                            :checked="value.includes(item.slug.toString())"
                            :disabled="item.count === 0"
                            @change="handleChange"
                        >
                        <span class="input-check__box" />
                        <Check9x7Svg class="input-check__icon" />
                    </span>
                </span>
                <span class="filter-list__title">{{ item.name }}</span>

                <span v-if="item.count" class="filter-list__counter">{{ item.count }}</span>
            </label>
        </div>
    </div>
</template>

<script setup lang="ts">
import Check9x7Svg from '~/svg/check-9x7.svg'

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
