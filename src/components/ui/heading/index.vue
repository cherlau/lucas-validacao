<template>
  <div class="ui-heading" :class="`size-${size}`">
    <div class="main-content">
      <div class="title-line">
        <component :is="titleTag" class="title">
          {{ title }}
          <slot name="title-accent" />
        </component>
      </div>

      <p v-if="subtitle" class="subtitle">{{ subtitle }}</p>

      <div v-if="$slots.meta" class="meta-line">
        <slot name="meta" />
      </div>
    </div>
  </div>
</template>

<script setup>
defineOptions({
  name: 'UiHeading',
})

defineProps({
  title: {
    type: String,
    required: true,
  },
  subtitle: {
    type: String,
    default: null,
  },
  titleTag: {
    type: String,
    default: 'h2',
  },
  size: {
    type: String,
    default: 'h2', // Tamanho visual padrão
    validator: (value) => {
      // Validamos para garantir que apenas os tamanhos mapeados no CSS sejam usados
      return ['h1', 'h2', 'h3', 'h4'].includes(value)
    },
  },
})
</script>

<style lang="stylus" scoped>
@import './styles.styl'
</style>