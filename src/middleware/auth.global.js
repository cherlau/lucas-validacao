import { useAuthStore } from '@/stores/auth'

export default defineNuxtRouteMiddleware(async (to) => {
  // executa apenas no lado do cliente
  if (process.server) return

  const authStore = useAuthStore()

  // inicializa o state da store com dados do localStorage
  if (!authStore.accessToken) {
    console.log('Inicializando authStore com dados do localStorage...')
    authStore.init()
  }

  const userIsLoggedIn = !!authStore.accessToken
  console.log('userIsLoggedIn:', userIsLoggedIn)

  const refreshToken = authStore.refreshToken
  console.log('refreshToken:', refreshToken)

  // se não tem token de acesso, mas tem o de refresh, tenta renovar
  if (!userIsLoggedIn && refreshToken) {
    console.log('Tentando renovar o token de acesso...')
    const refreshed = await authStore.refresh(refreshToken)
    if (!refreshed && to.path !== '/login') {
      return navigateTo('/login')
    }
  } else if (!userIsLoggedIn && to.path !== '/login') {
    // se não está logado e não está na página de login, redireciona
    return navigateTo('/login')
  }

  // se o usuário está logado e tenta acessar a página de login, redireciona para a home
  if (userIsLoggedIn && to.path === '/login') {
    return navigateTo('/')
  }
})
