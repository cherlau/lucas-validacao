<template>
  <div class="tab-tokens">
    <div class="page-title-row">
      <div class="title-wrapper">
        <div class="content-title">
          <h1>
            Tokens de API: <span class="highlight">{{ integrationDetails.name }}</span>
          </h1>
          <span class="meta-item-id">{{ integrationDetails.id }}</span>
          <p class="subtitle">Encontramos {{ filteredTokens.length }} tokens cadastrados</p>
        </div>
      </div>
      <button class="btn-primary" @click="handleOpenCreate">
        <i class="fas fa-plus"></i> Criar Token
      </button>
    </div>

    <div class="table-filters mt-4">
      <div class="table-filters">
        <label>Filtrar:</label>

        <UiSelect
          v-model="filterOrigin"
          :data="originOptions"
          return-value="value"
          class="filter-select"
        />

        <UiSelect
          v-model="filterStatus"
          :data="statusOptions"
          return-value="value"
          class="filter-select"
        />
      </div>
    </div>

    <DataTable :columns="tokenColumns" :data="filteredTokens" class="mt-4" :show-checkbox="false">
      <template #cell-permissions="{ item }">
        <div class="permissions-cell">
          <span class="truncate">{{ item.permissions }}</span>
          <i class="far fa-info-circle cursor-pointer" title="Ver detalhes"></i>
        </div>
      </template>

      <template #cell-status="{ value }">
        <span class="badge" :class="value === 'Ativo' ? 'badge-success' : 'badge-danger'">
          <span class="dot"></span> {{ value }}
        </span>
      </template>

      <template #cell-last_use="{ value }">
        <div class="date-cell"><i class="far fa-calendar text-purple"></i> {{ value }}</div>
      </template>

      <template #cell-restriction="{ value }">
        <i :class="value === 'global' ? 'far fa-globe' : 'far fa-lock'" class="text-gray-500"></i>
      </template>

      <template #cell-created_by="{ item }">
        <div class="user-cell">
          <img :src="item.avatar" class="avatar-content" />
          <span>{{ item.created_by }}</span>
        </div>
      </template>

      <template #cell-actions="{ item }">
        <UiDropdown align="right">
          <template #trigger="{ isOpen }">
            <button class="action-btn" :class="{ 'btn-active': isOpen }">
              <i class="far fa-cog"></i>
            </button>
          </template>

          <UiDropdownItem @click="handleAction('edit', item)">
            <template #icon><i class="fas fa-pencil-alt" style="font-size: 14px"></i></template>
            Editar
          </UiDropdownItem>

          <div style="border-top: 1px solid #f1f5f9; margin: 4px 0"></div>

          <UiDropdownItem variant="danger" @click="handleAction('revoke', item)">
            <template #icon><i class="far fa-ban" style="font-size: 14px"></i></template>
            Revogar
          </UiDropdownItem>
        </UiDropdown>
      </template>
    </DataTable>

    <DrawerCreateToken
      v-model="isDrawerOpen"
      :token-to-edit="tokenToEdit"
      @confirm="handleSaveToken"
    />

    <ModalTokenSuccess v-model="isSuccessModalOpen" :token="generatedToken" />
  </div>
</template>

<script setup>
import { ref, computed } from 'vue'
import DataTable from '@/components/ui/data-table'
import DrawerCreateToken from '@/components/features/integration-erp/drawers/createTokenDrawer'
import ModalTokenSuccess from '@/components/features/integration-erp/modals/modal-token-success'
import UiDropdown from '@/components/ui/dropdown/dropdown-container'
import UiDropdownItem from '@/components/ui/dropdown/dropdown-item'
// Certifique-se de importar o UiSelect se não for global
import UiSelect from '@/components/ui/select'

const isDrawerOpen = ref(false)
const isSuccessModalOpen = ref(false)
const generatedToken = ref('')

// NOVA REF: Controla qual token está sendo editado
const tokenToEdit = ref(null)

// NOVA FUNÇÃO: Abre o drawer em modo de criação (limpo)
const handleOpenCreate = () => {
  tokenToEdit.value = null
  isDrawerOpen.value = true
}

// Função para lidar com as ações do Dropdown
const handleAction = (action, item) => {
  if (action === 'edit') {
    // ALTERADO: Define o token atual e abre o drawer
    tokenToEdit.value = item
    isDrawerOpen.value = true
  } else if (action === 'revoke') {
    console.log('Revogar item:', item)
    // Lógica para revogar/excluir
  }
}

const handleSaveToken = async (formData) => {
  console.log('Salvando token...', formData)
  // Aqui você verificaria formData.isUpdate para saber se é PUT ou POST
  const apiResponse = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.exemplo-de-token-gerado-pela-api-xyz'
  isDrawerOpen.value = false
  generatedToken.value = apiResponse
  isSuccessModalOpen.value = true
}

