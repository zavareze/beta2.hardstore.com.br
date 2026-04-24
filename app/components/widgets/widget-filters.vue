<template>
    <div
        :class="[
            'widget-filters widget',
            {
                'widget-filters--offcanvas--always': offcanvas === 'always',
                'widget-filters--offcanvas--mobile': offcanvas === 'mobile',
            }
        ]"
    >
        <h4 class="widget-filters__title widget__title">
            Filtros
        </h4>

        <div class="widget-filters__list">
            <div v-for="filter in filters" :key="filter.key" class="widget-filters__item">
                <Collapse
                    v-slot:default="{ itemClasses, contentClasses, toggle }"
                    item-open-class="filter--opened"
                    :is-open="true"
                >
                    <div :class="['filter', itemClasses]">
                        <button type="button" class="filter__title" @click="toggle">
                            {{ filter.name }}
                            <ArrowRoundedDown12x7Svg class="filter__arrow" />
                        </button>
                        <div :class="['filter__body', contentClasses]">
                            <div class="filter__container">
                                <FilterWrapper
                                    :filter="filter"
                                    :value="getFilterValue(filter.slug)"
                                    @changeValue="handleValueChange"
                                />
                            </div>
                        </div>
                    </div>
                </Collapse>
            </div>
        </div>

        <div class="widget-filters__actions d-flex mb-n2">
            <button
                type="button"
                class="btn btn-secondary btn-sm"
                @click="shopStore.resetFilters()"
            >
                Limpar
            </button>
        </div>
    </div>
</template>

<script setup lang="ts">
import { computed } from 'vue'
import type { IFilterValues } from '~/interfaces/list'
import type { IFilter } from '~/interfaces/filter'
import { isDefaultFilterValue, serializeFilterValue } from '~/services/filters'
import ArrowRoundedDown12x7Svg from '~/svg/arrow-rounded-down-12x7.svg'
import { useShopStore } from '~/stores/shop'

export interface FilterChangeValueEvent {
    filter: IFilter;
    value: IFilter['value'];
}

export type WidgetFiltersOffcanvas = 'always' | 'mobile'

withDefaults(defineProps<{
    offcanvas?: WidgetFiltersOffcanvas
}>(), {
    offcanvas: 'mobile',
})

const shopStore = useShopStore()

const filters = computed<IFilter[]>(() => shopStore.productsListFilters)
const values = computed<IFilterValues>(() => shopStore.filters)

function handleValueChange ({ filter, value }: any) {
    try {
        window.scrollTo({ top: 0, left: 0, behavior: 'smooth' })
    } catch {
        window.scrollTo(0, 0)
    }
    shopStore.setFilterValue({
        filter: filter.slug,
        value: isDefaultFilterValue(filter, value) ? null : serializeFilterValue(filter, value)
    })
}

function getFilterValue (filterSlug: string): string {
    return values.value[filterSlug] || ''
}
</script>
