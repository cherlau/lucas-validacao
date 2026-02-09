<template>
  <UiModal
    :model-value="modelValue"
    size="md"
    :hide-header="true"
    @update:model-value="handleClose"
  >
    <template #header>
      <div class="custom-header">
        <div class="title-group">
          <div class="success-icon-wrapper">
            <i class="fas fa-check"></i>
          </div>
          <h2 class="success-title">Token de API Gerado com Sucesso!</h2>
        </div>
      </div>
    </template>
    <div class="modal-body-content">
      <div class="warning-card">
        <div class="warning-icon">
          <i class="fal fa-exclamation-triangle"></i>
          <strong>Importante</strong>
        </div>
        <div class="warning-text">
          <p>
            Este token não será exibido novamente. Armazene ele em um lugar seguro. Em caso de perda
            você precisará revogá-lo.
          </p>
        </div>
      </div>

      <div class="token-section">
        <label class="section-label">Seu Token de API</label>
        <UiCodeBox :code="token" class="mb-4" />
      </div>

      <div class="instructions-card">
        <strong>Instruções de uso:</strong>
        <p>
          Para usar, inclua este token no cabeçalho Authorization de suas requisições API. Consulte
          a <a href="#" class="link">documentação da API.</a>
        </p>
      </div>
    </div>

    <template #footer>
      <div class="custom-footer">
        <UiButton variant="primary" class="btn-confirm" @click="handleClose"> Entendi </UiButton>
      </div>
    </template>
  </UiModal>
</template>

<script setup>
import { defineProps, defineEmits } from 'vue'

const props = defineProps({
  modelValue: {
    type: Boolean,
    required: true,
  },
  token: {
    type: String,
    default: '',
  },
})

const emit = defineEmits(['update:model-value', 'confirm'])

const handleClose = () => {
  emit('update:model-value', false)
  emit('confirm')
}
</script>

<style lang="stylus" scoped>
/* Ajuste do container principal do corpo */
.modal-body-content {
  display: flex;
  flex-direction: column;
  gap: 24px;
}

/* --- Cabeçalho Customizado --- */
.custom-header {
  display: flex;
  justify-content: space-between;
  align-items: flex-start;
  margin-bottom: 8px;
}

.title-group {
  display: flex;
  align-items: center;
  gap: 16px;
}

.success-icon-wrapper {
  width: 32px; /* Reduzi um pouco para ficar proporcional ao título */
  height: 32px;
  min-width: 32px;
  background-color: #22c55e;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  color: white;
  font-size: 14px;
  box-shadow: 0 4px 6px -1px rgba(34, 197, 94, 0.2);
}

.success-title {
  font-size: 18px;
  font-weight: 700;
  color: #1e293b;
  margin: 0;
  line-height: 1.2;
}

/* Botão de Fechar (X) */
.close-btn {
  background: transparent;
  border: none;
  color: #94a3b8;
  font-size: 18px;
  cursor: pointer;
  padding: 4px;
  margin-top: -4px; /* Ajuste fino para alinhar ao topo */
  transition: color 0.2s;
}
.close-btn:hover {
  color: #64748b;
}

/* --- Card de Aviso (Amarelo) --- */
.warning-card {
  background-color: #fffbeb;
  border: 1px solid #fef3c7;
  border-radius: 8px;
  padding: 16px;
  display: flex;
  gap: 12px;
  align-items: flex-start;
	flex-direction: column
}

.warning-icon {
  color: #d97706;
  font-size: 18px;
  margin-top: 2px;
	display: flex
	align-items: center;
	gap: 8px;
}

.warning-icon strong {
	font-size: 14px;
	color: #b45309;
}

.warning-text {
  font-size: 12px;
  color: #92400e;
  line-height: 1.5;
}

.warning-text strong {
  display: block;
  margin-bottom: 4px;
  font-weight: 600;
  color: #b45309;
}

.warning-text p {
  margin: 0;
  color: #b45309;
}

/* --- Seção do Token --- */
.section-label {
  display: block;
  font-size: 14px;
  font-weight: 600;
  color: #1e293b;
  margin-bottom: 8px;
}

/* --- Card de Instruções --- */
.instructions-card {
  border: 1px solid #e2e8f0;
  border-radius: 8px;
  padding: 20px; /* Mais padding conforme a imagem */
  font-size: 14px;
  color: #475569;
  background-color: #fff;
}

.instructions-card strong {
  display: block;
  font-size: 14px;
  font-weight: 600;
  color: #1e293b;
  margin-bottom: 8px;
}

.instructions-card p {
  margin: 0;
  line-height: 1.5;
  color: #475569;
}

.link {
  color: #4f46e5;
  text-decoration: underline;
  cursor: pointer;
}

/* --- Rodapé Customizado (Footer) --- */
/* O template #footer do UiModal geralmente remove o padding padrão.
   Aqui criamos a caixa cinza */
.custom-footer {
  background-color: #f8fafc; /* Cor de fundo cinza claro */
  border-top: 1px solid #e2e8f0;
  padding: 16px 24px;
  display: flex;
  justify-content: flex-end;
  border-bottom-left-radius: 8px; /* Arredonda cantos inferiores se o modal tiver */
  border-bottom-right-radius: 8px;
  /* Margin negativa caso o UiModal tenha padding interno no footer container */
  margin: -16px -24px -16px -24px;
  /* Nota: Se o layout quebrar, remova as margens negativas e ajuste o padding */
}

.btn-confirm {
  padding: 10px 24px;
  font-weight: 500;
}
</style>
