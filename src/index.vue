<template>
  <div>
    <UiPageHeader
      title="Integrações"
      highlight="ERPs"
      description="Gerencie todas as conexões ERP configuradas para nossos clientes."
      action-label="+ Criar Integração"
      padding="41px"
      @action="abrirModal"
    />
    <UiPageHeader
      :tabs="[
        { label: 'Todos', value: 'monitoramento' },
        { label: 'Arquivados', value: 'configuracoes' },
      ]"
      :active-tab="currentTab"
      @update:active-tab="currentTab = $event"
    />
  </div>
</template>

<script setup></script>
