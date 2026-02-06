<template>
  <!-- Overlay -->
  <Transition name="fade">
    <div v-if="modelValue" class="drawer-overlay" @click="close" />
  </Transition>

  <!-- Drawer -->
  <Transition name="slide">
    <div v-if="modelValue" class="drawer" :class="[`drawer-${size}`]">
      <!-- Header -->
      <div class="drawer-header">
        <div class="drawer-icon">
          <i class="icon" :class="icon"></i>
        </div>
        <div class="drawer-header-content">
          <h2 v-if="title" class="drawer-title">{{ title }}</h2>
          <p v-if="subtitle" class="drawer-subtitle">{{ subtitle }}</p>
        </div>
        <UiButton @click="close">
          <IconClose />
        </UiButton>
      </div>

      <!-- Body -->
      <div class="drawer-body">
        <slot />
      </div>

      <!-- Footer (opcional) -->
      <div v-if="$slots.footer" class="drawer-footer">
        <slot name="footer" />
      </div>
    </div>
  </Transition>
</template>

<script setup>
import { watch } from 'vue'

const props = defineProps({
  modelValue: {
    type: Boolean,
    default: false,
  },
  icon: {
    type: String,
    default: 'fa fa-heart-rate',
  },
  title: {
    type: String,
    default: '',
  },
  subtitle: {
    type: String,
    default: '',
  },
  size: {
    type: String,
    default: 'md', // sm, md, lg, xl, full
    validator: (value) => ['sm', 'md', 'lg', 'xl', 'full'].includes(value),
  },
  closeOnOverlay: {
    type: Boolean,
    default: true,
  },
  closeOnEsc: {
    type: Boolean,
    default: true,
  },
})

const emit = defineEmits(['update:modelValue', 'close'])

const close = () => {
  if (props.closeOnOverlay) {
    emit('update:modelValue', false)
    emit('close')
  }
}

// Fecha com ESC
const handleKeydown = (e) => {
  if (e.key === 'Escape' && props.closeOnEsc && props.modelValue) {
    close()
  }
}

// Previne scroll do body quando drawer está aberto
watch(
  () => props.modelValue,
  (newValue) => {
    if (newValue) {
      document.body.style.overflow = 'hidden'
      window.addEventListener('keydown', handleKeydown)
    } else {
      document.body.style.overflow = ''
      window.removeEventListener('keydown', handleKeydown)
    }
  }
)
</script>

<style lang="stylus" scoped>
@import './styles.styl'
</style>