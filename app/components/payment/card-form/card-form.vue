<template>
  <div class="card-form">
    <div class="card-list">
      <Card
        :fields="fields"
        :labels="formData"
        :isCardNumberMasked="isCardNumberMasked"
        :randomBackgrounds="randomBackgrounds"
        :backgroundImage="backgroundImage"
      />
    </div>
    <div class="card-form__inner">
      <div class="card-input">
        <label for="cardNumber" class="card-input__label">Numero do Cartão</label>
        <input
          type="tel"
          :id="fields.cardNumber"
          @input="changeNumber"
          @focus="focusCardNumber"
          @blur="blurCardNumber"
          class="card-input__input"
          :value="formData.cardNumber"
          :maxlength="cardNumberMaxLength"
          data-card-field
          autocomplete="off"
          v-on:keyup.enter="($event.target as HTMLElement).parentElement?.nextElementSibling?.querySelector('input')?.focus()"
        />
        <button
          class="card-input__eye"
          :class="{ '-active' : !isCardNumberMasked }"
          title="Show/Hide card number"
          tabindex="-1"
          :disabled="formData.cardNumber === ''"
          @click="toggleMask"
        ></button>
      </div>
      <div class="card-input">
        <label for="cardName" class="card-input__label">Nome Titular</label>
        <input
          type="text"
          :id="fields.cardName"
          @input="changeName"
          class="card-input__input"
          :value="formData.cardName"
          data-card-field
          autocomplete="off"
        />
      </div>
      <div class="card-form__row">
        <div class="card-form__col">
          <div class="card-form__group">
            <label for="cardMonth" class="card-input__label">Vencimento</label>
            <select
              class="card-input__input -select"
              :id="fields.cardMonth"
              v-model="formData.cardMonth"
              @change="changeMonth"
              data-card-field
            >
              <option value="" disabled selected>Mês</option>
              <option
                v-bind:value="n < 10 ? '0' + n : n"
                v-for="n in 12"
                v-bind:disabled="n < minCardMonth"
                v-bind:key="n"
              >{{generateMonthValue(n)}}</option>
            </select>
            <select
              class="card-input__input -select"
              :id="fields.cardYear"
              v-model="formData.cardYear"
              @change="changeYear"
              data-card-field
            >
              <option value="" disabled selected>Ano</option>
              <option
                v-bind:value="$index + minCardYear"
                v-for="(n, $index) in 12"
                v-bind:key="n"
              >{{$index + minCardYear}}</option>
            </select>
          </div>
        </div>
        <div class="card-form__col -cvv">
          <div class="card-input">
            <label for="cardCvv" class="card-input__label">CVV</label>
            <input
              type="tel"
              class="card-input__input"
              :id="fields.cardCvv"
              maxlength="4"
              :value="formData.cardCvv"
              @input="changeCvv"
              data-card-field
              autocomplete="off"
              v-on:keyup.enter="invaildCard"
            />
          </div>
        </div>
      </div>
        <label for="cardInstallments" class="card-input__label">Parcelas</label>
        <select class="card-input__input -select mb-2" :id="fields.cardInstallments" @change="changeInstallments" v-model="formData.installments" data-card-field>
            <option value="1">
                {{ price(valor1x) }} em 1x com 12% de desconto
            </option>
            <option v-for="parcela of [2,3]" :key="parcela" :value="parcela">
              {{ price(valor3x) }} em {{ parcela }}x com 10% de desconto de {{ price((valor3x)/parcela) }}
            </option>
            <option v-for="parcela of [4,5,6,7,8,9,10,11,12]" :key="parcela" :value="parcela">
                {{ price(valor) }} em {{ parcela }}x sem juros de {{ price((valor)/parcela) }}
            </option>
        </select>
        <div class="alert alert-danger mt-3 mb-3" v-if="error != ''">{{error}}</div>
      <button class="btn btn-primary btn-xl btn-block"
      :class="{ 'btn-secondary btn-loading': !btnSubmit }" @click="invaildCard">Pagar</button>
      <button class="card-form__button" style="background-color: gray" @click="$emit('close')">Voltar</button>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, watch, onMounted } from 'vue'
import Card from '~/components/payment/card-form/card.vue'

const props = withDefaults(defineProps<{
    valor?: number
    valor1x?: number
    valor3x?: number
    btnSubmit?: boolean
    error?: string
    backgroundImage?: string | object
    randomBackgrounds?: boolean
    debito?: boolean
}>(), {
    valor: 0,
    valor1x: 0,
    valor3x: 0,
    btnSubmit: true,
    error: '',
    randomBackgrounds: true,
    debito: false
})

const formData = reactive({
    cardName: '',
    cardNumber: '',
    cardNumberNotMask: '',
    cardMonth: '',
    cardYear: '',
    cardCvv: '',
    installments: 1
})

