<template>
  <div class="code-box">
    <div v-if="title" class="code-box__header">
      <span class="code-box__label">{{ title }}</span>
    </div>

    <div class="code-box__content">
      <pre class="code-box__code">{{ formattedCode }}</pre>
      <UiButton variant="transparent" background="#FFF" class="copy-btn" @click="copyToClipboard">
        <IconCopy />
      </UiButton>
    </div>
  </div>
</template>

<script setup>
import { computed } from 'vue'

const props = defineProps({
  title: { type: String, default: '' },
  code: { type: [String, Object], required: true },
})

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
