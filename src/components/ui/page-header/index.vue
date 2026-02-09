<template>
  <div class="page-header">
    <!-- Se tiver slots personalizados -->
    <div class="page-header-content content-area">
      <template v-if="$slots.default || $slots.right">
        <div class="page-header__custom">
          <div class="page-header__left">
            <slot></slot>
          </div>
          <div v-if="$slots.right" class="page-header__right">
            <slot name="right"></slot>
          </div>
        </div>
      </template>

      <!-- Caso contrário, exibe layout padrão -->
      <template v-else>
        <!-- Título e descrição -->
        <div v-if="title || description" class="page-header__info">
          <h1 class="page-header__title">
            {{ title }}
            <span v-if="highlight" class="page-header__highlight">{{ highlight }}</span>
          </h1>
          <p v-if="description" class="page-header__description">
            {{ description }}
          </p>
        </div>

        <!-- Abas -->
        <div v-if="tabs.length" class="page-header__tabs">
          <button
            v-for="tab in tabs"
            :key="tab.value"
            class="page-header__tab"
            :class="{ 'is-active': tab.value === activeTab }"
            @click="$emit('update:activeTab', tab.value)"
          >
            <i v-if="tab.icon" class="icon-button" :class="tab.icon"></i>
            <span class="page-header__tab-label">{{ tab.label }}</span>
          </button>
        </div>

        <!-- Botão -->
        <div v-if="actionLabel" class="page-header__action">
          <UiButton variant="primary" size="md" @click="$emit('action')">
            {{ actionLabel }}
          </UiButton>
        </div>
      </template>
    </div>
  </div>
</template>

<script setup>
defineProps({
  title: {
    type: String,
    default: '',
  },
  highlight: {
    type: String,
    default: '',
  },
  description: {
    type: String,
    default: '',
  },
  tabs: {
    type: Array,
    default: () => [],
  },
  activeTab: {
    type: String,
    default: '',
  },
  actionLabel: {
    type: String,
    default: '',
  },
})

defineEmits(['action', 'update:activeTab'])
</script>

<style lang="stylus" scoped>
@import './styles.styl'

.page-header__custom {
	display: flex
	justify-content: space-between
	width: 100%
	padding-block: 17px
}

.page-header__left {
	display: flex
	gap: 10px
}
</style>
