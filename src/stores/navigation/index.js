// stores/navigation.js
import { defineStore } from 'pinia'
import { ref, computed } from 'vue'
import { sidebarConfig } from '@/components/global/data'

export const useNavigationStore = defineStore('navigation', () => {
  // Estado
  const activeItemId = ref(null)
  const activeSubItemId = ref(null)
  const activeChildId = ref(null)
  const showSubSidebar = ref(false)
  const sidebarItems = ref(sidebarConfig)

  // Getters
  const activeItem = computed(() =>
    sidebarItems.value.find((item) => item.id === activeItemId.value)
  )

  const activeSubItems = computed(() => activeItem.value?.subItems || [])

  const activeItemName = computed(() => activeItem.value?.name || '')

  const activeSubItem = computed(() =>
    activeSubItems.value.find((sub) => sub.id === activeSubItemId.value)
  )

  const activeChild = computed(() =>
    activeSubItem.value?.children?.find((child) => child.id === activeChildId.value)
  )

  // Actions
  const setActiveItem = (itemId) => {
    activeItemId.value = itemId
    showSubSidebar.value = true
  }

  const setActiveSubItem = (subItemId) => {
    activeSubItemId.value = subItemId
  }

  const setActiveChild = (childId) => {
    activeChildId.value = childId
  }

  const toggleSubSidebar = (itemId) => {
    if (activeItemId.value === itemId && showSubSidebar.value) {
      closeSubSidebar()
    } else {
      setActiveItem(itemId)
    }
  }

  const closeSubSidebar = () => {
    showSubSidebar.value = false
    activeItemId.value = null
    activeSubItemId.value = null
    activeChildId.value = null
  }

  // Dados da página atual (baseado na rota)
  const currentPageTitle = ref('')
  const currentPageCategory = ref('')
  const currentPageSubCategory = ref('')
  const currentPageIcon = ref(null)

  // Sincroniza com a rota atual
  const syncWithRoute = (route) => {
    let bestMatch = null
    let maxMatchLength = 0

    // Função auxiliar para verificar se é um match e se é o mais específico encontrado até agora
    const checkMatch = (configRoute, type, item, subItem, child = null) => {
      // Ignora rotas vazias ou undefined
      if (!configRoute) return

      // Verifica se a rota atual COMEÇA com a rota do config
      // Ex: atual '/integracoes/erp/123' começa com config '/integracoes/erp'
      if (route.path.startsWith(configRoute)) {
        // Prioriza a rota mais longa (mais específica)
        // Isso evita que '/integracoes' ganhe de '/integracoes/erp'
        if (configRoute.length > maxMatchLength) {
          maxMatchLength = configRoute.length
          bestMatch = { type, item, subItem, child }
        }
      }
    }

    // Itera sobre toda a configuração para achar o "pai" mais próximo da rota atual
    for (const item of sidebarItems.value) {
      if (item.subItems) {
        for (const subItem of item.subItems) {
          // 1. Tenta dar match no SubItem (ex: /integracoes/erp)
          checkMatch(subItem.route, 'subItem', item, subItem)

          if (subItem.children) {
            for (const child of subItem.children) {
              // 2. Tenta dar match no Child (ex: /integracoes/erp/sienge)
              checkMatch(child.route, 'child', item, subItem, child)
            }
          }
        }
      }
    }

    // Se encontrou algum match (mesmo que parcial/pai), aplica o estado
    if (bestMatch) {
      const { item, subItem, child } = bestMatch

      setActiveItem(item.id)
      setActiveSubItem(subItem.id)

      // Se o match foi num filho específico, ativa ele, senão limpa
      setActiveChild(child ? child.id : null)

      // Define os textos do Header
      currentPageTitle.value = item.name
      currentPageCategory.value = subItem.name
      // Se estiver num filho específico (ex: Sienge), mostra. Se for um ID dinâmico genérico, fica vazio ou mostra o child se o match foi no child
      currentPageSubCategory.value = child ? child.name : ''
      currentPageIcon.value = item.icon
    } else {
      // Se não encontrou nada (rota 404 ou fora do menu)
      currentPageTitle.value = ''
      currentPageCategory.value = ''
      currentPageSubCategory.value = ''
      currentPageIcon.value = null
    }
  }
  // Reseta o estado
  const reset = () => {
    activeItemId.value = null
    activeSubItemId.value = null
    activeChildId.value = null
    showSubSidebar.value = false
    currentPageTitle.value = ''
    currentPageCategory.value = ''
    currentPageSubCategory.value = ''
    currentPageIcon.value = null
  }

  return {
    // Estado
    activeItemId,
    activeSubItemId,
    activeChildId,
    showSubSidebar,
    sidebarItems,

    // Getters
    activeItem,
    activeSubItems,
    activeItemName,
    activeSubItem,
    activeChild,

    // Dados da página atual
    currentPageTitle,
    currentPageCategory,
    currentPageSubCategory,
    currentPageIcon,

    // Actions
    setActiveItem,
    setActiveSubItem,
    setActiveChild,
    toggleSubSidebar,
    closeSubSidebar,
    syncWithRoute,
    reset,
  }
})
