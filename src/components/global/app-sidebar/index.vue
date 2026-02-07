<template>
  <div class="sidebar">
    <IconFacilita class="icon" />
    <SidebarItem
      v-for="item in navStore.sidebarItems"
      :key="item.id"
      :item="item"
      :is-active="navStore.activeItemId === item.id"
      @click="navStore.toggleSubSidebar(item.id)"
    />
  </div>
</template>

<script setup>
import SidebarItem from '@/components/global/app-sidebar/sidebar-item'
import { useNavigationStore } from '@/stores/navigation'

const navStore = useNavigationStore()
</script>

<style lang="stylus" scoped>
@import './styles.styl'
</style>
