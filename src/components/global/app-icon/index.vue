<template>
  <NuxtLink v-if="clickable" to="/" :aria-label="ariaLabel">
    <img :src="logoSrc" :alt="alt" class="app-logo" :class="size" />
  </NuxtLink>

  <div v-else>
    <img :src="logoSrc" :alt="alt" class="app-logo" :class="size" />
  </div>
</template>

<script setup>
import { computed } from 'vue'

import logoDefault from '@/assets/images/logos/facilita-icon.png'
import logoWhite from '@/assets/images/logos/facilita-icon-white.png'

const props = defineProps({
  variant: {
    type: String,
    default: 'default',
    validator: (value) => ['default', 'white'].includes(value),
  },
  clickable: {
    type: Boolean,
    default: true,
  },
  alt: {
    type: String,
    default: 'Logo da Facilita',
  },
  ariaLabel: {
    type: String,
    default: 'Voltar para a página inicial',
  },
  size: {
    type: String,
    default: 'md',
    validator: (value) => {
      return ['md', 'lg'].includes(value)
    },
  },
})

const logoSrc = computed(() => {
  if (props.variant === 'white') return logoWhite
  return logoDefault
})
</script>

<style lang="stylus" scoped>
@import './styles.styl'
</style>