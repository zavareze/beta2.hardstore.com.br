<template>
  <div class="order-status">
    <div class="card">
      <div class="card-title">Histórico do pedido</div>
      <div class="timeline">
        <div
          v-for="step in steps"
          :key="step.key"
          class="timeline-item"
          :class="step.status"
        >
          <div class="ti-icon">
            <svg viewBox="0 0 24 24" fill="currentColor" width="26" height="26" aria-hidden="true">
              <path :d="step.status === 'completed' ? ICONS.check : ICONS[step.icon]" />
            </svg>
          </div>
          <div class="ti-content">
            <div class="ti-header">
              <div class="ti-title">{{ step.label }}</div>
              <div class="ti-date" :class="{ pending: !step.date }">
                {{ step.date ? formatDateFull(step.date) : 'Aguardando' }}
              </div>
            </div>
            <div class="ti-desc">{{ step.description }}</div>
            <div v-if="step.status === 'current'" class="ti-current-badge">
              <span class="dot" />
              Em andamento agora
            </div>
          </div>
        </div>
      </div>
    </div>

    <div class="info-grid">
      <div class="card">
        <div class="card-header">
          <svg viewBox="0 0 24 24" fill="currentColor" width="20" height="20" aria-hidden="true">
            <path :d="ICONS.event" />
          </svg>
          Previsão de entrega
        </div>
        <div class="card-main">{{ order.estimatedDelivery ? formatDateOnly(order.estimatedDelivery) : 'A confirmar' }}</div>
        <div class="card-sub">{{ order.address }}</div>
      </div>

      <div class="card">
        <div class="card-header">
          <svg viewBox="0 0 24 24" fill="currentColor" width="20" height="20" aria-hidden="true">
            <path :d="ICONS.local_shipping" />
          </svg>
          Rastreamento
        </div>
        <template v-if="showTracking">
          <div class="card-main card-main--sm">{{ order.tracking.carrier }}</div>
          <div class="tracking-row">
            <span class="tracking-code">{{ order.tracking.code }}</span>
            <button type="button" class="btn-copy" title="Copiar código" @click="copyTracking">
              <svg viewBox="0 0 24 24" fill="currentColor" width="18" height="18" aria-hidden="true">
                <path :d="ICONS.content_copy" />
              </svg>
            </button>
          </div>
          <a :href="order.tracking.url" target="_blank" rel="noopener noreferrer" class="btn-track">
            Acompanhar entrega
            <svg viewBox="0 0 24 24" fill="currentColor" width="16" height="16" aria-hidden="true">
              <path :d="ICONS.open_in_new" />
            </svg>
          </a>
        </template>
        <div v-else class="card-sub">
          O código de rastreamento será gerado quando o pedido for despachado.
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { computed } from 'vue'

const props = defineProps<{ order: any }>()

