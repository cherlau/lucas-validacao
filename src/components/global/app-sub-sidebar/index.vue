<template>
  <div class="sub-sidebar" :class="{ open: navStore.showSubSidebar }">
    <div v-if="navStore.activeItemName" class="sub-sidebar-header">
      <h3 class="sub-sidebar-title">{{ navStore.activeItemName }}</h3>
    </div>
    <div v-if="navStore.activeSubItems.length > 0" class="sub-sidebar-content">
      <SubSidebarItem v-for="item in navStore.activeSubItems" :key="item.id" :item="item" />
    </div>
  </div>
</template>

<script setup>
import SubSidebarItem from '@/components/global/app-sub-sidebar/sub-sidebar-item'
import { useNavigationStore } from '@/stores/navigation'

const navStore = useNavigationStore()
</script>

<style lang="stylus" scoped>
@import './styles.styl'
</style>