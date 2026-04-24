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
                <span class="filter-list__input input-radio">
                    <span class="input-radio__body">
                        <input
                            class="input-radio__input"
                            type="radio"
                            :name="filter.slug"
                            :value="item.slug"
                            :checked="value === item.slug"
                            :disabled="item.count === 0"
                            @change="handleChange"
                        >
                        <span class="input-radio__circle" />
                    </span>
                </span>
                <span class="filter-list__title">{{ item.name }}</span>
                <span v-if="item.count" class="filter-list__counter">{{ item.count }}</span>
            </label>
        </div>
    </div>
</template>

<script setup lang="ts">
const props = defineProps<{
    filter: any
    value: string
}>()

const emit = defineEmits<{
    changeValue: [payload: any]
}>()

function handleChange(event: Event) {
    const target = event.target as HTMLInputElement
    if (target) {
        const value = target.value

        if (target.checked && value !== props.value) {
            emit('changeValue', {
                filter: props.filter,
                value
            })
        }
    }
}
</script>