const ICONS: Record<string, string> = {
  check:          'M9 16.17 4.83 12l-1.42 1.41L9 19 21 7l-1.41-1.41z',
  receipt_long:   'M19.5 3.5 18 2l-1.5 1.5L15 2l-1.5 1.5L12 2l-1.5 1.5L9 2 7.5 3.5 6 2v14H3v3c0 1.66 1.34 3 3 3h12c1.66 0 3-1.34 3-3V2l-1.5 1.5zM19 19c0 .55-.45 1-1 1s-1-.45-1-1v-2H8V5h11v14zm-2-8H9V9h8v2zm0 4H9v-2h8v2z',
  verified:       'M23 12l-2.44-2.79.34-3.69-3.61-.82L15.4 1.5 12 2.96 8.6 1.5 6.71 4.69l-3.61.82.34 3.7L1 12l2.44 2.79-.34 3.7 3.61.82 1.89 3.2L12 21.04l3.4 1.47 1.89-3.2 3.61-.82-.34-3.69L23 12zm-12.91 4.72-3.8-3.81 1.48-1.48 2.32 2.33 5.85-5.87 1.48 1.48-7.33 7.35z',
  inventory_2:    'M20 2H4c-1 0-2 .9-2 2v3.01c0 .72.43 1.34 1 1.72V20c0 1.1 1.1 2 2 2h14c.9 0 2-.9 2-2V8.72c.57-.38 1-.99 1-1.71V4c0-1.1-1-2-2-2zm-5 12H9v-2h6v2zm5-8H4V4l16-.02V6z',
  outbox:         'M21 3H3c-1.1 0-2 .9-2 2v14c0 1.1.9 2 2 2h18c1.1 0 2-.9 2-2V5c0-1.1-.9-2-2-2zm0 16H3V5h18v14zm-9-2 5-5h-3V8h-4v4H7l5 5z',
  local_shipping: 'M20 8h-3V4H3c-1.1 0-2 .9-2 2v11h2c0 1.66 1.34 3 3 3s3-1.34 3-3h6c0 1.66 1.34 3 3 3s3-1.34 3-3h2v-5l-3-4zm-.5 1.5 1.96 2.5H17V9.5h2.5zM6 18c-.55 0-1-.45-1-1s.45-1 1-1 1 .45 1 1-.45 1-1 1zm2.22-3c-.55-.61-1.35-1-2.22-1s-1.67.39-2.22 1H3V6h12v9H8.22zM18 18c-.55 0-1-.45-1-1s.45-1 1-1 1 .45 1 1-.45 1-1 1z',
  task_alt:       'M22 5.18 10.59 16.6l-4.24-4.24 1.41-1.41 2.83 2.83 10-10L22 5.18zm-2.21 5.04c.13.57.21 1.17.21 1.78 0 4.42-3.58 8-8 8s-8-3.58-8-8 3.58-8 8-8c1.58 0 3.04.46 4.28 1.25l1.44-1.44C16.1 2.67 14.13 2 12 2 6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10c0-1.19-.22-2.33-.6-3.39l-1.61 1.61z',
  event:          'M17 12h-5v5h5v-5zM16 1v2H8V1H6v2H5c-1.11 0-1.99.9-1.99 2L3 19c0 1.1.89 2 2 2h14c1.1 0 2-.9 2-2V5c0-1.1-.9-2-2-2h-1V1h-2zm3 18H5V8h14v11z',
  content_copy:   'M16 1H4c-1.1 0-2 .9-2 2v14h2V3h12V1zm3 4H8c-1.1 0-2 .9-2 2v14c0 1.1.9 2 2 2h11c1.1 0 2-.9 2-2V7c0-1.1-.9-2-2-2zm0 16H8V7h11v14z',
  open_in_new:    'M19 19H5V5h7V3H5c-1.11 0-2 .9-2 2v14c0 1.1.89 2 2 2h14c1.1 0 2-.9 2-2v-7h-2v7zM14 3v2h3.59l-9.83 9.83 1.41 1.41L19 6.41V10h2V3h-7z',
}

const STEP_DEFINITIONS = [
  { key: 'placed',    label: 'Pedido realizado',   icon: 'receipt_long',   description: 'Recebemos seu pedido e ele já está no nosso sistema.' },
  { key: 'approved',  label: 'Pagamento aprovado',  icon: 'verified',       description: 'Pagamento confirmado pela operadora. Seu pedido entrará em separação.' },
  { key: 'preparing', label: 'Em separação',        icon: 'inventory_2',    description: 'Estamos separando os produtos no nosso centro de distribuição.' },
  { key: 'shipped',   label: 'Pedido enviado',      icon: 'outbox',         description: 'Pedido despachado e entregue à transportadora.' },
  { key: 'inTransit', label: 'Em trânsito',         icon: 'local_shipping', description: 'A encomenda está a caminho do endereço de entrega.' },
  { key: 'delivered', label: 'Pedido entregue',     icon: 'task_alt',       description: 'Pedido entregue no endereço de destino.' },
]

const steps = computed(() => {
  const currentIdx = STEP_DEFINITIONS.findIndex(s => s.key === props.order.currentStep)
  return STEP_DEFINITIONS.map((step, idx) => {
    const date = props.order.timeline?.[step.key] || null
    let status = 'pending'
    if (idx < currentIdx && date) status = 'completed'
    else if (idx === currentIdx) status = 'current'
    return { ...step, status, date }
  })
})

const showTracking = computed(() => {
  const idx = STEP_DEFINITIONS.findIndex(s => s.key === props.order.currentStep)
  return idx >= 3 && props.order.tracking
})

function formatDateFull(date: string) {
  if (!date) return ''
  const isDateOnly = /^\d{4}-\d{2}-\d{2}$/.test(date)
  const d = new Date(isDateOnly ? date + 'T12:00:00' : date)
  const datePart = d.toLocaleDateString('pt-BR', { day: '2-digit', month: 'short', year: 'numeric' })
  if (isDateOnly) return datePart
  const timePart = d.toLocaleTimeString('pt-BR', { hour: '2-digit', minute: '2-digit' })
  return `${datePart} • ${timePart}`
}

function formatDateOnly(date: string) {
  if (!date) return ''
  return new Date(date).toLocaleDateString('pt-BR', { weekday: 'long', day: '2-digit', month: 'long' })
}

async function copyTracking() {
  const code = props.order.tracking?.code
  if (!code) return
  try {
    await navigator.clipboard.writeText(code)
    useNuxtApp().$notify?.({ type: 'success text-success', text: 'Código copiado com sucesso!', duration: 2000 })
  } catch {
    useNuxtApp().$notify?.({ type: 'error text-error', text: 'Não foi possível copiar o código.', duration: 2000 })
  }
}
</script>

