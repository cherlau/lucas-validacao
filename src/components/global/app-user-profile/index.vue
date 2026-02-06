<template>
  <div class="user-profile" @click="toggleDropdown">
    <!-- Usando a imagem do usuário ou a padrão -->
    <img :src="user?.avatar || defaultAvatar" alt="Avatar" class="user-avatar" />
    <div class="user-info">
      <span class="user-name">{{ user?.name || 'Usuário' }}</span>
      <span class="user-role">{{ user?.role || 'Cargo' }}</span>
    </div>
    <i class="fas fa-chevron-down dropdown-icon"></i>

    <div v-if="isOpen" class="dropdown">
      <button @click="logout">Sair</button>
    </div>
  </div>
</template>

<script setup>
import { ref } from 'vue'
import { storeToRefs } from 'pinia'
import { useAuthStore } from '@/stores/auth'
import defaultAvatar from '@/assets/images/no-avatar.png' // import da imagem padrão

const authStore = useAuthStore()
const { user } = storeToRefs(authStore)

const isOpen = ref(false)

function toggleDropdown() {
  isOpen.value = !isOpen.value
}

function logout() {
  authStore.logout()
}
</script>

<style lang="stylus" scoped>
@import './styles.styl'
</style>
