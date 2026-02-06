<script setup>
import { ref, onMounted } from 'vue'
import { useRoute } from 'vue-router'
import DataTable from '@/components/ui/data-table'

const route = useRoute()
const integrationId = route.params.id // Pega o ID da URL (ex: ERP-TRV-UAU-001)

// --- ESTADOS PARA OS SELECTS ---
const selectedPeriod = ref('24h')
const selectedOrigin = ref('all')
const selectedStatus = ref('all')

// --- OPÇÕES PARA OS SELECTS ---
const periodOptions = [
  { label: 'Últimas 24 horas', value: '24h' },
  { label: 'Últimos 7 dias', value: '7d' },
  { label: 'Últimos 30 dias', value: '30d' },
]

const originOptions = [
  { label: 'Todas as origens', value: 'all' },
  { label: 'Facilita CRM', value: 'crm' },
  { label: 'Facilita Backoffice', value: 'backoffice' },
]

const statusOptions = [
  { label: 'Todos os Status', value: 'all' },
  { label: 'Sucesso', value: 'Sucesso' },
  { label: 'Erro', value: 'Erro' },
]

// --- MOCK DE DADOS PARA A PÁGINA ---
const integrationDetails = ref({
  name: 'Teriva ➝ Sienge',
  id: 'ERP-TRV-SNG-001',
  status: 'Operacional',
  created_at: '27-01-2025 14:35',
  kpi: {
    total: 1250,
    success: 1200,
    success_pct: 96,
    error: 50,
    error_pct: 4,
  },
})

// --- CONFIGURAÇÃO DA TABELA DE HISTÓRICO (Baseado na imagem) ---
const historyColumns = [
  { key: 'req_id', label: 'ID da Requisição', width: '150px' },
  { key: 'origin', label: 'Origem' },
  { key: 'type', label: 'TIPO', width: '80px' },
  { key: 'operation', label: 'Operação' },
  { key: 'last_activity', label: 'Última atividade' },
  { key: 'status', label: 'Status', align: 'center' },
  { key: 'code', label: 'Código', width: '80px' },
  { key: 'response_time', label: 'Resposta' },
  { key: 'actions', label: '', width: '50px', align: 'center' },
]

const historyData = [
  {
    id: 1,
    req_id: 'REQ-2024-005821',
    origin: 'Facilita CRM',
    type: 'POST',
    operation: '/sienge/v1/propostas',
    last_activity: '28/05/2024 11:00',
    status: 'Sucesso',
    code: 201,
    response_time: '245ms',
  },
  {
    id: 2,
    req_id: 'REQ-2024-005820',
    origin: 'Facilita Backoffice',
    type: 'POST',
    operation: '/sienge/v1/comissoes',
    last_activity: '27/05/2024 17:45',
    status: 'Erro',
    code: 401,
    response_time: '245ms',
  },
  {
    id: 3,
    req_id: 'REQ-2024-005819',
    origin: 'Facilita Produtos',
    type: 'GET',
    operation: '/sienge/v1/empreendimentos',
    last_activity: '26/05/2024 08:15',
    status: 'Sucesso',
    code: 201,
    response_time: '245ms',
  },
]

// Helper para cor do badge (reutilizando lógica similar)
const getStatusClass = (status) => {
  return status === 'Sucesso' ? 'badge-success' : 'badge-danger'
}
</script>

