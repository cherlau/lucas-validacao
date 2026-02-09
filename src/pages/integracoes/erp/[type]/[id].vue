<template>
  <div class="page-container">
    <UiPageHeader
      :tabs="tabsConfig"
      :active-tab="currentTab"
      @update:active-tab="currentTab = $event"
    />

    <div class="content-area page-body">
      <keep-alive>
        <component :is="currentTabComponent" :integration-details="integrationDetails" />
      </keep-alive>
    </div>
  </div>
</template>

<script setup>
import { ref, computed } from 'vue'
import MonitoramentoTab from '@/components/features/integration-erp/tabs/monitoramento-tab'
import TokensTab from '@/components/features/integration-erp/tabs/tokensTab'

// Placeholder para as outras abas (você criará arquivos para elas depois)
const ConfiguracoesTab = { template: '<div class="p-4">Configurações em breve...</div>' }

const currentTab = ref('monitoramento')

// Dados centralizados que podem ser passados para qualquer aba
const integrationDetails = ref({
  name: 'Teriva ➝ UAU',
  id: 'ERP-TRV-SNG-001',
  status: 'Operacional',
  created_at: '27-01-2025 14:35',
  kpi: { total: 1250, success: 1200, success_pct: 96, error: 50, error_pct: 4 },
})

const tabsConfig = [
  { label: 'Monitoramento', value: 'monitoramento', icon: 'far fa-chart-line' },
  { label: 'Configurações', value: 'configuracoes', icon: 'far fa-cog' },
  { label: 'Tokens de API', value: 'tokens', icon: 'far fa-key' },
]

// Mapeia o "value" da tab para o Componente importado
const currentTabComponent = computed(() => {
  const map = {
    monitoramento: MonitoramentoTab,
    tokens: TokensTab, // Agora ele está mapeado
    configuracoes: { template: '<div>Em breve</div>' },
  }
  return map[currentTab.value]
})
</script>

<style scoped>
.page-body {
  padding-block: 24px;
}
</style>
