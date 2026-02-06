<template>
  <button
    class="dropdown-item"
    :class="[`variant-${variant}`, { disabled }]"
    :disabled="disabled"
    @click="handleClick"
  >
    <span v-if="$slots.icon" class="item-icon">
      <slot name="icon"></slot>
    </span>

    <span class="item-label">
      <slot></slot>
    </span>
  </button>
</template>

<script setup>
const props = defineProps({
  variant: {
    type: String,
    default: 'default', // 'default' | 'danger'
  },
  disabled: {
    type: Boolean,
    default: false,
  },
})

const emit = defineEmits(['click'])

const handleClick = (event) => {
  if (!props.disabled) {
    emit('click', event)
  }
}
</script>

<style scoped>
.dropdown-item {
  display: flex;
  align-items: center;
  width: 100%;
  padding: 10px 16px;
  border: none;
  background: none;
  text-align: left;
  cursor: pointer;
  font-size: 13px;
  color: #334155;
  transition: background-color 0.15s;
  white-space: nowrap;
}

.dropdown-item:hover:not(.disabled) {
  background-color: #f8fafc;
  color: #0f172a;
}

/* Espaçamento do ícone */
.item-icon {
  display: flex;
  align-items: center;
  margin-right: 8px;
  color: #94a3b8;
}

.dropdown-item:hover .item-icon {
  color: #64748b;
}

/* Variantes */
.variant-danger {
  color: #dc2626;
}
.variant-danger:hover:not(.disabled) {
  background-color: #fef2f2;
  color: #b91c1c;
}
.variant-danger .item-icon {
  color: #ef4444;
}

/* Estado Desabilitado */
.disabled {
  opacity: 0.5;
  cursor: not-allowed;
}
</style>
