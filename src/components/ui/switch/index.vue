<template>
  <label class="fac-switch" :class="[design, { disabled: disabled }]">
    <div class="wrapper">
      <input
        :id="inputId"
        v-bind="attrs"
        type="checkbox"
        :checked="isChecked"
        :name="name"
        :disabled="disabled"
        :data-ui="dataUi"
        @change="onChange"
        @click="onClick"
      />
      <div class="switch">
        <span v-if="textOn">{{ textOn }}</span>
        <span v-if="textOff">{{ textOff }}</span>
      </div>
    </div>
    <div v-if="label" class="label" :style="{ fontSize: fontSize }" v-html="label" />
  </label>
</template>

<script setup>
import { computed, useAttrs } from 'vue'
// Assumindo que você tenha um gerador de ID, como no seu exemplo UiInput
import { generateUniqueId } from '~/utils/generators/id-generator'

// 1. Define o nome do componente e desativa a herança de atributos
defineOptions({
  name: 'UiSwitch',
  inheritAttrs: false,
})

// 2. Define as props no mesmo formato do UiInput
const props = defineProps({
  label: {
    type: String,
    default: '',
  },
  name: {
    type: String,
    default: undefined,
  },
  design: {
    type: String,
    default: '',
  },
  textOn: {
    type: String,
    default: '',
  },
  textOff: {
    type: String,
    default: '',
  },
  disabled: {
    type: Boolean,
    default: false,
  },
  valueTrue: {
    type: [String, Number, Boolean],
    default: true,
  },
  valueFalse: {
    type: [String, Number, Boolean],
    default: false,
  },
  fontSize: {
    type: String,
    default: '12px',
  },
  dataUi: {
    type: String,
    default: undefined,
  },
})

// 3. Usa defineModel() para um v-model simplificado
const model = defineModel({
  // O v-model é opcional, mas se for usado, deve ter um valor.
  // Pode ser `required: true` se o v-model for sempre obrigatório.
  default: false,
})

const attrs = useAttrs()
const emit = defineEmits(['click'])

// 4. Lógica de ID dinâmico, igual ao UiInput
const inputId = computed(() => {
  return attrs.id || generateUniqueId('switch')
})

// Propriedade computada para controlar o estado 'checked' baseado no v-model
const isChecked = computed(() => model.value === props.valueTrue)

function onChange(event) {
  // Atualiza o v-model com o valor correspondente (true/false)
  const isInputChecked = event.target.checked
  model.value = isInputChecked ? props.valueTrue : props.valueFalse
}

function onClick(event) {
  emit('click', event)
}
</script>

<style lang="stylus" scoped>
@import './styles.styl'
</style>