<template>
  <div class="page-container">
    <UiPageHeader
      :tabs="[
        { label: 'Monitoramento', value: 'monitoramento', icon: 'far fa-chart-line' },
        { label: 'Configurações', value: 'configuracoes', icon: 'far fa-cog' },
        { label: 'Tokens de API', value: 'tokens', icon: 'far fa-key' },
      ]"
      :active-tab="currentTab"
      @update:active-tab="currentTab = $event"
    />

    <div class="content-area">
      <div class="page-title-row">
        <div class="title-wrapper">
          <div class="content-title">
            <h1>
              Monitoramento: <span class="highlight">{{ integrationDetails.name }}</span>
            </h1>
            <span class="meta-item-id">{{ integrationDetails.id }}</span>
          </div>
          <div class="content-status">
            <span class="status-badge">{{ integrationDetails.status }}</span>
          </div>
        </div>
        <button class="btn-primary"><i class="fas fa-bolt"></i> Testar Conexão</button>
      </div>

      <div class="meta-info">
        <span class="meta-item-created-at"
          ><i class="far fa-calendar"></i> Criado em: {{ integrationDetails.created_at }}</span
        >
      </div>

      <h3 class="section-title">Visão Geral</h3>
      <div class="kpi-grid">
        <div class="kpi-card">
          <div class="kpi-header">
            <span>Total de Requisições</span>
            <i class="fal fa-chart-line text-blue"></i>
          </div>
          <div class="kpi-value text-blue">{{ integrationDetails.kpi.total }}</div>
          <div class="kpi-sub">nas últimas 24h</div>
        </div>

        <div class="kpi-card">
          <div class="kpi-header">
            <span>Requisições com Sucesso</span>
            <i class="far fa-check-circle text-green"></i>
          </div>
          <div class="kpi-value text-green">
            {{ integrationDetails.kpi.success }} ({{ integrationDetails.kpi.success_pct }}%)
          </div>
          <div class="kpi-sub">nas últimas 24h</div>
        </div>

        <div class="kpi-card">
          <div class="kpi-header">
            <span>Requisições com Erro</span>
            <i class="far fa-times-circle text-red"></i>
          </div>
          <div class="kpi-value text-red">
            {{ integrationDetails.kpi.error }} ({{ integrationDetails.kpi.error_pct }}%)
          </div>
          <div class="kpi-sub">nas últimas 24h</div>
        </div>
      </div>

      <div class="chart-container">
        <div class="chart-header">
          <h3>Requisições por Período</h3>
          <UiSelect class="chart-select">
            <option>Últimas 24 horas</option>
          </UiSelect>
        </div>
        <div class="chart-placeholder">
          [Gráfico de Linhas seria renderizado aqui]
          <br />
          <small>Sugerimos usar a lib <b>vue-chartjs</b></small>
        </div>
      </div>

      <div class="history-section">
        <h3>Histórico de Requisições</h3>
        <p class="subtitle">Monitoramento detalhado das requisições para o ERP.</p>

        <div class="table-filters">
          <input type="text" placeholder="Buscar por clientes, ERPs" class="search-input" />
          <div class="select-group">
            <UiSelect v-model="selectedOrigin" :data="originOptions" class="filter-select" />

            <UiSelect v-model="selectedStatus" :data="statusOptions" class="filter-select" />
          </div>
        </div>

        <DataTable :columns="historyColumns" :data="historyData">
          <template #cell-status="{ value }">
            <span class="badge" :class="getStatusClass(value)">
              <span class="dot"></span> {{ value }}
            </span>
          </template>

          <template #cell-actions>
            <button class="action-btn">
              <i class="far fa-eye"></i>
            </button>
          </template>
        </DataTable>
      </div>
    </div>
  </div>
</template>

<style scoped>
/* Layout Geral */
.chart-select {
  max-width: 200px;
}

.page-container {
  background-color: #fff;
  min-height: 100vh;
}

.content-area {
  padding: 32px;
  max-width: 1400px;
  margin: 0 auto;
}

/* Header & Tabs */
.top-header {
  background: white;
  border-bottom: 1px solid #e2e8f0;
  padding: 0 32px;
}

.tabs {
  display: flex;
  gap: 24px;
}

.tab-btn {
  background: none;
  border: none;
  padding: 16px 0;
  font-size: 14px;
  color: #64748b;
  cursor: pointer;
  border-bottom: 2px solid transparent;
  display: flex;
  align-items: center;
  gap: 8px;
}

.tab-btn.active {
  color: #4f46e5;
  border-bottom-color: #4f46e5;
  font-weight: 500;
}

/* Título e Meta */
.page-title-row {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-top: 16px;
}

.title-wrapper {
  display: flex;
  align-items: center;
  gap: 12px;
}

.content-title h1 {
  margin: 0;
}

