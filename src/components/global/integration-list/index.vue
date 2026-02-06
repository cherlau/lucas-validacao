<template>
  <div>
    <UiPageHeader
      :title="pageTitle"
      highlight="ERPs"
      :description="pageDescription"
      action-label="+ Criar Integração"
      padding="41px"
      @action="abrirModal"
    />

    <UiPageHeader
      :tabs="[
        { label: 'Todos', value: 'all' },
        { label: 'Arquivados', value: 'archived' },
      ]"
      :active-tab="currentTab"
      @update:active-tab="currentTab = $event"
    />

    <UiPageHeader>
      <template #default>
        <UiInput :search="true" placeholder="Buscar por clientes, ERPs"></UiInput>
        <UiSelect v-if="type === 'all'" size="sm" placeholder="Todos os ERPs" />
        <UiSelect size="sm" placeholder="Todas as situações" />
      </template>
      <template #right>
        <UiButton variant="primary">Exportar</UiButton>
      </template>
    </UiPageHeader>

    <div class="content">
      <DataTable :columns="columns" :data="filteredData">
        <template #cell-status="{ item }">
          <Switch v-model="item.status" />
        </template>

        <template #cell-situation="{ value }">
          <span class="badge" :class="getBadgeClass(value)">
            <span class="dot"></span>
            {{ value }}
          </span>
        </template>

        <template #cell-last_activity="{ value }">
          <div class="data-cell">
            <span>{{ value }}</span>
          </div>
        </template>

        <template #cell-integration_date="{ value }">
          <div class="data-cell">
            <span>{{ value }}</span>
          </div>
        </template>

        <template #cell-updated_by="{ value }">
          <div class="user-cell">
            <img :src="value.avatar" :alt="value.name" class="avatar" />
            <span class="user-name">{{ value.name }}</span>
          </div>
        </template>

        <template #cell-actions="{ item }">
          <UiDropdown align="right">
            <template #trigger="{ isOpen }">
              <button class="action-btn" :class="{ 'btn-active': isOpen }">
                <i class="far fa-cog" style="font-size: 18px"></i>
              </button>
            </template>

            <UiDropdownItem @click="handleAction('view', item)">
              <template #icon><i class="far fa-eye" style="font-size: 14px"></i></template>
              Ver Detalhes
            </UiDropdownItem>

            <UiDropdownItem @click="handleAction('edit', item)">
              <template #icon><i class="fas fa-pencil-alt" style="font-size: 14px"></i></template>
              Editar Integração
            </UiDropdownItem>

            <hr style="border: 0; border-top: 1px solid #f1f5f9; margin: 4px 0" />

            <UiDropdownItem variant="danger" @click="handleAction('delete', item)">
              <template #icon><i class="far fa-trash-alt" style="font-size: 14px"></i></template>
              Excluir
            </UiDropdownItem>
          </UiDropdown>
        </template>
      </DataTable>
    </div>
  </div>
</template>

<script setup>
import { ref, computed } from 'vue'
// Certifique-se que esses caminhos batem com seu projeto
import DataTable from '@/components/ui/data-table'
import Switch from '@/components/ui/switch'
import UiDropdown from '@/components/ui/dropdown/dropdown-container'
import UiDropdownItem from '@/components/ui/dropdown/dropdown-item'
// Seus componentes UI globais (UiPageHeader, UiInput, etc) devem estar auto-importados ou importados aqui

// --- 1. PROPS PARA TORNAR REUTILIZÁVEL ---
const props = defineProps({
  // Recebe 'all', 'sienge', 'uau', etc.
  type: {
    type: String,
    default: 'all',
  },
})

// --- 2. LÓGICA VISUAL (TÍTULOS) ---
const pageTitle = computed(() => {
  if (props.type === 'all') return 'Integrações'
  // Capitaliza a primeira letra: sienge -> Sienge
  return `Integrações ${props.type.charAt(0).toUpperCase() + props.type.slice(1)}`
})

const pageDescription = computed(() => {
  if (props.type === 'all')
    return 'Gerencie todas as conexões ERP configuradas para nossos clientes.'
  return `Gerencie especificamente as conexões do ERP ${props.type.charAt(0).toUpperCase() + props.type.slice(1)}.`
})

// --- 3. ESTADO DA PÁGINA ---
const currentTab = ref('all')

const abrirModal = () => {
  console.log('Abrir modal de criação para:', props.type)
}

