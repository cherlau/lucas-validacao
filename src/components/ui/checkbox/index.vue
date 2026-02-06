<template>
  <label class="fac-checkbox" :class="design">
    <input
      :id="inputId"
      v-model="model"
      v-bind="attrs"
      type="checkbox"
      :name="name"
      :disabled="disabled"
      :data-ui="dataUi || undefined"
      @change="handleChange"
    />
    <span v-if="label" class="label">{{ label }}</span>
  </label>
</template>

<script setup>
import { computed, useAttrs } from 'vue'
// Assumindo que você tenha um gerador de ID
import { generateUniqueId } from '~/utils/generators/id-generator'

// 1. Define o nome do componente e desativa a herança de atributos
defineOptions({
  name: 'UiCheckbox',
  inheritAttrs: false,
})

// 2. Define as props do componente
const props = defineProps({
  label: {
    type: String,
    default: '',
  },
  name: {
    type: String,
    default: '',
  },
  design: {
    type: String,
    default: '',
  },
  disabled: {
    type: Boolean,
    default: false,
  },
  dataUi: {
    type: String,
    default: '',
  },
})

// 3. Usa defineModel() para um v-model simplificado (substitui :checked e @input)
const model = defineModel({
  type: [Boolean, Array], // Checkbox pode ser usado com booleano ou array
  default: false,
})

const attrs = useAttrs()
const emit = defineEmits(['change'])

// 4. Lógica de ID dinâmico, igual ao UiInput
const inputId = computed(() => {
  return attrs.id || generateUniqueId('checkbox')
})

// 5. Função para emitir um evento 'change' padronizado, se necessário
function handleChange(event) {
  // O v-model já atualizou o 'model'.
  // Este emit é para casos onde o componente pai quer ouvir o evento @change nativo.
  emit('change', event.target.checked)
}
</script>

<style lang="stylus" scoped>
@import './styles.styl';
</style>
