<template>
  <div class="dt-container">
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
          <tr v-for="item in displayData" :key="item.id">
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

          <tr v-if="displayData.length === 0">
            <td :colspan="columns.length + 1" class="dt-empty">Nenhum registro encontrado.</td>
          </tr>
        </tbody>
      </table>
    </div>

    <div class="dt-footer">
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
            @click="changePage(page)"
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
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, watch } from 'vue'
// Importação do seu componente
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
    // Novas props para paginação
    mode?: 'client' | 'server' // 'client' = corta o array localmente, 'server' = backend manda só a página
    totalItems?: number // Obrigatório se mode for 'server'
    initialPage?: number
    initialPageSize?: number
  }>(),
  {
    mode: 'client',
    totalItems: 0,
    initialPage: 1,
    initialPageSize: 15,
  }
)

const emit = defineEmits(['update:page', 'update:pageSize', 'page-change'])

// --- ESTADO DA PAGINAÇÃO ---
const currentPage = ref(props.initialPage)
const pageSize = ref(props.initialPageSize)

// --- COMPUTEDS DE DADOS ---

// Calcula o total real de itens dependendo do modo
const grandTotal = computed(() => {
  return props.mode === 'server' ? props.totalItems : props.data.length
})

// Calcula o número total de páginas
const totalPages = computed(() => {
  return Math.ceil(grandTotal.value / pageSize.value) || 1
})

// Define quais dados mostrar na tabela
const displayData = computed(() => {
  if (props.mode === 'server') {
    // Se for server-side, a prop.data JÁ É a página atual
    return props.data
  } else {
    // Se for client-side, nós cortamos o array
    const start = (currentPage.value - 1) * pageSize.value
    const end = start + pageSize.value
    return props.data.slice(start, end)
  }
})

// Textos de "Exibindo X a Y"
const startRecord = computed(() => {
  if (grandTotal.value === 0) return 0
  return (currentPage.value - 1) * pageSize.value + 1
})

const endRecord = computed(() => {
  const end = currentPage.value * pageSize.value
  return end > grandTotal.value ? grandTotal.value : end
})

// Gera array de páginas para os botões (ex: [1, 2, 3, 4, 5])
const displayedPages = computed(() => {
  const delta = 2 // Quantas páginas mostrar antes e depois da atual
  const range = []
  for (
    let i = Math.max(2, currentPage.value - delta);
    i <= Math.min(totalPages.value - 1, currentPage.value + delta);
    i++
  ) {
    range.push(i)
  }

  if (currentPage.value - delta > 2) {
    range.unshift('...')
  }
  if (currentPage.value + delta < totalPages.value - 1) {
    range.push('...')
  }

  // Sempre mostrar a primeira e a última
  let finalRange = [1]
  if (totalPages.value > 1) {
    // Lógica simplificada para o exemplo, removendo '...' para manter funcionalidade básica
    // Se quiser lógica complexa de '...', precisa tratar o clique no '...'
    // Aqui retornamos todas se forem poucas, ou uma janela simples
    if (totalPages.value <= 7) {
      return Array.from({ length: totalPages.value }, (_, i) => i + 1)
    }

    // Janela deslizante simples
    let start = Math.max(1, currentPage.value - 2)
    let end = Math.min(totalPages.value, currentPage.value + 2)

    // Ajuste nas bordas
    if (start <= 2) end = Math.min(5, totalPages.value)
    if (end >= totalPages.value - 1) start = Math.max(1, totalPages.value - 4)

    const pages = []
    for (let i = start; i <= end; i++) pages.push(i)
    return pages
  }
  return finalRange
})

// --- AÇÕES ---

const changePage = (page: number) => {
  if (page < 1 || page > totalPages.value) return

  currentPage.value = page

  // Emite eventos para o pai saber que mudou (útil para o modo server)
  emit('update:page', page)
  emit('page-change', { page: currentPage.value, pageSize: pageSize.value })
}

const changePageSize = (val: string) => {
  const newSize = parseInt(val)
  pageSize.value = newSize
  currentPage.value = 1 // Reseta para pág 1 ao mudar tamanho

  emit('update:pageSize', newSize)
  emit('page-change', { page: 1, pageSize: newSize })
}

// --- LÓGICA DE SELEÇÃO (Mantida do original) ---
const selected = ref<Set<string | number>>(new Set())
const selectAll = ref(false)

const onSelectAll = (isChecked: boolean) => {
  selectAll.value = isChecked
  if (isChecked) {
    // Nota: No modo Server, isso seleciona apenas a página atual carregada
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

// Watch para garantir que se os dados mudarem (fetch da API), a seleção reseta ou mantém
watch(
  () => props.data,
  () => {
    if (props.mode === 'server') {
      // Opcional: limpar seleção ao trocar de página no server side
      // selectAll.value = false
      // selected.value.clear()
    }
  }
)
</script>

<style scoped>
.dt-container {
  width: 100%;
  border: 1px solid #e2e8f0;
  border-radius: 8px;
  background-color: #ffffff;
  box-shadow: 0 1px 3px rgba(0, 0, 0, 0.05);
  font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif;
  display: flex;
  flex-direction: column;
}

.dt-wrapper {
  width: 100%;
  overflow-x: auto;
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

/* Corpo */
.dt-table tr {
  transition: all 0.2s;
}
.dt-table tbody tr:hover {
  background-color: #f8fafc;
}
.dt-table td {
  padding: 12px 16px;
  vertical-align: middle;
  white-space: nowrap;
  border-bottom: 1px solid #f1f5f9;
  border-right: 1px solid #f1f5f9;
}
.dt-empty {
  text-align: center;
  padding: 24px;
  color: #94a3b8;
}

/* Remove bordas finais */
.dt-table tbody tr:last-child td {
  border-bottom: none;
}
.dt-table th:last-child,
.dt-table td:last-child {
  border-right: none;
}

.td-content {
  display: flex;
  align-items: center;
  height: 100%;
  min-height: 24px;
}
.dt-checkbox-col {
  width: 40px;
  padding-left: 12px;
}
.dt-checkbox-wrapper {
  display: flex;
  align-items: center;
  justify-content: center;
  height: 100%;
}

/* --- RODAPÉ DA PAGINAÇÃO (Novo) --- */
.dt-footer {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 12px 16px;
  border-top: 1px solid #e2e8f0;
  background-color: #ffffff;
  font-size: 14px;
  color: #64748b;
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
