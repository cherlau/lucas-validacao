<template>
  <div class="form-step">
    <UiInput v-model="form.companyName" label="Nome da Empresa" required />
    <UiInput v-model="form.companyCode" label="Código da Empresa" required />

    <UiSelect
      v-model="form.integrationType"
      label="Tipo de Integração"
      :data="erpOptions"
      required
    />

    <UiInput v-model="form.integrationUrl" label="URL de Integração" required />

    <div class="grid-2">
      <UiInput v-model="form.username" label="Usuário" required />
      <UiInput v-model="form.password" label="Senha" type="password" required />
    </div>

    <div class="content-switchs">
      <UiSwitch v-model="form.activeDirectory" label="Active Directory" />
    </div>
  </div>
</template>

<script setup lang="ts">
defineProps<{
  form: any
}>()

const erpOptions = [
  { label: 'UAU', value: 'uau' },
  { label: 'Sienge', value: 'sienge' },
  { label: 'Mega', value: 'mega' },
]
</script>

<style scoped>
.grid-2 {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 16px;
}

.form-step {
  display: flex;
  flex-direction: column;
  gap: 16px;
}

.content-switchs {
  display: flex;
  flex-direction: column;
  gap: 20px;
  margin-top: 6px;
}
</style>
