<template>
  <header class="header">
    <div class="header-icon">
      <component :is="headerIcon" v-if="headerIcon" fill="#5e5cf0" width="21" height="21" />
    </div>

    <div class="header-content">
      <div class="header-title">
        <span v-if="navStore.currentPageTitle">
          {{ navStore.currentPageTitle }}
        </span>
        <span v-if="navStore.currentPageCategory">
          {{ navStore.currentPageCategory }}
        </span>
      </div>

      <div class="header-actions">
        <div class="header-search">
          <UiInput background-color="#F8FBFF" :search="true" placeholder="Busca rápida" size="sm" />
        </div>

        <div class="header-user">
          <AppUserProfile />
        </div>
      </div>
    </div>
  </header>
</template>

<script setup>
import { computed } from 'vue'
import { useNavigationStore } from '@/stores/navigation'
import { FacilitaIcons } from '@/components/icon'

const navStore = useNavigationStore()

const headerIcon = computed(() => {
  const iconName = navStore.currentPageIcon

  if (!iconName) {
    return FacilitaIcons.window
  }

  return FacilitaIcons[iconName] ?? FacilitaIcons.window
})
</script>

<style lang="stylus" scoped>
@import './styles.styl'
</style>