h1 {
  font-size: 20px;
  color: #1e293b;
  font-weight: 600;
}

.highlight {
  color: #4f46e5;
}

.content-status {
  position: relative;
}

.status-badge {
  display: inline-flex;
  align-items: center;
  gap: 8px; /* Espaço entre a bolinha e o texto */

  background-color: #dcfce7;
  color: #15803d;
  font-size: 12px;
  padding: 4px 12px;
  border-radius: 99px;
  font-weight: 600;

  position: absolute;
  top: -39px;
}

/* Criando a bolinha */
.status-badge::before {
  content: '';
  width: 9px;
  height: 9px;
  background-color: #36a96c; /* Mesma cor do texto ou um tom mais forte */
  border-radius: 50%;
  display: inline-block;
}

.meta-item-id,
.meta-item-created-at {
  font-size: 13px;
  color: #64748b;
}

.meta-info {
  margin-top: 8px;
  margin-bottom: 32px;
}

.meta-info i {
  color: #5e5cf0;
  margin-right: 4px;
  font-size: 14px;
}

.btn-primary {
  background-color: #4f46e5;
  color: white;
  border: none;
  padding: 10px 16px;
  border-radius: 6px;
  cursor: pointer;
  display: flex;
  align-items: center;
  gap: 8px;
  font-size: 14px;
}

/* KPI Cards */
.section-title {
  font-size: 14px;
  color: #64748b;
  margin-bottom: 16px;
}

.kpi-grid {
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: 24px;
  margin-bottom: 32px;
}

.kpi-card {
  background: white;
  padding: 20px;
  border-radius: 8px;
  border: 1px solid #e2e8f0;
}

.kpi-header {
  display: flex;
  justify-content: space-between;
  font-size: 14px;
  color: #1e2339;
  margin-bottom: 12px;
  font-weight: 500;
}

.kpi-header i {
  font-size: 20px;
}

.kpi-value {
  font-size: 24px;
  font-weight: 400;
  color: #1e293b;
  margin-bottom: 4px;
}

.kpi-sub {
  font-size: 12px;
  color: #737b9c;
}

.text-blue {
  color: #3b82f6;
}
.text-green {
  color: #10b981;
}
.text-red {
  color: #ef4444;
}

/* Chart Section */
.chart-container {
  background: white;
  border: 1px solid #e2e8f0;
  border-radius: 8px;
  padding: 24px;
  margin-bottom: 40px;
}

.chart-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 24px;
}

.chart-placeholder {
  height: 250px;
  background-color: #f8fafc;
  border: 2px dashed #e2e8f0;
  border-radius: 8px;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  color: #94a3b8;
}

/* History Section & Table Filters */
.history-section h3 {
  font-size: 18px;
  color: #1e293b;
  font-weight: 600;
}

.subtitle {
  font-size: 14px;
  color: #64748b;
  margin-bottom: 24px;
}

.table-filters {
  display: flex;
  justify-content: space-between;
  margin-bottom: 16px;
}

.search-input {
  padding: 8px 12px;
  border: 1px solid #e2e8f0;
  border-radius: 6px;
  width: 300px;
}

.select-group {
  display: flex;
  gap: 12px;
  width: 380px;
}

.select-group select {
  padding: 8px 12px;
  border: 1px solid #e2e8f0;
  border-radius: 6px;
  margin-left: 12px;
  color: #475569;
}

/* Reuso de estilos de Badge da tabela anterior */
.badge {
  display: inline-flex;
  align-items: center;
  gap: 6px;
  padding: 4px 10px;
  border-radius: 999px;
  font-size: 12px;
  font-weight: 600;
}
.dot {
  width: 6px;
  height: 6px;
  border-radius: 50%;
  background-color: currentColor;
}
.badge-success {
  background-color: #dcfce7;
  color: #15803d;
}
.badge-danger {
  background-color: #fee2e2;
  color: #b91c1c;
}

.action-btn {
  border: none;
  background: none;
  color: #94a3b8;
  cursor: pointer;
}
.action-btn:hover {
  color: #4f46e5;
}
</style>
