<template>
    <!-- .departments -->
    <div
        :class="[
            'departments',
            {'departments--open': isOpen},
            {'departments--transition': isTransition}
        ]"
    >
        <div ref="body" class="departments__body">
            <div
                ref="content"
                class="departments__links-wrapper"
                @mouseleave="onMouseLeave"
            >
                <div ref="container" class="departments__submenus-container">
                    <template v-for="(department, index) in items" :key="index">
                        <div
                            v-if="department.submenu && department.submenu.type === 'megamenu'"
                            ref="submenus"
                            :class="[
                                'departments__submenu',
                                'departments__submenu--type--megamenu',
                                `departments__submenu--size--${department.submenu.menu.size}`
                            ]"
                        >
                            <Megamenu location="departments" :menu="department.submenu.menu" />
                        </div>
                        <div
                            v-if="department.submenu && department.submenu.type === 'menu'"
                            ref="submenus"
                            :class="[
                                'departments__submenu',
                                'departments__submenu--type--menu'
                            ]"
                        >
                            <Menu :items="department.submenu.menu" />
                        </div>
                    </template>
                </div>
                <ul class="departments__links">
                    <li
                        v-for="(department, index) in items"
                        ref="itemsRef"
                        :key="index"
                        :class="[
                            'departments__item',
                            {'departments__item--menu': department.submenu && department.submenu.type === 'menu'},
                            {'departments__item--hover': department === hoveredItem}
                        ]"
                        @mouseenter="onItemMouseEnter(department)"
                    >
                        <AppLink class="departments__item-link" :to="department.url">
                            {{ department.title }}
                            <ArrowRoundedRight6x9Svg v-if="department.submenu" class="departments__item-arrow" />
                        </AppLink>
                    </li>
                </ul>
            </div>
        </div>

        <button class="departments__button" @click="onClickButton">
            <Menu18x14Svg class="departments__button-icon" />
            Todas Categorias
            <ArrowRoundedDown9x6Svg class="departments__button-arrow" />
        </button>
    </div>
    <!-- .departments / end -->
</template>

<script setup lang="ts">
import { ref, nextTick, onMounted, onBeforeUnmount } from 'vue'
import type { INav, INavLink } from '~/interfaces/menus/nav'
import departments from '~/services/departments'
import Menu18x14Svg from '~/svg/menu-18x14.svg'
import ArrowRoundedDown9x6Svg from '~/svg/arrow-rounded-down-9x6.svg'
import ArrowRoundedRight6x9Svg from '~/svg/arrow-rounded-right-6x9.svg'

const emit = defineEmits<{
    onSetArea: [element: Element | null]
}>()

const hoveredItem = ref<INavLink | null>(null)
const items = ref<INav>([])
const isOpen = ref(false)
const isTransition = ref(false)
const fixed = ref(false)
const sticky = ref(false)

const body = ref<HTMLElement | null>(null)
const content = ref<HTMLElement | null>(null)
const container = ref<HTMLElement | null>(null)
const itemsRef = ref<HTMLDivElement[]>([])
const submenus = ref<HTMLDivElement[]>([])

const itemElements = computed(() => itemsRef.value || [])
const submenuElements = computed(() => submenus.value || [])

onMounted(async () => {
    items.value = await $fetch<INav>('/api/menu')
    await nextTick()
    departments.watch(onSetArea)
    content.value?.addEventListener('transitionend', onTransitionEnd)
    document.addEventListener('click', onGlobalClick)
})

onBeforeUnmount(() => {
    departments.unwatch(onSetArea)
    content.value?.removeEventListener('transitionend', onTransitionEnd)
    document.removeEventListener('click', onGlobalClick)
})

function onClickButton() {
    if (isOpen.value) {
        closeMenu()
    } else {
        openMenu()
    }
}

function onGlobalClick(event: MouseEvent) {
    const element = getCurrentEl()
    if (!element?.contains(event.target as HTMLElement)) {
        closeMenu()
    }
}

function getCurrentEl(): HTMLElement | null {
    return body.value?.closest('.departments') as HTMLElement | null
}

function onItemMouseEnter(item: INavLink) {
    closeSubmenu()
    hoveredItem.value = item
    openSubmenu()
}

function onMouseLeave() {
    closeSubmenu()
    hoveredItem.value = null
}

function onSetArea(element: Element | null) {
    if (element !== null) {
        fix()
    } else {
        unfix()
    }
    emit('onSetArea', element)
}

function onTransitionEnd(event: TransitionEvent) {
    if (event.propertyName === 'height' && event.target === content.value) {
        isTransition.value = false
    }
}

