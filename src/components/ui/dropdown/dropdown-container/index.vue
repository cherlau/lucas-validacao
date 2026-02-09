<template>
  <div ref="triggerRef" class="dropdown-container">
    <div class="dropdown-trigger" @click.stop="toggle">
      <slot name="trigger" :is-open="isOpen"></slot>
    </div>

    <Teleport to="body">
      <transition name="fade">
        <div v-if="isOpen" ref="menuRef" class="dropdown-menu-fixed" :style="menuStyles">
          <slot></slot>
        </div>
      </transition>
    </Teleport>
  </div>
</template>

<script setup>
import { ref, onMounted, onUnmounted, nextTick, provide } from 'vue'

const props = defineProps({
  align: {
    type: String,
    default: 'right', // 'left' ou 'right'
  },
})

const isOpen = ref(false)
const triggerRef = ref(null) // Referência ao botão gatilho
const menuRef = ref(null) // Referência ao menu flutuante
const menuStyles = ref({}) // Armazena top/left calculados

// Função para calcular onde o menu deve aparecer na tela
const updatePosition = () => {
  if (!triggerRef.value) return

  // Pega as coordenadas do botão na tela
  const rect = triggerRef.value.getBoundingClientRect()

  const styles = {
    position: 'fixed',
    top: `${rect.bottom + 6}px`, // 6px de margem abaixo do botão
    zIndex: 9999, // Bem alto para ficar acima de tudo
    minWidth: '180px',
  }

  // Lógica de alinhamento
  if (props.align === 'left') {
    // Alinha o lado ESQUERDO do menu com o ESQUERDO do botão
    styles.left = `${rect.left}px`
  } else {
    // Alinha o lado DIREITO do menu com o DIREITO do botão
    // Como é fixed, usamos 'left' calculado matematicamente
    // (rect.right é a distância da esquerda até a borda direita do botão)
    // No entanto, para CSS puro, é mais fácil usar right relativo à janela,
    // mas pode quebrar se a janela redimensionar.
    // Vamos alinhar a direita definindo o left:
    // Left = (Posição Direita do Botão) - (Largura Estimada ou Auto)
    // Uma forma mais segura com CSS fixed é usar o right css property:
    styles.left = 'auto'
    styles.right = `${window.innerWidth - rect.right}px`
  }

  menuStyles.value = styles
}

const toggle = async () => {
  if (isOpen.value) {
    close()
  } else {
    isOpen.value = true
    // Espera o Vue renderizar o elemento para garantir (nextTick)
    // e calcula a posição
    await nextTick()
    updatePosition()
  }
}

const close = () => {
  isOpen.value = false
}

provide('closeDropdown', close)

// Lógica para fechar ao clicar fora
const handleClickOutside = (event) => {
  // Agora precisamos verificar se o clique foi:
  // 1. Fora do Gatilho
  // 2. E Fora do Menu (que agora está no body)

  const clickedInsideTrigger = triggerRef.value && triggerRef.value.contains(event.target)
  const clickedInsideMenu = menuRef.value && menuRef.value.contains(event.target)

  if (!clickedInsideTrigger && !clickedInsideMenu) {
    close()
  }
}

// Fechar ao rolar a página (opcional, mas recomendado para evitar menus voando)
const handleScroll = () => {
  if (isOpen.value) updatePosition()
  // Ou simplesmente close() se preferir fechar ao rolar
}

// Fechar ao redimensionar a tela
const handleResize = () => {
  if (isOpen.value) close()
}

const handleKeydown = (event) => {
  if (event.key === 'Escape') close()
}

onMounted(() => {
  document.addEventListener('click', handleClickOutside)
  document.addEventListener('keydown', handleKeydown)
  window.addEventListener('scroll', handleScroll, true) // 'true' captura scroll de div internas
  window.addEventListener('resize', handleResize)
})

onUnmounted(() => {
  document.removeEventListener('click', handleClickOutside)
  document.removeEventListener('keydown', handleKeydown)
  window.removeEventListener('scroll', handleScroll, true)
  window.removeEventListener('resize', handleResize)
})

defineExpose({ close })
</script>

<style scoped>
.dropdown-container {
  display: inline-block;
  /* position: relative; -> Não é mais necessário para o menu, só para o layout do botão */
}

.dropdown-trigger {
  cursor: pointer;
  display: flex;
}

/* Nova classe para o menu que fica no body */
.dropdown-menu-fixed {
  background-color: white;
  border: 1px solid #e2e8f0;
  border-radius: 8px;
  box-shadow:
    0 4px 6px -1px rgba(0, 0, 0, 0.1),
    0 2px 4px -1px rgba(0, 0, 0, 0.06);
  padding: 6px 0;
  overflow: hidden;
  /* Position, top, left, z-index são injetados via style inline pelo JS */
}

/* Animação de Entrada */
.fade-enter-active,
.fade-leave-active {
  transition:
    opacity 0.2s ease,
    transform 0.2s ease;
}

.fade-enter-from,
.fade-leave-to {
  opacity: 0;
  transform: translateY(-5px);
}
</style>
