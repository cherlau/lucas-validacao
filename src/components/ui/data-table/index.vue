<template>
  <div class="dt-wrapper">
    <table class="dt-table">
      <thead>
        <tr>
          <th class="dt-checkbox-col">
            <div class="dt-checkbox-wrapper">
              <CheckBox v-model="selectAll" @change="onSelectAll" />
            </div>
          </th>

          <th
            v-for="col in columns"
            :key="col.key"
            :style="{ width: col.width }"
            :class="{ sortable: col.sortable }"
          >
            <div
              class="th-content"
              :style="{
                justifyContent:
                  col.align === 'center'
                    ? 'center'
                    : col.align === 'right'
                      ? 'flex-end'
                      : 'flex-start',
              }"
            >
              {{ col.label }}
              <span v-if="col.sortable" class="sort-icon">⇅</span>
            </div>
          </th>
        </tr>
      </thead>
      <tbody>
        <tr v-for="item in data" :key="item.id">
          <td class="dt-checkbox-col">
            <div class="dt-checkbox-wrapper">
              <CheckBox
                :model-value="selected.has(item.id)"
                @change="() => toggleSelect(item.id)"
              />
            </div>
          </td>

          <td v-for="col in columns" :key="col.key">
            <div
              class="td-content"
              :style="{
                justifyContent:
                  col.align === 'center'
                    ? 'center'
                    : col.align === 'right'
                      ? 'flex-end'
                      : 'flex-start',
              }"
            >
              <slot :name="`cell-${col.key}`" :item="item" :value="item[col.key]">
                {{ item[col.key] }}
              </slot>
            </div>
          </td>
        </tr>
      </tbody>
    </table>
  </div>
</template>

<script setup lang="ts">
import { ref, watch } from 'vue'
// Importação do seu componente
import CheckBox from '@/components/ui/checkbox'

interface Column {
  key: string
  label: string
  sortable?: boolean
  align?: 'left' | 'center' | 'right'
  width?: string
}

const props = defineProps<{
  columns: Column[]
  data: any[]
}>()

// --- LÓGICA DE SELEÇÃO ---
const selected = ref<Set<string | number>>(new Set())
const selectAll = ref(false)

// Atualiza o Set quando clica no header
const onSelectAll = (isChecked: boolean) => {
  // O v-model já atualizou o selectAll.value, mas garantimos a sincronia
  selectAll.value = isChecked

  if (isChecked) {
    props.data.forEach((item) => selected.value.add(item.id))
  } else {
    selected.value.clear()
  }
}

// Alterna um item individual
const toggleSelect = (id: string | number) => {
  if (selected.value.has(id)) {
    selected.value.delete(id)
  } else {
    selected.value.add(id)
  }

  // Opcional: Desmarcar o "Select All" se um item for desmarcado manualmente
  if (selected.value.size !== props.data.length) {
    selectAll.value = false
  }
}
</script>

<style scoped>
/* Container Geral */
.dt-wrapper {
  width: 100%;
  overflow-x: auto;
  border: 1px solid #e2e8f0;
  border-radius: 8px;
  background-color: #ffffff;
  box-shadow: 0 1px 3px rgba(0, 0, 0, 0.05);
  font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif;
}

/* Tabela */
.dt-table {
  width: 100%;
  border-collapse: separate;
  border-spacing: 0;
  font-size: 14px;
  color: #475569;
}

/* Cabeçalho */
.dt-table thead {
  background-color: #f8fafc;
}

.dt-table th {
  padding: 12px 16px;
  font-weight: 600;
  text-transform: uppercase;
  font-size: 12px;
  color: #64748b;
  white-space: nowrap;
  border-bottom: 1px solid #e2e8f0;
  border-right: 1px solid #e2e8f0;
}

.th-content {
  display: flex;
  align-items: center;
  gap: 6px;
}

.sortable {
  cursor: pointer;
}
.sortable:hover {
  background-color: #f1f5f9;
}

.sort-icon {
  font-size: 14px;
  opacity: 0.5;
}

/* Corpo e Linhas */
.dt-table tr {
  transition: all 0.2s;
}

.dt-table tbody tr:hover {
  background-color: #f8fafc;
  box-shadow: inset 4px 0 0 0 #4f46e5;
}

.dt-table td {
  padding: 12px 16px;
  vertical-align: middle;
  white-space: nowrap;
  border-bottom: 1px solid #f1f5f9;
  border-right: 1px solid #f1f5f9;
}

/* Remove bordas das últimas linhas/colunas */
.dt-table tbody tr:last-child td {
  border-bottom: none;
}
.dt-table th:last-child,
.dt-table td:last-child {
  border-right: none;
}

/* Conteúdo da Célula */
.td-content {
  display: flex;
  align-items: center;
  height: 100%;
  min-height: 24px;
}

/* Coluna do Checkbox */
.dt-checkbox-col {
  width: 40px;
  padding-left: 12px;
}

.dt-checkbox-wrapper {
  display: flex;
  align-items: center;
  justify-content: center;
  height: 100%;
  /* Removemos a estilização manual do input pois o componente CheckBox cuida disso */
}
</style>
