<template>
  <div class="login-page">
    <LoginView />
  </div>
</template>

<script setup >
import LoginView from '@/views/login'

definePageMeta({
  layout: 'login', // <-- aqui você escolhe o layout
})
</script>