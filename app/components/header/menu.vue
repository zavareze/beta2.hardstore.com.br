<template>
    <div
        :class="[
            'menu',
            `menu--layout--${layout}`,
            {'menu--with-icons': withIcons}
        ]"
        @mouseleave="onMouseLeave"
    >
        <div class="menu__submenus-container">
            <template v-for="item in items" :key="item.url">
                <div
                    v-if="item.children"
                    ref="submenus"
                    class="menu__submenu"
                >
                    <Menu :items="item.children" />
                </div>
            </template>
        </div>
        <ul class="menu__list">
            <li
                v-for="(item, index) in items"
                ref="itemsRef"
                :key="index"
                :class="[
                    'menu__item',
                    {'menu__item--hover': item === hoveredItem}
                ]"
                @mouseover="onItemMouseOver(item)"
            >
                <!-- This is a synthetic element that allows to adjust the vertical offset of the submenu using CSS. -->
                <div class="menu__item-submenu-offset" />

                <AppLink v-if="item.url" :to="item.url" class="menu__item-link" @click.native="onItemClick(item)">
                    <div v-if="item.icon" class="menu__item-icon">
                        <!--suppress HtmlUnknownTarget -->
                        <img :src="url.img(item.icon)" alt="">
                    </div>
                    {{ item.title }}
                    <ArrowRoundedRight6x9Svg v-if="item.children" class="menu__item-arrow" />
                </AppLink>

                <button v-else type="button" class="menu__item-link" @click="onItemClick(item)">
                    <span v-if="item.icon" class="menu__item-icon">
                        <!--suppress HtmlUnknownTarget -->
                        <img :src="url.img(item.icon)" alt="">
                    </span>
                    {{ item.title }}
                    <ArrowRoundedRight6x9Svg v-if="item.children" class="menu__item-arrow" />
                </button>
            </li>
        </ul>
    </div>
</template>

<script setup lang="ts">
import { ref, computed } from 'vue'
import type { INestedLink } from '~/interfaces/menus/link'
import ArrowRoundedRight6x9Svg from '~/svg/arrow-rounded-right-6x9.svg'

type Layout = 'classic' | 'topbar';

const props = withDefaults(defineProps<{
    layout?: Layout
    withIcons?: boolean
    items?: INestedLink[]
}>(), {
    layout: 'classic',
    withIcons: false,
    items: () => []
})

const emit = defineEmits<{
    itemClick: [item: INestedLink]
}>()

const url = useUrl()
const hoveredItem = ref<INestedLink | null>(null)
const itemsRef = ref<HTMLDivElement[]>([])
const submenus = ref<HTMLDivElement[]>([])

const itemElements = computed(() => itemsRef.value || [])
const submenuElements = computed(() => submenus.value || [])

function onItemClick(item: INestedLink) {
    emit('itemClick', item)
}

function onItemMouseOver(item: INestedLink) {
    closeSubmenu()
    hoveredItem.value = item
    openSubmenu()
}

function onMouseLeave() {
    closeSubmenu()
    hoveredItem.value = null
}

function openSubmenu() {
    if (!hoveredItem.value || !hoveredItem.value.children) return
    const menu = itemsRef.value[0]?.closest('.menu') as HTMLElement
    const item = getCurrentItemElement()
    const submenu = getCurrentSubmenuElement()
    if (!item || !submenu || !menu) return
    const itemChildren = [].slice.call(item.children) as Element[]
    const offset = itemChildren.find(x => x.matches('.menu__item-submenu-offset')) as HTMLElement
    submenu.classList.add('menu__submenu--display')
    const menuTop = menu.getBoundingClientRect().top
    const itemTop = offset.getBoundingClientRect().top
    const viewportHeight = window.innerHeight
    const paddingY = 20
    const maxHeight = viewportHeight - paddingY * 2
    submenu.style.maxHeight = `${maxHeight}px`
    const submenuHeight = submenu.getBoundingClientRect().height
    const position = Math.min(
        Math.max(itemTop - menuTop, 0),
        (viewportHeight - paddingY - submenuHeight) - menuTop
    )
    submenu.style.top = `${position}px`
    submenu.classList.add('menu__submenu--open')
    const menuRect = menu.getBoundingClientRect()
    const menuLeft = menuRect.left
    const menuWidth = menuRect.width
    const submenuWidth = submenu.getBoundingClientRect().width
    const submenuRight = menuLeft + menuWidth + submenuWidth
    if (submenuRight > document.body.clientWidth) {
        submenu.classList.add('menu__submenu--reverse')
    }
}

function closeSubmenu() {
    const submenu = getCurrentSubmenuElement()
    if (submenu) {
        submenu.classList.remove(
            'menu__submenu--display',
            'menu__submenu--open',
            'menu__submenu--reverse'
        )
    }
}

function getCurrentItemElement() {
    if (!hoveredItem.value) return null
    const index = props.items.indexOf(hoveredItem.value)
    if (index === -1 || !itemElements.value[index]) return null
    return itemElements.value[index]
}

function getCurrentSubmenuElement() {
    if (!hoveredItem.value) return null
    const index = props.items.filter(x => x.children).indexOf(hoveredItem.value!)
    if (index === -1 || !submenuElements.value[index]) return null
    return submenuElements.value[index]
}
</script>
