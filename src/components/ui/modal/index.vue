<template>
  <!-- Overlay -->
  <Transition name="fade">
    <div v-if="modelValue" class="modal-overlay" @click="handleOverlayClick" />
  </Transition>

  <!-- Modal -->
  <Transition name="zoom">
    <div v-if="modelValue" class="modal-wrapper">
      <div class="modal" :class="[`modal-${size}`]">
        <!-- Header -->
        <div class="modal-header">
          <div class="modal-icon">
            <i class="icon" :class="icon"></i>
          </div>
          <div class="modal-header-content">
            <template v-if="$slots.header">
              <slot name="header" />
            </template>
            <template v-else>
              <h2 v-if="title" class="modal-title">{{ title }}</h2>
              <p v-if="subtitle" class="modal-subtitle">{{ subtitle }}</p>
            </template>
          </div>
          <UiButton size="md" class="btn-close" @click="close">
            <IconClose />
          </UiButton>
        </div>

        <!-- Body -->
        <div class="modal-body">
          <slot />
        </div>

        <!-- Footer (opcional) -->
        <div v-if="$slots.footer" class="modal-footer">
          <slot name="footer" />
        </div>
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
    default: 'fa fa-info-circle',
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
  emit('update:modelValue', false)
  emit('close')
}

const handleOverlayClick = () => {
  if (props.closeOnOverlay) {
    close()
  }
}

// Fecha com ESC
const handleKeydown = (e) => {
  if (e.key === 'Escape' && props.closeOnEsc && props.modelValue) {
    close()
  }
}

// Previne scroll do body quando modal está aberto
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
