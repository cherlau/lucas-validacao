<template>
  <div class="login-view">
    <LoginIllustration />
    <LoginForm />
  </div>
</template>

<script setup>
import LoginIllustration from './components/login-illustration'
import LoginForm from './components/login-form'

definePageMeta({
  layout: 'login', // <-- aqui você escolhe o layout
})
</script>

<style scoped>
.login-view {
  display: flex;
  min-height: 100vh;
}
</style>