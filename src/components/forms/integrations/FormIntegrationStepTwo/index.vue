<template>
  <div class="form-step">
    <UiSelect
      v-model="form.unavailableUnitsBehavior"
      label="Unidades com status incomum"
      :options="unitOptions"
    />

    <!-- <div class="grid-2">
      <UiInput v-model="form.availableColor" label="Cor unidades disponíveis" type="color" />
      <UiInput v-model="form.unavailableColor" label="Cor unidades indisponíveis" type="color" />
    </div> -->

    <div class="grid-2">
      <UiInput v-model="form.proposalValidity" label="Validade da Proposta (min)" />
      <UiInput v-model="form.clientOriginCode" label="Código de Origem do Cliente" />
    </div>

    <div class="grid-2">
      <UiSelect
        v-model="form.contractPercentage"
        label="Porcentagem no Contrato"
        :options="percentageOptions"
      />
      <UiInput v-model="form.billingPattern" label="Padrão de Cobrança" />
    </div>

    <div class="content-switchs">
      <div class="grid-2">
        <UiSwitch v-model="form.sendFutureValue" label="Enviar Valor Futuro" />
        <UiSwitch v-model="form.sendConfirmedProposal" label="Enviar Proposta Confirmada" />
      </div>

      <UiSwitch
        v-model="form.updateClientOnSend"
        label="Atualizar dados do cliente ao enviar proposta"
      />
    </div>
  </div>
</template>

<script setup lang="ts">
defineProps<{
  form: any
}>()

const unitOptions = [
  { label: 'Não Mostrar Unidades', value: 'hide' },
  { label: 'Mostrar como indisponível', value: 'disable' },
]

const percentageOptions = [
  { label: '10%', value: '10' },
  { label: '20%', value: '20' },
  { label: '30%', value: '30' },
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
  gap: 20px;
}

.content-switchs {
  display: flex;
  flex-direction: column;
  gap: 20px;
  margin-top: 6px;
}
</style>
