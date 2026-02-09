<template>
  <div class="dt-container">
    <div class="dt-wrapper">
      <table class="dt-table">
        <thead>
          <tr>
            <th v-if="showCheckbox" class="dt-checkbox-col">
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
          <tr v-for="item in displayData" :key="item.id">
            <td v-if="showCheckbox" class="dt-checkbox-col">
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

          <tr v-if="displayData.length === 0">
            <td :colspan="showCheckbox ? columns.length + 1 : columns.length" class="dt-empty">
              Nenhum registro encontrado.
            </td>
          </tr>
        </tbody>
      </table>
    </div>

    <div class="dt-footer">
      <template v-if="grandTotal <= 15">
        <div class="dt-footer-left">
          <span class="dt-text">
            Exibindo {{ startRecord.toString().padStart(2, '0') }} a
            {{ endRecord.toString().padStart(2, '0') }} resultados
          </span>
        </div>
      </template>

      <template v-else>
        <div class="dt-footer-left">
          <span class="dt-text">Resultados por página:</span>
          <div class="select-wrapper">
            <select
              :value="pageSize"
              class="dt-select"
              @change="changePageSize(($event.target as HTMLSelectElement).value)"
            >
              <option :value="15">15</option>
              <option :value="25">25</option>
              <option :value="50">50</option>
              <option :value="100">100</option>
            </select>
          </div>
        </div>

        <div class="dt-footer-right">
          <span class="dt-text">
            Exibindo {{ startRecord }} a {{ endRecord }} de {{ grandTotal }} resultados
          </span>

          <div class="dt-pagination">
            <button
              class="page-btn"
              :disabled="currentPage === 1"
              @click="changePage(currentPage - 1)"
            >
              ‹
            </button>

            <button
              v-for="page in displayedPages"
              :key="page"
              class="page-btn"
              :class="{ active: page === currentPage }"
              @click="changePage(page as number)"
            >
              {{ page }}
            </button>

            <button
              class="page-btn"
              :disabled="currentPage === totalPages"
              @click="changePage(currentPage + 1)"
            >
              ›
            </button>
          </div>
        </div>
      </template>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, watch } from 'vue'
import CheckBox from '@/components/ui/checkbox'

interface Column {
  key: string
  label: string
  sortable?: boolean
  align?: 'left' | 'center' | 'right'
  width?: string
}

const props = withDefaults(
  defineProps<{
    columns: Column[]
    data: any[]
    showCheckbox?: boolean // Prop adicionada
    mode?: 'client' | 'server'
    totalItems?: number
    initialPage?: number
    initialPageSize?: number
  }>(),
  {
    showCheckbox: true,
    mode: 'client',
    totalItems: 0,
    initialPage: 1,
    initialPageSize: 15,
  }
)

const emit = defineEmits(['update:page', 'update:pageSize', 'page-change'])

const currentPage = ref(props.initialPage)
const pageSize = ref(props.initialPageSize)

const grandTotal = computed(() => {
  return props.mode === 'server' ? props.totalItems : props.data.length
})

const totalPages = computed(() => {
  return Math.ceil(grandTotal.value / pageSize.value) || 1
})

const displayData = computed(() => {
  if (props.mode === 'server') {
    return props.data
  } else {
    const start = (currentPage.value - 1) * pageSize.value
    const end = start + pageSize.value
    return props.data.slice(start, end)
  }
})

const startRecord = computed(() => {
  if (grandTotal.value === 0) return 0
  return (currentPage.value - 1) * pageSize.value + 1
})

const endRecord = computed(() => {
  const end = currentPage.value * pageSize.value
  return end > grandTotal.value ? grandTotal.value : end
})

const displayedPages = computed(() => {
  if (totalPages.value <= 7) {
    return Array.from({ length: totalPages.value }, (_, i) => i + 1)
  }
  let start = Math.max(1, currentPage.value - 2)
  let end = Math.min(totalPages.value, currentPage.value + 2)

  if (start <= 2) end = Math.min(5, totalPages.value)
  if (end >= totalPages.value - 1) start = Math.max(1, totalPages.value - 4)

  const pages = []
  for (let i = start; i <= end; i++) pages.push(i)
  return pages
})

const changePage = (page: number) => {
  if (page < 1 || page > totalPages.value) return
  currentPage.value = page
  emit('update:page', page)
  emit('page-change', { page: currentPage.value, pageSize: pageSize.value })
}

const changePageSize = (val: string) => {
  const newSize = parseInt(val)
  pageSize.value = newSize
  currentPage.value = 1
  emit('update:pageSize', newSize)
  emit('page-change', { page: 1, pageSize: newSize })
}

const selected = ref<Set<string | number>>(new Set())
const selectAll = ref(false)

const onSelectAll = (isChecked: boolean) => {
  selectAll.value = isChecked
  if (isChecked) {
    displayData.value.forEach((item) => selected.value.add(item.id))
  } else {
    selected.value.clear()
  }
}

const toggleSelect = (id: string | number) => {
  if (selected.value.has(id)) {
    selected.value.delete(id)
  } else {
    selected.value.add(id)
  }
  if (selected.value.size !== displayData.value.length) {
    selectAll.value = false
  }
}

watch(
  () => props.data,
  () => {
    if (props.mode === 'server') {
      /* Opcional: resetar seleção aqui */
    }
  }
)
</script>

<style scoped>
/* Container Geral */
.dt-container {
  border: 1px solid #e2e8f0;
  border-radius: 8px;
}

.dt-wrapper {
  width: 100%;
  overflow-x: auto;
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
  font-size: 12px;
  color: #1e2339;
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

/* --- RODAPÉ DA PAGINAÇÃO (Novo) --- */
.dt-footer {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 27px 17px;
  border-top: 1px solid #e2e8f0;
  background-color: #ffffff;
  font-size: 11px;
  color: #738cac;
  border-bottom-left-radius: 8px;
  border-bottom-right-radius: 8px;
  flex-wrap: wrap;
  gap: 10px;
}

.dt-footer-left,
.dt-footer-right {
  display: flex;
  align-items: center;
  gap: 12px;
}

.dt-select {
  border: 1px solid #cbd5e1;
  border-radius: 4px;
  padding: 4px 8px;
  color: #475569;
  font-size: 14px;
  outline: none;
  cursor: pointer;
  background-color: white;
}
.dt-select:focus {
  border-color: #4f46e5;
}

.dt-pagination {
  display: flex;
  border: 1px solid #e2e8f0;
  border-radius: 4px;
  overflow: hidden;
}

.page-btn {
  background: white;
  border: none;
  border-right: 1px solid #e2e8f0;
  padding: 6px 12px;
  cursor: pointer;
  color: #64748b;
  font-size: 14px;
  min-width: 32px;
  transition: all 0.2s;
}

.page-btn:last-child {
  border-right: none;
}
.page-btn:hover:not(:disabled) {
  background-color: #f8fafc;
  color: #5e5cf0;
}
.page-btn:disabled {
  opacity: 0.5;
  cursor: not-allowed;
}
.page-btn.active {
  color: #5e5cf0;
  font-weight: 600;
}
</style>
