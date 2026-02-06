<template>
  <button
    :type="type"
    class="ui-button"
    :class="[variant, size, { loading: loading, 'full-width': fullWidth }]"
    :style="dynamicStyles"
    :disabled="disabled || loading"
    :data-testid="dataTestid"
    v-bind="$attrs"
  >
    <slot name="icon" />

    <span v-if="$slots.default" class="button-text">
      <slot />
    </span>
  </button>
</template>

<script setup>
import { computed } from 'vue'
import { getTextColorForBackground } from '@/utils/generators/colors'

defineOptions({
  name: 'UiButton',
})

const props = defineProps({
  type: {
    type: String,
    default: 'button',
    validator: (value) => ['button', 'submit', 'reset'].includes(value),
  },
  loading: {
    type: Boolean,
    default: false,
  },
  disabled: {
    type: Boolean,
    default: false,
  },
  background: {
    type: String,
    default: null,
  },
  dataTestid: {
    type: String,
    default: null,
  },
  variant: {
    type: String,
    default: '',
  },
  size: {
    type: String,
    default: 'md',
    validator: (value) => ['xs', 'sm', 'md', 'lg', 'xl', 'xxl', 'xxxl'].includes(value),
  },
  fullWidth: {
    type: Boolean,
    default: false,
  },
})

const dynamicStyles = computed(() => {
  if (!props.background) {
    return null
  }

  return {
    backgroundColor: props.background,
    color: getTextColorForBackground(props.background),
    border: '1px solid #DFE6F0',
  }
})
</script>

<style lang="stylus" scoped>
@import './styles.styl'
</style>