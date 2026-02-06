<template>
  <header class="header">
    <div class="header-icon">
      <component :is="headerIcon" v-if="false" width="21" height="21" />
      <IconWindow width="21" height="21" />
    </div>
    <div class="header-content">
      <div class="header-title">
        <span v-if="navStore.currentPageTitle">{{ navStore.currentPageTitle }}</span>
        <span v-if="navStore.currentPageCategory">{{ navStore.currentPageCategory }}</span>
      </div>
      <div class="header-actions">
        <div class="header-search">
          <UiInput
            background-color="#F8FBFF"
            :search="true"
            placeholder="Busca rápida"
            size="sm"
            mask="###-###"
          />
        </div>
        <div class="header-user">
          <!-- <UserProfile /> -->
          <AppUserProfile />
        </div>
      </div>
    </div>
  </header>
</template>

<script setup>
import { computed } from 'vue'
import * as FacilitaIcons from 'facilita-ds/icons'
import { useNavigationStore } from '@/stores/navigation'

const emit = defineEmits(['search'])
const navStore = useNavigationStore()

// Resolve o ícone dinamicamente
const headerIcon = computed(() => {
  if (!navStore.currentPageIcon) return null
  return FacilitaIcons[navStore.currentPageIcon] || null
})
</script>

<style lang="stylus" scoped>
@import './styles.styl'
</style>
