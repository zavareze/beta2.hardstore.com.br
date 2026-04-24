import { reactive } from 'vue'

const openModals = reactive<Set<string>>(new Set())

export function useModal() {
    return {
        show(id: string) { openModals.add(id) },
        hide(id: string) { openModals.delete(id) },
        isOpen(id: string) { return openModals.has(id) }
    }
}
