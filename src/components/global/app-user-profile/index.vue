<template>
  <header class="top-header">
    <div class="actions-group">
      <button class="notification-btn">
        <i class="fal fa-bell"></i> <span class="notification-badge"></span>
      </button>

      <div class="user-profile" @click="toggleDropdown">
        <div class="avatar-container">
          <img :src="user?.avatar || defaultAvatar" alt="Avatar" class="user-avatar" />
          <span class="status-dot"></span>
        </div>

        <div class="user-info">
          <span class="user-name">{{ user?.name || 'John Bianchini' }}</span>
          <span class="user-role">{{ user?.role || 'Administrador' }}</span>
        </div>

        <i class="fas fa-chevron-down dropdown-icon" :class="{ rotated: isOpen }"></i>

        <div v-if="isOpen" class="dropdown-menu">
          <button class="dropdown-item" @click="logout">
            <i class="fas fa-sign-out-alt"></i> Sair
          </button>
        </div>
      </div>
    </div>
  </header>
</template>

<script setup>
import { ref } from 'vue'
import { storeToRefs } from 'pinia'
import { useAuthStore } from '@/stores/auth'
import defaultAvatar from '@/assets/images/no-avatar.png'

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
// Variáveis de cores baseadas na imagem (ajuste conforme seu tema)
$border-color = #DEE2E6
$text-dark = #002054
$text-light = #718096
$primary-blue = #3182CE
$notification-badge = #6B46C1
$status-green = #00C582
$bg-white = #FFFFFF

.top-header
  display flex
  align-items center
  justify-content space-between
  padding 10px 20px 10px 1px
  background $bg-white
  // border-bottom 1px solid $border-color // Opcional se quiser linha embaixo

// --- Grupo da Direita ---
.actions-group
  display flex
  align-items center
  gap 21px

// --- Notificação ---
.notification-btn
  position relative
  width 40px
  height 40px
  border 1px solid $border-color
  border-radius 8px
  background white
  color $text-dark
  display flex
  align-items center
  justify-content center
  cursor pointer
  transition background 0.2s

  &:hover
    background #F7FAFC

  i
    font-size 19px

  .notification-badge
    position absolute
    top 8px
    right 8px
    width 10px
    height 10px
    background-color #5e5cf0
    border-radius 50%
    border 1px solid white

// --- Perfil ---
.user-profile
  display flex
  align-items center
  cursor pointer
  position relative
  gap 12px

  .avatar-container
    position relative

    .user-avatar
      width 40px
      height 40px
      border-radius 50%
      object-fit cover

    .status-dot
      position absolute
      bottom 0px
      right -2px
      width 13px
      height 13px
      background-color $status-green
      border 2px solid white
      border-radius 50%

  .user-info
    display flex
    flex-direction column
    line-height 1.2

    .user-name
      font-weight 600
      font-size 14px
      color $text-dark

    .user-role
      font-size 12px
      color #64748B // Azul acinzentado conforme imagem

  .dropdown-icon
    font-size 12px
    color $text-dark
    margin-left 4px
    transition transform 0.2s

    &.rotated
      transform rotate(180deg)

// --- Dropdown ---
.dropdown-menu
  position absolute
  top 120%
  right 0
  background white
  border 1px solid $border-color
  border-radius 8px
  box-shadow 0 4px 6px rgba(0,0,0,0.1)
  padding 8px 0
  min-width 150px
  z-index 10

  .dropdown-item
    display block
    width 100%
    padding 8px 16px
    text-align left
    background none
    border none
    cursor pointer
    color $text-dark
    font-size 14px

    &:hover
      background #F7FAFC
</style>
