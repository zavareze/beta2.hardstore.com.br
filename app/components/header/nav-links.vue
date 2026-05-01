<template>
    <div class="nav-links">
        <ul class="nav-links__list">
            <li
                v-for="(item, index) in items"
                ref="itemRefs"
                :key="index"
                :class="[
                    'nav-links__item',
                    {
                        'nav-links__item--has-submenu': item.submenu,
                        'nav-links__item--hover': item === hoveredItem,
                    }
                ]"
                @mouseenter="onItemMouseEnter(item)"
                @mouseleave="onItemMouseLeave(item)"
            >
                <AppLink class="nav-links__item-link" :to="item.url">
                    <div class="nav-links__item-body">
                        {{ item.title }}
                        <ArrowRoundedDown9x6Svg v-if="item.submenu" class="nav-links__item-arrow" />
                    </div>
                </AppLink>
                <div
                    v-if="item.submenu && item.submenu.type === 'menu'"
                    ref="submenuRefs"
                    :class="[
                        'nav-links__submenu',
                        'nav-links__submenu--type--menu',
                        {
                            'nav-links__submenu--display': item === hoveredItem,
                            'nav-links__submenu--open': item === hoveredItem
                        }
                    ]"
                >
                    <Menu :items="item.submenu.menu" @itemClick="onSubmenuItemClick(item)" />
                </div>
                <div
                    v-if="item.submenu && item.submenu.type === 'megamenu'"
                    ref="submenuRefs"
                    :class="[
                        'nav-links__submenu',
                        'nav-links__submenu--type--megamenu',
                        `nav-links__submenu--size--${item.submenu.menu.size}`,
                        {
                            'nav-links__submenu--display': item === hoveredItem,
                            'nav-links__submenu--open': item === hoveredItem
                        }
                    ]"
                >
                    <Megamenu :menu="item.submenu.menu" location="nav-panel" />
                </div>
            </li>
        </ul>
    </div>
</template>

<script setup lang="ts">
import { ref } from 'vue'
import ArrowRoundedDown9x6Svg from '~/svg/arrow-rounded-down-9x6.svg'

const items = ref([
    {
        title: 'Home',
        url: '/'
    },
    {
        title: 'Minha Conta',
        url: '/account/login',
        submenu: {
            type: 'menu',
            menu: [
                { title: 'Dashboard', url: '/account/dashboard' },
                { title: 'Meus Pedidos', url: '/account/orders' },
                { title: 'Meu Cadastro', url: '/account/profile' },
                { title: 'Endereços', url: '/account/addresses' },
                { title: 'Alterar Senha', url: '/account/password' }
            ]
        }
    },
    {
        title: 'Computadores',
        url: '/shop/home-office'
    },
    {
        title: 'PC Gamer',
        url: '/computadores/pc-gamer'
    },
    {
        title: 'Ofertas Especiais',
        url: '/shop/promocao'
    },
    {
        title: 'Blog',
        url: '/blog/category-list'
    },
])

const hoveredItem = ref<any | null>(null)
const itemRefs = ref<HTMLElement[]>([])
const submenuRefs = ref<HTMLElement[]>([])

function onItemMouseEnter(item: any) {
    hoveredItem.value = item
    openSubmenu()
}

function onItemMouseLeave(item: any) {
    if (item === hoveredItem.value) {
        hoveredItem.value = null
    }
}

function onSubmenuItemClick(item: any) {
    if (item === hoveredItem.value) {
        hoveredItem.value = null
    }
}

function openSubmenu() {
    const item = getItemElement(hoveredItem.value)
    const submenu = getSubmenuElement(hoveredItem.value)

    if (!item || !submenu || !hoveredItem.value?.submenu) {
        return
    }

    submenu.classList.add('nav-links__submenu--display')

    const submenuTop = submenu.getBoundingClientRect().top
    const viewportHeight = window.innerHeight
    const paddingBottom = 20

    submenu.style.maxHeight = `${viewportHeight - submenuTop - paddingBottom}px`
    submenu.classList.add('nav-links__submenu--open')

    if (hoveredItem.value.submenu.type === 'megamenu') {
        const container = submenu.offsetParent

        if (!container) {
            throw new Error('Submenu container is null')
        }

        const containerRect = container.getBoundingClientRect()
        const containerWidth = containerRect.width
        const megamenuWidth = submenu.getBoundingClientRect().width
        const itemRect = item.getBoundingClientRect()

        const itemPosition = itemRect.left - containerRect.left
        const megamenuPosition = Math.round(Math.min(itemPosition, containerWidth - megamenuWidth))
        submenu.style.left = `${megamenuPosition}px`
    }
}

function closeSubmenu() {
    hoveredItem.value = null
}

function getItemElement(item: any | null) {
    if (!item) {
        return null
    }

    const index = items.value.indexOf(item)

    if (index === -1 || !itemRefs.value[index]) {
        return null
    }

    return itemRefs.value[index] as HTMLDivElement
}

function getSubmenuElement(item: any | null) {
    if (!item) {
        return null
    }

    const index = items.value.filter(x => x.submenu).indexOf(item)

    if (index === -1 || !submenuRefs.value[index]) {
        return null
    }

    return submenuRefs.value[index] as HTMLDivElement
}

defineExpose({ closeSubmenu })
</script>
