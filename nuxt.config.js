// https://nuxt.com/docs/api/configuration/nuxt-config
import { resolve } from 'path'

export default defineNuxtConfig({
  srcDir: 'src/',
  ssr: false,
  compatibilityDate: '2025-07-15',
  devtools: { enabled: true },
  modules: ['@pinia/nuxt'],
  css: ['facilita-ds/facilita-ds.css', '@/assets/styles/index.styl', '@/assets/styles/root.css'],

  // Bloco adicionado para scripts e metadados globais ✨
  app: {
    head: {
      script: [
        {
          src: 'https://kit.fontawesome.com/0406c7fb27.js',
          crossorigin: 'anonymous',
        },
      ],
    },
  },

  runtimeConfig: {
    public: {
      apiBase: process.env.NUXT_PUBLIC_API_BASE,
      apiToken: process.env.NUXT_PUBLIC_API_TOKEN,
    },
  },

  vite: {
    css: {
      preprocessorOptions: {
        stylus: {
          imports: [resolve(__dirname, './src/assets/styles/globals/*.styl')],
        },
      },
    },
  },
})