<style scoped lang="scss">
$brand: #cc0000;

.order-status {
  font-family: 'Inter', 'Roboto', -apple-system, sans-serif;
  margin-top: 16px;
}

.card {
  background: #fff;
  border: 1px solid #e5e5e5;
  border-radius: 6px;
  padding: 24px;
  margin-bottom: 16px;
}

.card-title {
  font-size: 16px;
  font-weight: 700;
  color: #222;
  margin-bottom: 22px;
}

.timeline {
  position: relative;
}
.timeline::before {
  content: '';
  position: absolute;
  left: 27px;
  top: 28px;
  bottom: 28px;
  width: 2px;
  background: #e5e7eb;
  z-index: 0;
}
.timeline-item {
  position: relative;
  display: flex;
  gap: 20px;
  padding-bottom: 28px;
  z-index: 1;
  &:last-child { padding-bottom: 0; }
}

.ti-icon {
  width: 56px;
  height: 56px;
  min-width: 56px;
  border-radius: 16px;
  display: flex;
  align-items: center;
  justify-content: center;
  background: #f3f4f6;
  color: #9ca3af;
  border: 2px solid #fff;
  box-shadow: 0 0 0 2px #e5e7eb;
  transition: all 0.3s;
}
.timeline-item.completed .ti-icon {
  background: #e8f5e9;
  color: #2e7d32;
  box-shadow: 0 0 0 2px #2e7d32;
}
.timeline-item.current .ti-icon {
  background: $brand;
  color: #fff;
  box-shadow: 0 0 0 2px $brand, 0 8px 20px -4px rgba(204, 0, 0, 0.4);
  transform: scale(1.05);
}

.ti-content {
  flex: 1;
  padding-top: 6px;
}
.ti-header {
  display: flex;
  justify-content: space-between;
  align-items: baseline;
  gap: 12px;
  margin-bottom: 4px;
  flex-wrap: wrap;
}
.ti-title {
  font-size: 16px;
  font-weight: 700;
  color: #1f2937;
}
.timeline-item.current .ti-title { color: $brand; }
.timeline-item.pending .ti-title { color: #9ca3af; font-weight: 600; }

.ti-date {
  font-size: 13px;
  color: #6b7280;
  font-weight: 500;
  white-space: nowrap;
  &.pending { color: #d1d5db; font-style: italic; }
}
.ti-desc {
  font-size: 13px;
  color: #6b7280;
  line-height: 1.5;
}
.timeline-item.pending .ti-desc { color: #d1d5db; }

.ti-current-badge {
  display: inline-flex;
  align-items: center;
  gap: 6px;
  margin-top: 8px;
  padding: 4px 10px;
  background: #fef2f2;
  border: 1px solid #fecaca;
  color: $brand;
  border-radius: 20px;
  font-size: 11px;
  font-weight: 700;
  letter-spacing: 0.5px;
  text-transform: uppercase;
}
.dot {
  width: 6px;
  height: 6px;
  background: $brand;
  border-radius: 50%;
  animation: blink 1.5s infinite;
}
@keyframes blink {
  0%, 100% { opacity: 1; }
  50% { opacity: 0.3; }
}

.info-grid {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 16px;
  .card { margin-bottom: 0; }
}
.card-header {
  display: flex;
  align-items: center;
  gap: 10px;
  margin-bottom: 14px;
  font-size: 13px;
  font-weight: 700;
  color: #6b7280;
  text-transform: uppercase;
  letter-spacing: 0.8px;
  svg { color: $brand; }
}
.card-main {
  font-size: 16px;
  font-weight: 700;
  color: #0f0f0f;
  margin-bottom: 4px;
  text-transform: capitalize;
  &--sm { font-size: 14px; text-transform: none; }
}
.card-sub {
  font-size: 13px;
  color: #6b7280;
  line-height: 1.5;
}

.tracking-row {
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 8px 12px;
  background: #f9fafb;
  border-radius: 8px;
  margin-top: 12px;
}
.tracking-code {
  font-family: 'Courier New', monospace;
  font-size: 13px;
  font-weight: 600;
  letter-spacing: 0.5px;
}
.btn-copy {
  background: none;
  border: none;
  cursor: pointer;
  color: $brand;
  padding: 4px;
  display: flex;
  align-items: center;
  border-radius: 4px;
  &:hover { background: #fef2f2; }
}
.btn-track {
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 6px;
  margin-top: 12px;
  padding: 10px 16px;
  background: $brand;
  color: #fff;
  border-radius: 10px;
  font-size: 14px;
  font-weight: 600;
  text-decoration: none;
  &:hover { background: darken($brand, 8%); color: #fff; }
}

@media (max-width: 640px) {
  .info-grid { grid-template-columns: 1fr; }
  .card { padding: 20px; }
}
</style>
