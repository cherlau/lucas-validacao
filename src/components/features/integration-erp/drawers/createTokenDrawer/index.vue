<template>
  <UiDrawer
    :model-value="modelValue"
    title="Criar Token de API"
    subtitle="Conceda apenas as permissões necessárias e armazene o token em local seguro."
    @update:model-value="$emit('update:modelValue', $event)"
  >
    <div class="drawer-form-content">
      <section class="form-section">
        <h3 class="section-step">2. Dados</h3>
        <div class="form-group">
          <label>Nome</label>
          <input v-model="form.name" type="text" placeholder="Ex: Facilita CRM" class="ui-input" />
        </div>
        <div class="form-group">
          <label>Expira em</label>
          <UiSelect v-model="form.expires" :data="expiryOptions" />
        </div>
      </section>

      <section class="form-section">
        <hr class="divider" />
        <h3 class="section-step mt-4">1. Permissões.</h3>
        <p class="section-desc">Selecione quais ações este token poderá realizar.</p>

        <div class="permissions-list">
          <div
            v-for="group in permissionGroups"
            :key="group.id"
            :class="['permission-group-item', { active: expandedGroup === group.id }]"
          >
            <div class="group-header" @click="toggleGroup(group.id)">
              <label class="checkbox-container" @click.stop>
                <input v-model="form.permissions[group.id].all" type="checkbox" />
                <span class="checkmark"></span>
                <span class="label-text">{{ group.label }}</span>
              </label>
              <i
                :class="[
                  'far',
                  expandedGroup === group.id ? 'fa-chevron-up' : 'fa-chevron-down',
                  'arrow-icon',
                ]"
              ></i>
            </div>

            <div v-if="expandedGroup === group.id" class="group-content">
              <label v-for="sub in group.subs" :key="sub.label" class="sub-permission-item">
                <div class="sub-permission-row">
                  <div class="checkbox-wrapper">
                    <label class="checkbox-container">
                      <input v-model="form.permissions[group.id][sub.key]" type="checkbox" />
                      <span class="checkmark"></span>
                    </label>
                  </div>
                  <div class="text-content">
                    <span class="sub-title">{{ sub.label }}</span>
                    <span class="sub-desc">{{ sub.desc }}</span>
                  </div>
                </div>
              </label>
            </div>
          </div>
        </div>
      </section>

      <section class="form-section">
        <hr class="divider" />
        <h3 class="section-step mt-4">3. Restrição de IP</h3>
        <p class="section-desc">
          O Token só funcionará para requisições vindas dos IPs listados abaixo. Deixe em branco
          para permitir qualquer IP.
        </p>
        <div class="form-group">
          <label>Endereços permitidos</label>
          <textarea
            v-model="form.ipRestriction"
            placeholder="192.168.0.1"
            class="ui-textarea"
          ></textarea>
        </div>
      </section>
    </div>

    <template #footer>
      <div class="drawer-footer-actions">
        <button class="btn-ghost" @click="$emit('update:modelValue', false)">Cancelar</button>
        <button class="btn-primary" @click="submit">Gerar Token</button>
      </div>
    </template>
  </UiDrawer>
</template>

<script setup>
import { ref, reactive } from 'vue'
import UiDrawer from '@/components/ui/drawer'
// Importe seu UiSelect aqui se necessário

const props = defineProps({
  modelValue: Boolean,
})
const emit = defineEmits(['update:modelValue', 'confirm'])

const expandedGroup = ref('unidades')

const form = reactive({
  name: 'Facilita CRM',
  expires: 'never',
  ipRestriction: '',
  permissions: {
    empreendimentos: { all: true },
    unidades: { all: false, listar: false, dados: false, editar: false, excluir: false },
    reservas: { all: true },
    comissoes: { all: false },
    posvenda: { all: false },
  },
})

const expiryOptions = [
  { label: 'Nunca Expira', value: 'never' },
  { label: '30 Dias', value: '30d' },
]

const permissionGroups = [
  { id: 'empreendimentos', label: 'Empreendimentos', subs: [] },
  {
    id: 'unidades',
    label: 'Unidades',
    subs: [
      { key: 'listar', label: 'Listar Unidades', desc: 'Permite listar todas as unidades' },
      { key: 'dados', label: 'Dados da Unidade', desc: 'Permite consultar dados de uma unidade' },
      { key: 'editar', label: 'Editar Unidade', desc: 'Permite editar dados da unidade' },
      { key: 'excluir', label: 'Excluir Unidade', desc: 'Permite excluir uma unidade' },
    ],
  },
  { id: 'reservas', label: 'Reservas', subs: [] },
  { id: 'comissoes', label: 'Comissões', subs: [] },
  { id: 'posvenda', label: 'Pós-venda', subs: [] },
]

