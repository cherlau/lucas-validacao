<template>
  <div class="sidebar-item" :class="{ active: isActive }" @click="emit('click')">
    <component :is="iconComponent" />
    <span class="tooltip">{{ item.name }}</span>
  </div>
</template>

<script setup>
import { computed } from 'vue'
import * as FacilitaIcons from 'facilita-ds/icons'

const props = defineProps({
  item: {
    type: Object,
    required: true,
  },
  isActive: {
    type: Boolean,
    default: false,
  },
})

const emit = defineEmits(['click'])

const iconComponent = computed(() => {
  return FacilitaIcons[props.item.icon] || null
})
</script>

<style lang="stylus" scoped>
@import './styles.styl'
</style>
