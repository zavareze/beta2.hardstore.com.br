<template>
    <div>
        <FilterCategory
            v-if="filter.type === 'category'"
            :filter="filter"
        />
        <FilterRange
            v-if="filter.type === 'range'"
            :filter="filter"
            :value="getFilterValue(filter, value)"
            @changeValue="$emit('changeValue', $event)"
        />
        <FilterCheck
            v-if="filter.type === 'check'"
            :filter="filter"
            :value="getFilterValue(filter, value)"
            @changeValue="$emit('changeValue', $event)"
        />
        <FilterRadio
            v-if="filter.type === 'radio'"
            :filter="filter"
            :value="getFilterValue(filter, value)"
            @changeValue="$emit('changeValue', $event)"
        />
        <FilterColor
            v-if="filter.type === 'color'"
            :filter="filter"
            :value="getFilterValue(filter, value)"
            @changeValue="$emit('changeValue', $event)"
        />
    </div>
</template>

<script setup lang="ts">
import { getFilterValue } from '~/services/filters'

defineProps<{
    filter: any
    value: string
}>()

defineEmits<{
    changeValue: [payload: any]
}>()
</script>
