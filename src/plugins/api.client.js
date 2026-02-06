export default defineNuxtPlugin((nuxtApp) => {
  const config = useRuntimeConfig()

  const apiFetch = $fetch.create({
    baseURL: config.public.apiBase,

    onRequest({ options }) {
      const accessToken = localStorage.getItem('accessToken')
      options.headers = {
        ...options.headers,
        'goscore-token': config.public.apiToken, // <- aqui
        ...(accessToken ? { Authorization: `Bearer ${accessToken}` } : {}),
      }
    },

    async onResponseError({ request, response, options }) {
      if (response.status === 401) {
        const refreshToken = localStorage.getItem('refreshToken')
        if (!refreshToken) {
          navigateTo('/login')
          return
        }

        try {
          // Tenta renovar o access token
          const newTokens = await $fetch('/auth/refresh', {
            method: 'POST',
            body: { refreshToken },
          })

          localStorage.setItem('accessToken', newTokens.accessToken)
          // Reexecuta a requisição original com novo token
          options.headers = { ...options.headers, Authorization: `Bearer ${newTokens.accessToken}` }
          return $fetch(request.url, options)
        } catch (err) {
          console.warn('Refresh token inválido, redirecionando para login')
          localStorage.removeItem('accessToken')
          localStorage.removeItem('refreshToken')
          navigateTo('/login')
        }
      }
    },
  })

  nuxtApp.provide('apiFetch', apiFetch)
})
