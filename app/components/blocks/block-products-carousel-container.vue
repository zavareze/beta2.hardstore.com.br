<template>
    <div>
        <slot
            :products="products"
            :is-loading="isLoading"
            :tabs="internalTabs"
            :handle-tab-change="handleTabChange"
        />
    </div>
</template>

<script setup lang="ts">
import { ref, onMounted, watch } from 'vue'
import type { IProduct } from '~/interfaces/product'
import { useShopStore } from '~/stores/shop'

type WithCurrent<T extends {}> = T & { current: boolean }

const props = withDefaults(defineProps<{
    initialData?: IProduct[] | null
    tabs?: any[]
    action?: string
    dataSource: (tab: any) => Promise<IProduct[]>
}>(), {
    initialData: null,
    tabs: () => [],
    action: ''
})

const shopStore = useShopStore()

const products = ref<IProduct[]>(props.initialData || [])
const isLoading = ref<boolean>(props.initialData === null)
const internalTabs = ref<WithCurrent<any>[]>(props.tabs.map(tab => ({ ...tab, current: false })))
let cancelFn = () => {}

onMounted(() => {
    // Watch instalado após hidratação para não causar mismatch SSR
    watch(() => props.tabs, (newTabs) => {
        const currentId = internalTabs.value.find((t: any) => t.current)?.id
        internalTabs.value = newTabs.map(tab => ({ ...tab, current: tab.id === currentId }))
    }, { deep: true })

    if (internalTabs.value.length > 0) {
        const firstTab = internalTabs.value[0]
        if (isLoading.value) {
            handleTabChange(firstTab)
        } else {
            internalTabs.value.forEach((tab) => {
                tab.current = tab === firstTab
            })
        }
    }
})

async function handleTabChange(currentTab: any) {
    internalTabs.value = props.tabs.map(tab => ({ ...tab, current: false }))
    cancelFn()
    let canceled = false
    cancelFn = () => {
        canceled = true
    }
    internalTabs.value.forEach((tab: any) => {
        if (tab.id === currentTab.id) {
            tab.current = true
        }
    })
    if (props.action) {
        (shopStore as any)[props.action]?.(internalTabs.value)
    }
    isLoading.value = true
    const result = await props.dataSource(currentTab)
    if (canceled) {
        return
    }
    products.value = result
    isLoading.value = false
}
</script>