const props = defineProps({
  integrationDetails: {
    type: Object,
    required: true,
  },
})

// --- LÓGICA DE FILTROS ---
const filterOrigin = ref('all')
const filterStatus = ref('all')

const originOptions = [
  { label: 'Todas as origens', value: 'all' },
  { label: 'Facilita CRM', value: 'crm' },
]

const statusOptions = [
  { label: 'Todos os Status', value: 'all' },
  { label: 'Ativo', value: 'Ativo' },
  { label: 'Revogado', value: 'Revogado' },
]

const tokenColumns = [
  { key: 'name', label: 'Nome' },
  { key: 'permissions', label: 'Permissões' },
  { key: 'status', label: 'Status' },
  { key: 'last_use', label: 'Última utilização' },
  { key: 'restriction', label: 'Restrição', align: 'center' },
  { key: 'expires', label: 'Expira' },
  { key: 'created_by', label: 'Criado por' },
  { key: 'actions', label: '', width: '50px' },
]

const tokensData = ref([
  {
    id: 1,
    name: 'Facilita CRM',
    permissions: 'Criar propostas, Editar Propostas, Excluir Pro...',
    status: 'Ativo',
    last_use: '14/07/2024 11:45',
    restriction: 'global',
    expires: 'Nunca Expira',
    created_by: 'Maria Elisa',
    avatar: 'https://i.pravatar.cc/150?u=maria',
  },
  {
    id: 2,
    name: 'Facilita Backoffice',
    permissions: 'Criar propostas, Editar Propostas, Excluir Pro...',
    status: 'Revogado',
    last_use: '02/03/2024 17:30',
    restriction: '192.168.0.50',
    expires: 'Nunca Expira',
    created_by: 'Carlos Santos',
    avatar: 'https://i.pravatar.cc/150?u=carlos',
  },
])

const filteredTokens = computed(() => {
  return tokensData.value.filter((item) => {
    // 1. Filtro de Status
    const statusValue = filterStatus.value
    const matchesStatus = !statusValue || statusValue === 'all' ? true : item.status === statusValue

    // 2. Filtro de Origem
    let matchesOrigin = true
    const originValue = filterOrigin.value

    if (originValue && originValue !== 'all') {
      if (originValue === 'crm') {
        matchesOrigin = item.name.includes('CRM')
      }
    }

    return matchesStatus && matchesOrigin
  })
})
</script>

<style lang="stylus" scoped>
/* Layout Geral */
.chart-select {
  max-width: 200px;
}

.page-container {
  background-color: #fff;
  min-height: 100vh;
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

.page-body {
  padding-block: 32px;
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
  color: #1e2339;
  margin-bottom: 24px;
}

.table-filters {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 16px;
  gap: 12px;
  width: 430px;
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
  transition: color 0.2s;
}
.action-btn:hover,
.action-btn.btn-active {
  color: #4f46e5;
}

/* Drawer Content */

/* Container geral */
.drawer-content {
  display: flex;
  flex-direction: column;
  gap: 24px;
}

/* ===============================
   Metadados (Status, Data, Origem)
   =============================== */

.request-meta {
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: 24px 32px;
  padding: 0 43px;
}

.meta-body {
  padding: 0 43px;
}

.meta-body .section-title {
  margin-bottom: 28px;
}

.meta-item {
  display: flex;
  flex-direction: column;
  gap: 4px;
  align-items: start;
}

.meta-value {
  font-size: 12px;
  font-weight: 500;
  color: #64748b;
}

.meta-label {
  font-size: 14px;
  font-weight: 500;
  color: #0f172a;
}

.fa-info-circle {
  color: #94a3b8;
  margin-left: 4px;
  font-size: 12px;
  cursor: pointer;
}

/* Valor monoespaçado (rotas, códigos) */
.meta-value.mono {
  font-family: ui-monospace, SFMono-Regular, Menlo, Monaco, Consolas, monospace;
}

/* ===============================
   Status badge
   =============================== */

.meta-value.badge-success {
  display: inline-flex;
  align-items: center;
  gap: 6px;
  color: #16a34a;
}

.meta-value.badge-success .dot {
  width: 8px;
  height: 8px;
  border-radius: 50%;
  background-color: #16a34a;
}

/* ===============================
   Divisor
   =============================== */

.divider {
  border: none;
  border-top: 1px solid #e5e7eb;
}

/* ===============================
   Informações Avançadas
   =============================== */

.section-title {
  font-size: 14px;
  font-weight: 600;
  color: #0f172a;
}

.advanced-section {
  display: flex;
  flex-direction: column;
  gap: 12px;
}

.user-cell {
  display: flex;
  align-items: center;
  gap: 8px;
}

.avatar-content {
    width: 24px;
    height 24px
    border-radius 50%
}

.date-cell i{
  color: #5e5cf0;
  margin-right: 4px;
  font-size: 14px;
}
</style>