// --- 4. DADOS (MOCK) ---
// Em um cenário real, isso viria de um composable useFetch baseado no props.type
const allData = [
  {
    id: 1,
    status: true,
    instance: 'teriva',
    erp: 'Uau',
    erp_type: 'uau', // Importante para o filtro
    id_cod: 'ERP-PLM-SNG-004',
    situation: 'Online',
    last_activity: '15-04-2024 09:30',
    integration_date: '10-04-2024 15:00',
    updated_by: { name: 'Eduardo Pereira', avatar: 'https://i.pravatar.cc/150?u=1' },
  },
  {
    id: 2,
    status: true,
    instance: 'paulomiranda',
    erp: 'Sienge',
    erp_type: 'sienge',
    id_cod: 'ERP-PLM-SNG-001',
    situation: 'Offline',
    last_activity: '22-04-2024 14:05',
    integration_date: '20-04-2024 10:20',
    updated_by: { name: 'Lucas Andrade', avatar: 'https://i.pravatar.cc/150?u=2' },
  },
  {
    id: 3,
    status: true,
    instance: 'construtoragama',
    erp: 'Sienge',
    erp_type: 'sienge',
    id_cod: 'ERP-CGA-SNG-001',
    situation: 'Alerta',
    last_activity: '02-05-2024 10:15',
    integration_date: '01-05-2024 18:00',
    updated_by: { name: 'Mariana Ferreira', avatar: 'https://i.pravatar.cc/150?u=3' },
  },
  {
    id: 4,
    status: false,
    instance: 'construtorax',
    erp: 'Mega',
    erp_type: 'mega',
    id_cod: 'ERP-MEGA-002',
    situation: 'Online',
    last_activity: '05-05-2024 11:00',
    integration_date: '03-05-2024 09:00',
    updated_by: { name: 'João Silva', avatar: 'https://i.pravatar.cc/150?u=4' },
  },
]

// --- 5. FILTRO AUTOMÁTICO ---
const filteredData = computed(() => {
  if (props.type === 'all' || !props.type) {
    return allData
  }
  return allData.filter((item) => item.erp_type === props.type)
})

// --- CONFIGURAÇÃO DA TABELA ---
const columns = [
  { key: 'status', label: 'Status', width: '80px', align: 'center' },
  { key: 'instance', label: 'Instância' },
  { key: 'erp', label: 'ERP' },
  { key: 'id_cod', label: 'ID' },
  { key: 'situation', label: 'Situação' },
  { key: 'last_activity', label: 'Última atividade' },
  { key: 'integration_date', label: 'Data da Integração' },
  { key: 'updated_by', label: 'Atualizado por' },
  { key: 'actions', label: '', width: '50px' },
]

// --- HELPERS VISUAIS ---
const getBadgeClass = (status) => {
  switch (status) {
    case 'Online':
      return 'badge-success'
    case 'Offline':
      return 'badge-danger'
    case 'Alerta':
      return 'badge-warning'
    default:
      return 'badge-default'
  }
}

// --- AÇÕES ---
const handleAction = (action, item) => {
  if (action === 'view') {
    // Redireciona para a estrutura: /integracoes/erp/[tipo]/[id]
    // Ex: /integracoes/erp/sienge/ERP-PLM-SNG-001
    return navigateTo(`/integracoes/erp/${item.erp_type}/${item.id_cod}`)
  }
  if (action === 'edit') console.log('Editar', item.id)
  if (action === 'delete') console.log('Deletar', item.id)
}
</script>

<style scoped>
/* Container principal */
.content {
  padding: 24px;
  background-color: #fff;
  min-height: calc(100vh - 200px);
}

/* Badges */
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
.badge-warning {
  background-color: #fef9c3;
  color: #a16207;
}
.badge-default {
  background-color: #f1f5f9;
  color: #475569;
}

/* Avatar e Nome */
.user-cell {
  display: flex;
  align-items: center;
  gap: 10px;
}
.avatar {
  width: 32px;
  height: 32px;
  border-radius: 50%;
  object-fit: cover;
  border: 1px solid #e2e8f0;
}
.user-name {
  font-weight: 500;
  color: #334155;
}

/* Datas e Ícones */
.data-cell {
  display: flex;
  align-items: center;
  gap: 8px;
  color: #64748b;
}

/* Botão de Ação */
.action-btn {
  background: none;
  border: none;
  cursor: pointer;
  color: #94a3b8;
  padding: 6px;
  border-radius: 6px;
  transition: all 0.2s ease;
  display: flex;
  align-items: center;
  justify-content: center;
}

.action-btn:hover {
  color: #7c3aed;
  background-color: #f3e8ff;
}

.btn-active {
  color: #7c3aed;
  background-color: #f3e8ff;
}
</style>
