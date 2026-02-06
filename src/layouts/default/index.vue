<template>
  <div class="layout">
    <!-- Sidebar principal -->
    <AppSidebar />

    <!-- Sub-sidebar -->
    <AppSubSidebar />

    <!-- Content wrapper -->
    <div class="content-wrapper">
      <!-- Header -->
      <AppHeader @search="handleSearch" />

      <!-- Main content -->
      <main class="main-content">
        <slot />
      </main>
    </div>
  </div>
</template>

<script setup>
import { watch } from 'vue'
import { useRoute } from 'vue-router' // ou 'nuxt/app' se for Nuxt 3
import { useNavigationStore } from '@/stores/navigation'

const route = useRoute()
const navStore = useNavigationStore()

// Sincroniza automaticamente quando a rota muda
watch(
  () => route.path,
  () => {
    navStore.syncWithRoute(route)
  },
  { immediate: true }
)

const handleSearch = (query) => {
  console.log('Busca:', query)
}
</script>

<style scoped>
.layout {
  display: flex;
  height: 100vh;
  overflow: hidden;
}

.content-wrapper {
  flex: 1;
  display: flex;
  flex-direction: column;
  overflow: hidden;
}

.main-content {
  flex: 1;
  background-color: #fff;
  overflow-y: auto;
}
</style>
