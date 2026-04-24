import { defineStore } from 'pinia'

export type HeaderLayout = 'default' | 'compact'
export type DropcartType = 'dropdown' | 'offcanvas'

export const useOptionsStore = defineStore('options', {
    state: () => ({
        headerLayout: 'default' as HeaderLayout,
        dropcartType: 'dropdown' as DropcartType
    }),
    actions: {
        setHeaderLayout(headerLayout: HeaderLayout) {
            this.headerLayout = headerLayout
        },
        setDropcartType(dropcartType: DropcartType) {
            this.dropcartType = dropcartType
        }
    }
})
