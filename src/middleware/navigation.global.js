import { useNavigationStore } from '@/stores/navigation'

export default defineNuxtRouteMiddleware((to, from) => {
  // 'to' é a rota para a qual você está navegando.
  // 'from' é a rota de onde você veio.

  // 1. Obtenha a instância da sua store Pinia
  const navStore = useNavigationStore()

  // 2. Chame a sua action para sincronizar o estado com a rota de destino
  navStore.syncWithRoute(to)
})