const emit = defineEmits<{
    close: []
    submitCard: [formData: any]
    'input-card-name': [value: string]
    'input-card-number': [value: string]
    'input-card-month': [value: string]
    'input-card-year': [value: string]
    'input-card-cvv': [value: string]
    'input-card-installments': [value: string]
}>()

const { price } = usePrice()

const fields = ref({
    cardNumber: 'v-card-number',
    cardName: 'v-card-name',
    cardMonth: 'v-card-month',
    cardYear: 'v-card-year',
    cardCvv: 'v-card-cvv',
    cardInstallments: 'v-card-installments'
})

const minCardYear = ref(new Date().getFullYear())
const isCardNumberMasked = ref(true)
const mainCardNumber = ref('')
const cardNumberMaxLength = ref(19)

const minCardMonth = computed(() => {
    if (formData.cardYear === minCardYear.value) return new Date().getMonth() + 1
    return 1
})

watch(() => formData.cardYear, () => {
    if (formData.cardMonth < minCardMonth.value) {
        formData.cardMonth = ''
    }
})

onMounted(() => {
    maskCardNumber()
})

function generateMonthValue(n: number) {
    return n < 10 ? `0${n}` : n
}

function changeName(e: Event) {
    formData.cardName = (e.target as HTMLInputElement).value
    emit('input-card-name', formData.cardName)
}

function changeNumber(e: Event) {
    formData.cardNumber = (e.target as HTMLInputElement).value
    const value = formData.cardNumber.replace(/\D/g, '')
    if ((/^3[47]\d{0,13}$/).test(value)) {
        formData.cardNumber = value.replace(/(\d{4})/, '$1 ').replace(/(\d{4}) (\d{6})/, '$1 $2 ')
        cardNumberMaxLength.value = 17
    } else if ((/^3(?:0[0-5]|[68]\d)\d{0,11}$/).test(value)) {
        formData.cardNumber = value.replace(/(\d{4})/, '$1 ').replace(/(\d{4}) (\d{6})/, '$1 $2 ')
        cardNumberMaxLength.value = 16
    } else if ((/^\d{0,16}$/).test(value)) {
        formData.cardNumber = value.replace(/(\d{4})/, '$1 ').replace(/(\d{4}) (\d{4})/, '$1 $2 ').replace(/(\d{4}) (\d{4}) (\d{4})/, '$1 $2 $3 ')
        cardNumberMaxLength.value = 19
    }
    if ((e as InputEvent).inputType == 'deleteContentBackward') {
        const lastChar = formData.cardNumber.substring(formData.cardNumber.length, formData.cardNumber.length - 1)
        if (lastChar == ' ') { formData.cardNumber = formData.cardNumber.substring(0, formData.cardNumber.length - 1) }
    }
    emit('input-card-number', formData.cardNumber)
}

function changeMonth() {
    emit('input-card-month', formData.cardMonth)
}

function changeYear() {
    emit('input-card-year', formData.cardYear)
}

function changeCvv(e: Event) {
    formData.cardCvv = (e.target as HTMLInputElement).value
    emit('input-card-cvv', formData.cardCvv)
}

function changeInstallments(e: Event) {
    formData.installments = (e.target as HTMLInputElement).value
    emit('input-card-installments', formData.installments)
}

function invaildCard() {
    const number = formData.cardNumberNotMask.replace(/ /g, '')
    let sum = 0
    for (let i = 0; i < number.length; i++) {
        let intVal = parseInt(number.substr(i, 1))
        if (i % 2 === 0) {
            intVal *= 2
            if (intVal > 9) {
                intVal = 1 + (intVal % 10)
            }
        }
        sum += intVal
    }
    if (sum % 10 !== 0) {
        alert('Número do Cartão Inválido')
    } else {
        emit('submitCard', formData)
    }
}

function blurCardNumber() {
    if (isCardNumberMasked.value) {
        maskCardNumber()
    }
}

function maskCardNumber() {
    formData.cardNumberNotMask = formData.cardNumber
    mainCardNumber.value = formData.cardNumber
    const arr = formData.cardNumber.split('')
    arr.forEach((element: string, index: number) => {
        if (index > 4 && index < 14 && element.trim() !== '') {
            arr[index] = '*'
        }
    })
    formData.cardNumber = arr.join('')
}

function unMaskCardNumber() {
    formData.cardNumber = mainCardNumber.value
}

function focusCardNumber() {
    unMaskCardNumber()
}

function toggleMask() {
    isCardNumberMasked.value = !isCardNumberMasked.value
    if (isCardNumberMasked.value) {
        maskCardNumber()
    } else {
        unMaskCardNumber()
    }
}
</script>
