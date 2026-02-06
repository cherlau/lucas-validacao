<template>
  <div class="login-form">
    <div class="login-container">
      <div class="login-container-logo">
        <AppIcon class="logo" variant="default" size="lg" :clickable="false" />
        <h1>Facilita Connector</h1>
      </div>

      <div class="login-container-form">
        <UiInput v-model="email" label="E-mail" placeholder="Digite seu e-mail" type="email" />
        <UiInput
          v-model="password"
          label="Senha"
          type="password"
          autocomplete="current-password"
          placeholder="Digite sua senha"
        />
        <UiButton variant="primary" size="md" :full-width="true" @click="handleLogin">
          Entrar
        </UiButton>

        <p v-if="errorMsg" class="text-red-500 mt-2">{{ errorMsg }}</p>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref } from 'vue'
import { useAuthStore } from '@/stores/auth'

const email = ref('')
const password = ref('')
const errorMsg = ref('')

const authStore = useAuthStore()

const handleLogin = async () => {
  errorMsg.value = ''
  try {
    await authStore.login({ email: email.value, password: password.value })
    // Redireciona para a página inicial após login bem-sucedido
    navigateTo('/')
  } catch (err) {
    // Pode ser string ou objeto retornado pelo useApiError
    errorMsg.value = typeof err === 'string' ? err : 'Erro ao fazer login'
    console.error('Login failed:', err)
  }
}
</script>

<style scoped>
.login-form {
  display: flex;
  flex-direction: column;
  justify-content: center;
  padding: 2rem;
  width: 42%;
}

.login-container {
  min-width: 420px;
  margin: 0 auto;
}

.login-container-logo {
  display: flex;
  flex-direction: column;
  font-size: 20px;
  gap: 30px;
  align-items: center;
  margin-bottom: 20px;
}

.login-container-form {
  display: flex;
  flex-direction: column;
  gap: 15px;
}
</style>
