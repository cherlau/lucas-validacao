<template>
  <div class="sub-item" :class="{ expanded: isExpanded }">
    <div class="sub-item-header" @click="toggleExpand">
      <span :class="{ active: isExpanded }">{{ item.name }}</span>
      <i v-if="item.children" class="fas fa-chevron-down" :class="{ rotated: isExpanded }" />
    </div>
    <div v-if="isExpanded && item.children" class="sub-item-children">
      <NuxtLink
        v-for="child in item.children"
        :key="child.id"
        :to="child.route"
        class="sub-item-child"
        :class="{ 'active-child': isChildActive(child) }"
      >
        {{ child.name }}
      </NuxtLink>
    </div>
  </div>
</template>

<script setup>
import { ref } from 'vue'
import { useRoute } from 'vue-router'

const props = defineProps({
  item: {
    type: Object,
    required: true,
  },
})

const route = useRoute()
const isExpanded = ref(false) // controla a expansão localmente

const toggleExpand = () => {
  if (props.item.children) {
    isExpanded.value = !isExpanded.value // abre/fecha ao clicar
  }
}

const isChildActive = (child) => {
  return route.path === child.route
}
</script>

<style lang="stylus" scoped>
@import './styles.styl'
</style>
