// stores/auth.ts
import { defineStore } from 'pinia'
import { useNuxtApp } from '#app'

export const useAuthStore = defineStore('auth', {
  state: () => ({
    user: null,
    accessToken: null,
    refreshToken: null,
  }),

  getters: {
    isLoggedIn: (state) => !!state.accessToken,
  },

  actions: {
    /** 🔹 Login na API */
    async login(credentials) {
      const { $apiFetch } = useNuxtApp()

      // Chama endpoint de login
      const res = await $apiFetch('/authenticate', {
        method: 'POST',
        body: credentials,
      })

      this.accessToken = res.accessToken
      this.refreshToken = res.refreshToken

      localStorage.setItem('user_token', this.accessToken)
      localStorage.setItem('user_refresh_token', this.refreshToken)

      // Busca dados do usuário
      await this.fetchUser()
    },

    /** 🔹 Busca usuário logado */
    async fetchUser() {
      if (!this.accessToken) return
      const { $apiFetch } = useNuxtApp()
      try {
        this.user = await $apiFetch('/users/me?q=&per_page=10000', {
          baseURL: import.meta.env.NUXT_PUBLIC_API_BASE,
          headers: {
            Authorization: `Bearer ${this.accessToken}`,
            'goscore-token': import.meta.env.NUXT_PUBLIC_API_TOKEN,
          },
        })
        localStorage.setItem('user_logged', JSON.stringify(this.user))
        console.log('🚀 ~ user_logged:', this.user)
      } catch (err) {
        console.error('Erro ao buscar usuário', err)
        this.logout()
      }
    },

    /** 🔹 Logout */
    logout() {
      this.user = null
      this.accessToken = null
      this.refreshToken = null

      localStorage.removeItem('user_token')
      localStorage.removeItem('user_refresh_token')
      localStorage.removeItem('user_logged')

      navigateTo('/login')
    },

    /** 🔹 Refresh token */
    async refresh() {
      if (!this.refreshToken) return false
      const { $apiFetch } = useNuxtApp()
      try {
        const res = await $apiFetch('/auth/refresh', {
          method: 'POST',
          body: { refreshToken: this.refreshToken },
        })
        this.accessToken = res.accessToken
        localStorage.setItem('user_token', this.accessToken)
        return true
      } catch (err) {
        console.error('Erro ao renovar token', err)
        this.logout()
        return false
      }
    },

    /** 🔹 Inicializa store usando localStorage */
    async init() {
      if (process.server) return

      const token = localStorage.getItem('user_token')
      const refreshToken = localStorage.getItem('user_refresh_token')
      const user = localStorage.getItem('user_logged')

      if (token && refreshToken) {
        this.accessToken = token
        this.refreshToken = refreshToken

        if (user) {
          this.user = JSON.parse(user)
        } else {
          await this.fetchUser() // garante que user esteja atualizado
        }
      }
    },
  },
})
