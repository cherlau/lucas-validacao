<template>
  <UiModal
    v-model="modalOpen"
    title="Nova Integração ERP"
    subtitle="Configure uma nova integração com o ERP"
    size="lg"
    icon="fal fa-cog"
  >
    <FormIntegrationStepOne v-if="step === 1" :form="form" />
    <FormIntegrationStepTwo v-else :form="form" />

    <template #footer>
      <div class="btn-actions">
        <UiButton v-if="step === 2" variant="secondary" @click="step = 1"> Voltar </UiButton>

        <UiButton variant="primary" :disabled="step === 1 && !isStepOneValid()" @click="handleNext">
          {{ step === 1 ? 'Avançar' : 'Salvar Integração' }}
        </UiButton>
      </div>
    </template>
  </UiModal>
</template>

<script setup lang="ts">
import { ref, computed } from 'vue'
import { useIntegrationForm } from '@/components/forms/integrations/useIntegrationForm.js'
import FormIntegrationStepOne from '@/components/forms/integrations/FormIntegrationStepOne/index.vue'
import FormIntegrationStepTwo from '@/components/forms/integrations/FormIntegrationStepTwo/index.vue'

const props = defineProps<{
  modelValue: boolean
}>()

const emit = defineEmits<{
  (e: 'update:modelValue', value: boolean): void
  (e: 'submit', payload: any): void
}>()

// 🔑 Proxy do v-model
const modalOpen = computed({
  get: () => props.modelValue,
  set: (value) => emit('update:modelValue', value),
})

const step = ref<1 | 2>(1)

const { form, isStepOneValid } = useIntegrationForm()

const handleNext = () => {
  if (step.value === 1) {
    step.value = 2
    return
  }

  emit('submit', { ...form })
  modalOpen.value = false
  step.value = 1
}
</script>

<style scoped>
.btn-actions {
  display: flex;
  justify-content: flex-end;
  gap: 8px;
}
</style>
