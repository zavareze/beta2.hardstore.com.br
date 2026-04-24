<template>
    <Teleport to="body">
        <div
            v-if="isVisible"
            class="modal fade show"
            style="display: block"
            tabindex="-1"
            @mousedown.self="onBackdropClick"
        >
            <div class="modal-dialog" :class="size ? `modal-${size}` : ''">
                <div class="modal-content">
                    <div class="modal-header">
                        <h5 class="modal-title">
                            <slot name="modal-title" />
                        </h5>
                        <button type="button" class="btn-close" aria-label="Fechar" @click="close" />
                    </div>
                    <div class="modal-body">
                        <slot />
                    </div>
                    <div v-if="!hideFooter" class="modal-footer">
                        <slot name="modal-footer">
                            <button type="button" class="btn btn-secondary" @click="close">Cancelar</button>
                            <button type="button" class="btn btn-primary" @click="handleOk">OK</button>
                        </slot>
                    </div>
                </div>
            </div>
        </div>
        <div v-if="isVisible" class="modal-backdrop fade show" />
    </Teleport>
</template>

<script setup lang="ts">
import { computed } from 'vue'

const props = withDefaults(defineProps<{
    id: string
    hideFooter?: boolean
    noCloseOnBackdrop?: boolean
    size?: string
}>(), {
    hideFooter: false,
    noCloseOnBackdrop: false,
    size: ''
})

const emit = defineEmits<{
    ok: []
    hidden: []
}>()

const modal = useModal()
const isVisible = computed(() => modal.isOpen(props.id))

function close() {
    modal.hide(props.id)
    emit('hidden')
}

function onBackdropClick() {
    if (!props.noCloseOnBackdrop) {
        close()
    }
}

function handleOk() {
    emit('ok')
    close()
}
</script>
