<template>
  <div class="accordion">
    <!-- Cabeçalho -->
    <button class="accordion-header" @click="isOpen = !isOpen">
      <span>{{ title }}</span>
      <IconChevron class="chevron" :class="{ open: isOpen }" />
    </button>

    <!-- Conteúdo -->
    <div v-if="isOpen" class="accordion-content">
      <pre>{{ formattedCode }}</pre>
      <UiButton variant="transparent" class="copy-btn" @click="copyToClipboard"
        ><IconCopy
      /></UiButton>
    </div>
  </div>
</template>

<script setup>
import { ref, computed } from 'vue'

const props = defineProps({
  title: { type: String, default: 'Requisição Recebida' },
  code: { type: [String, Object], required: true },
})

const isOpen = ref(false)

const formattedCode = computed(() => {
  if (typeof props.code === 'string') return props.code
  try {
    return JSON.stringify(props.code, null, 2)
  } catch {
    return String(props.code)
  }
})

function copyToClipboard() {
  navigator.clipboard.writeText(formattedCode.value)
}
</script>

<style lang="stylus" scoped>
@import './styles.styl'
</style>