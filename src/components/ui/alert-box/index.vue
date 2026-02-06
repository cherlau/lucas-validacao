<template>
  <div class="alert" :class="`alert--${type}`" role="alert" aria-live="assertive">
    <!-- Ícone -->
    <div class="alert__icon" aria-hidden="true">
      <slot name="icon">
        <i :class="icons[type]"></i>
      </slot>
    </div>

    <!-- Conteúdo -->
    <div class="alert__content">
      <!-- Título: prop title ou padrão -->
      <h4 class="alert__title">{{ computedTitle }}</h4>

      <!-- Slot para conteúdo -->
      <slot />
    </div>
  </div>
</template>

<script setup>
const props = defineProps({
  type: {
    type: String,
    default: 'info',
    validator: (v) => ['info', 'warning', 'success', 'error'].includes(v),
  },
  title: {
    type: String,
    default: '',
  },
})

// Ícones (mantém as cores padrão via classe)
const icons = {
  info: 'far fa-circle-info',
  warning: 'far fa-triangle-exclamation',
  success: 'far fa-circle-check',
  error: 'far fa-circle-xmark',
}

// Títulos padrão por tipo
const defaultTitles = {
  info: 'Informação',
  warning: 'Atenção',
  success: 'Sucesso',
  error: 'Erro',
}

// Computed title
const computedTitle = props.title || defaultTitles[props.type]
</script>

<style lang="stylus" scoped>
.alert
  display flex
  align-items flex-start
  gap 0.75rem
  padding 1rem 1.25rem
  border-radius 8px
  font-size 0.9375rem
  line-height 1.4
  transition(all, 0.3s ease)

  &__icon
    font-size 1.25rem
    margin-top 0.15rem
    flex-shrink 0

  &__content
    flex 1

  &__title
    margin 0 0 0.25rem 0
    font-weight 600
    font-size 1rem
    line-height 1.2

  /* ===== VARIAÇÕES DE COR ===== */
  &--info
    background #F4F7FF
    border 1px solid #C3D1FF
    color #2E4B9C // Ícone nesta cor

    .alert__title
      color #1E3A8A

    .alert__content
      color #324B9C

  &--warning
    background #FFF9F1
    border 1px solid #F0C98B
    color #B25E00 // Ícone nesta cor

    .alert__title
      color #7A4A00

    .alert__content
      color #8F5600

  &--success
    background #F1FFF4
    border 1px solid #A8E6A3
    color #1E7B24 // Ícone nesta cor

    .alert__title
      color #145D19

    .alert__content
      color #196F1F

  &--error
    background #FFF4F4
    border 1px solid #F2A5A5
    color #B91C1C // Ícone nesta cor

    .alert__title
      color #7A1C1C

    .alert__content
      color #8F1C1C
</style>
