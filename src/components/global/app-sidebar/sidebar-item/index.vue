<template>
  <div class="sidebar-item" :class="{ active: isActive }" @click="emit('click')">
    <component
      :is="iconComponent"
      v-if="iconComponent"
      class="icon"
      :fill="isActive ? '#fff' : '#696d81'"
    />

    <span class="tooltip">{{ item.name }}</span>
  </div>
</template>

<script setup>
import { computed } from 'vue'
import { FacilitaIcons } from '@/components/icon'

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
  return FacilitaIcons[props.item.icon] ?? null
})
</script>

<style lang="stylus" scoped>
@import './styles.styl'
</style>
