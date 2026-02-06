<template>
  <div class="ui-input" :class="[{ error: error }, size, { searchable: search }]">
    <label v-if="label" :for="inputId" class="label">{{ label }}</label>

    <div class="input-wrapper">
      <span v-if="search" class="search-icon">
        <svg
          xmlns="http://www.w3.org/2000/svg"
          width="16"
          height="16"
          fill="#89A1BF"
          viewBox="0 0 16 16"
        >
          <path
            d="M11.742 10.344a6.5 6.5 0 1 0-1.397 1.398h-.001c.03.04.062.078.098.115l3.85 3.85a1 1 0 0 0 1.415-1.414l-3.85-3.85a1.007 1.007 0 0 0-.115-.1zM12 6.5a5.5 5.5 0 1 1-11 0 5.5 5.5 0 0 1 11 0z"
          />
        </svg>
      </span>

      <slot name="prepend" />

      <input
        :id="inputId"
        v-model="model"
        v-maska="mask"
        class="input"
        :class="[{ 'full-width': fullWidth }]"
        v-bind="$attrs"
        :style="inputStyles"
      />

      <slot name="append" />
    </div>

    <p v-if="error" class="error-message" role="alert">
      {{ error }}
    </p>
  </div>
</template>

<script setup>
import { computed, useAttrs } from 'vue'
import { generateUniqueId } from '@/utils/generators/id-generator'

defineOptions({
  name: 'UiInput',
  inheritAttrs: false,
})

const props = defineProps({
  label: {
    type: String,
    default: '',
  },
  mask: {
    type: String,
    default: '',
  },
  error: {
    type: String,
    default: '',
  },
  size: {
    type: String,
    default: 'md', // 'xs', 'sm', 'md', 'lg', 'xl', 'xxl', 'xxxl'
    validator: (value) => {
      return ['xs', 'sm', 'md', 'lg', 'xl', 'xxl', 'xxxl'].includes(value)
    },
  },
  search: {
    type: Boolean,
    default: false,
  },
  backgroundColor: {
    // Nova prop
    type: String,
    default: '',
  },
  fullWidth: {
    type: Boolean,
    default: true,
  },
})

const model = defineModel()
const attrs = useAttrs()

const inputStyles = computed(() => {
  const styles = {}
  if (props.backgroundColor) {
    styles.backgroundColor = props.backgroundColor
  }
  return styles
})

const inputId = computed(() => {
  return attrs.id || generateUniqueId(props.label || 'input')
})
</script>

<style lang="stylus" scoped>
@import './styles.styl'
</style>