const toggleGroup = (id) => {
  expandedGroup.value = expandedGroup.value === id ? null : id
}

const submit = () => {
  emit('confirm', { ...form })
}
</script>

<style lang="stylus" scoped>
/* --- Layout Geral do Drawer --- */
.drawer-form-content
  padding: 24px 32px
  display: flex
  flex-direction: column
  /* Removido o gap grande geral para controlar via margin-top nos titulos */

.form-section
  display: flex
  flex-direction: column
  gap: 16px
  margin-bottom: 24px

.section-step
  font-size: 16px
  font-weight: 700
  color: #0f172a
  margin: 0

.mt-4
  margin-top 24px

.section-desc
  font-size: 14px
  color: #64748b
  margin: -8px 0 8px 0
  line-height: 1.5

.divider
  border: none
  border-top: 1px solid #e2e8f0
  margin: 0
  width: 100%

/* --- Inputs e Labels --- */
.form-group
  display: flex
  flex-direction: column
  gap: 8px

  label
    font-size: 14px
    font-weight: 600
    color: #0f172a

.ui-input
  height: 40px
  padding: 0 12px
  border: 1px solid #cbd5e1
  border-radius: 6px
  font-size: 14px
  color: #334155
  &:focus
    outline: none
    border-color: #5e5cf0
    box-shadow: 0 0 0 2px rgba(94, 92, 240, 0.1)

.ui-textarea
  padding: 12px
  border: 1px solid #e2e8f0
  border-radius: 6px
  font-size: 14px
  min-height: 80px
  background-color: #f8fafc /* Azul bem clarinho */
  color: #64748b
  resize: none
  &:focus
    outline: none
    border-color: #5e5cf0

/* --- Lista de Permissões --- */
.permissions-list
  border: 1px solid #e2e8f0
  border-radius: 6px
  overflow: hidden
  margin-top: 8px

.permission-group-item
  border-bottom: 1px solid #e2e8f0
  &:last-child
    border-bottom: none

  .group-header
    padding: 16px
    display: flex
    justify-content: space-between
    align-items: center
    background: #fff
    cursor: pointer
    transition: background 0.2s

    &:hover
      background-color: #f8fafc

    .arrow-icon
      color: #5e5cf0 /* Roxo da marca */
      font-size: 12px

  /* Estado Ativo (Aberto) */
  &.active
    .group-header
      border-bottom: 1px solid #e2e8f0
    .group-content
      background: #fff
      padding: 20px 16px
      display: flex
      flex-direction: column
      gap: 20px

/* --- Checkbox Customizado (O Segredo do Layout) --- */
.checkbox-container
  display: flex
  align-items: center
  gap: 10px
  cursor: pointer
  user-select: none
  position: relative

  input
    position: absolute
    opacity: 0
    cursor: pointer
    height: 0
    width: 0

  /* O quadrado do checkbox */
  .checkmark
    height: 18px
    width: 18px
    background-color: #fff
    border: 1px solid #cbd5e1
    border-radius: 4px
    position: relative
    transition: all 0.2s

  /* Texto do label principal */
  .label-text
    font-size: 14px
    font-weight: 600
    color: #1e293b

  /* Quando marcado */
  input:checked ~ .checkmark
    background-color: #5e5cf0
    border-color: #5e5cf0

  /* O ícone de check (feito com CSS) */
  .checkmark:after
    content: ""
    position: absolute
    display: none
    left: 6px
    top: 2px
    width: 5px
    height: 9px
    border: solid white
    border-width: 0 2px 2px 0
    transform: rotate(45deg)

  input:checked ~ .checkmark:after
    display: block

/* --- Sub-permissões (Layout Interno) --- */
.sub-permission-item
  cursor: pointer
  display: block

.sub-permission-row
  display: flex
  align-items: flex-start
  gap: 12px

.checkbox-wrapper
  padding-top: 2px /* Alinha checkbox com a primeira linha de texto */

.text-content
  display: flex
  flex-direction: column
  gap: 2px

.sub-title
  font-size: 14px
  font-weight: 500
  color: #334155

.sub-desc
  font-size: 13px
  color: #94a3b8
  font-weight: 400

/* --- Footer --- */
.drawer-footer-actions
  display: flex
  justify-content: flex-end
  gap: 12px

.btn-ghost
  background: none
  border: none
  color: #64748b
  padding: 8px 16px
  cursor: pointer
  font-weight: 500
  font-size: 14px
  &:hover
    color: #1e293b

.btn-primary
  background-color: #5e5cf0
  color: white
  border: none
  padding: 8px 20px
  border-radius: 6px
  cursor: pointer
  font-weight: 500
  font-size: 14px
  &:hover
    background-color: #4f46e5
</style>