function openMenu() {
    if (fixed.value) return
    isOpen.value = true
    isTransition.value = true
    const element = content.value?.closest('.departments') as HTMLElement
    if (!element || !content.value) return
    const startHeight = content.value.getBoundingClientRect().height
    element.classList.add('departments--transition')
    element.classList.add('departments--open')
    const documentHeight = document.documentElement.clientHeight
    const paddingBottom = 20
    const contentRect = content.value.getBoundingClientRect()
    const endHeight = Math.min(contentRect.height, documentHeight - paddingBottom - contentRect.top)
    content.value.style.height = `${startHeight}px`
    content.value.getBoundingClientRect()
    content.value.style.maxHeight = `${endHeight}px`
    content.value.style.height = `${endHeight}px`
}

function closeMenu(immediately = false) {
    if (fixed.value) return
    isOpen.value = false
    const root = content.value?.closest('.departments') as HTMLElement
    if (!root || !content.value) return
    if (immediately) {
        isTransition.value = false
        content.value.style.transitionDuration = '0s'
        content.value.style.height = ''
        content.value.style.maxHeight = ''
        content.value.getBoundingClientRect()
        root.classList.remove('departments--open')
        root.classList.remove('departments--fixed')
        content.value.style.transitionDuration = ''
    } else {
        isTransition.value = true
        const startHeight = content.value.getBoundingClientRect().height
        content.value.style.height = `${startHeight}px`
        root.classList.add('departments--transition')
        root.classList.remove('departments--open')
        root.classList.remove('departments--fixed')
        content.value.getBoundingClientRect()
        content.value.style.height = ''
        content.value.style.maxHeight = ''
    }
}

function fix() {
    if (sticky.value) return
    isOpen.value = true
    fixed.value = true
    if (!departments.element || !content.value) return
    const area = departments.element
    const root = content.value.closest('.departments') as HTMLElement
    const areaRect = area.getBoundingClientRect()
    const areaBottom = areaRect.top + areaRect.height + window.scrollY
    root.classList.remove('departments--transition')
    root.classList.add('departments--fixed', 'departments--open')
    const height = areaBottom - (content.value.getBoundingClientRect().top + window.scrollY)
    content.value.style.height = `${height}px`
    content.value.style.maxHeight = `${height}px`
    content.value.getBoundingClientRect()
}

function unfix() {
    fixed.value = false
    const root = content.value?.closest('.departments') as HTMLElement
    root?.classList.remove('departments--fixed')
    closeMenu(true)
}

function setStickyState(state: boolean) {
    sticky.value = state
    if (sticky.value) {
        unfix()
    } else if (departments.element) {
        fix()
    }
}

function openSubmenu() {
    if (!hoveredItem.value || !hoveredItem.value.submenu) return
    const bodyEl = body.value
    const containerEl = container.value
    const item = getCurrentItemElement()
    const submenu = getCurrentSubmenuElement()
    if (!submenu || !item || !bodyEl || !containerEl) return
    submenu.classList.add('departments__submenu--open')
    const documentHeight = document.documentElement.clientHeight
    const paddingBottom = 20
    if (hoveredItem.value.submenu.type === 'megamenu') {
        const submenuTop = submenu.getBoundingClientRect().top
        submenu.style.maxHeight = `${documentHeight - submenuTop - paddingBottom}px`
    }
    if (hoveredItem.value.submenu.type === 'menu') {
        const maxHeight = documentHeight - paddingBottom - Math.min(
            paddingBottom,
            bodyEl.getBoundingClientRect().top
        )
        submenu.style.maxHeight = `${maxHeight}px`
        const submenuHeight = submenu.getBoundingClientRect().height
        const itemTop = item.getBoundingClientRect().top
        const containerTop = containerEl.getBoundingClientRect().top
        const top = Math.min(itemTop, documentHeight - paddingBottom - submenuHeight) - containerTop
        submenu.style.top = `${top}px`
    }
}

function closeSubmenu() {
    const submenu = getCurrentSubmenuElement()
    if (submenu) {
        submenu.classList.remove('departments__submenu--open')
    }
}

function getCurrentItemElement(): HTMLDivElement | null {
    if (!hoveredItem.value) return null
    const index = items.value.indexOf(hoveredItem.value)
    if (index === -1 || !itemElements.value[index]) return null
    return itemElements.value[index]
}

function getCurrentSubmenuElement(): HTMLDivElement | null {
    if (!hoveredItem.value) return null
    const index = items.value.filter(x => x.submenu).indexOf(hoveredItem.value!)
    if (index === -1 || !submenuElements.value[index]) return null
    return submenuElements.value[index]
}

defineExpose({ setStickyState, closeMenu })
</script>
