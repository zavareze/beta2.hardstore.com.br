<template>
    <div>
        <div class="input-number">
            <input
                :id="id"
                :class="[
                    'form-control', 'input-number__input',
                    { 'form-control-sm': size === 'sm', 'form-control-lg': size === 'lg', 'is-invalid': error }
                ]"
                :value="modelValue"
                :step="step"
                :min="min ?? undefined"
                :max="max ?? undefined"
                :disabled="disabled"
                :readonly="readonly"
                type="number"
                @input="handleInput"
            >
            <div class="input-number__add" @mousedown="handleAddMouseDown" />
            <div class="input-number__sub" @mousedown="handleSubMouseDown" />
            <div v-if="error" class="invalid-feedback">{{ error }}</div>
        </div>
    </div>
</template>

<script setup lang="ts">
const props = defineProps<{
    id?: string
    size?: 'sm' | 'lg'
    modelValue?: string | number
    step?: number
    min?: number | null
    max?: number | null
    disabled?: boolean
    readonly?: boolean
    error?: string | null
}>()

const emit = defineEmits<{ 'update:modelValue': [value: string | number] }>()

function handleInput(event: Event) {
    const input = event.target as HTMLInputElement
    if (input.value.trim() === '') {
        emit('update:modelValue', '')
    } else {
        const value = parseFloat(input.value)
        emit('update:modelValue', Number.isNaN(value) ? (props.min || 0) : value)
    }
}

function change(direction: -1 | 1, prevValue?: string | number): number {
    const prev = typeof prevValue === 'undefined' ? props.modelValue : prevValue
    let newValue = typeof prev === 'string' ? parseFloat(prev) : (prev ?? 0)
    newValue = (Number.isNaN(newValue) ? 0 : newValue) + (props.step ?? 1) * direction
    if (props.max !== null && props.max !== undefined) newValue = Math.min(props.max, newValue)
    if (props.min !== null && props.min !== undefined) newValue = Math.max(props.min, newValue)
    if (newValue !== prev) emit('update:modelValue', newValue)
    return newValue
}

function changeByTimer(direction: -1 | 1) {
    let prevValue = props.modelValue
    let interval: ReturnType<typeof setInterval> | undefined
    const timer = setTimeout(() => {
        interval = setInterval(() => { prevValue = change(direction, prevValue) }, 50)
    }, 300)
    const onMouseUp = () => {
        clearTimeout(timer)
        clearInterval(interval)
        document.removeEventListener('mouseup', onMouseUp)
    }
    document.addEventListener('mouseup', onMouseUp)
}

const handleAddMouseDown = () => { if (!props.disabled) { change(1); changeByTimer(1) } }
const handleSubMouseDown = () => { if (!props.disabled) { change(-1); changeByTimer(-1) } }
</script>
