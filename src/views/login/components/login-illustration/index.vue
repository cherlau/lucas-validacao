<template>
  <div class="login-illustration">
    <div class="login-illustration-message">
      <img src="@/assets/images/logos/facilita-icon-solo-white.png" alt="Logo" />
      <p>
        <span class="login-illustration-message__highlight">Conectando pessoas,</span> tecnologia e
        negócios para impulsionar o futuro
      </p>
    </div>
  </div>
</template>

<script setup>
defineOptions({
  name: 'LoginIllustration',
})
</script>

<style scoped>
.login-illustration {
  position: relative;
  display: flex;
  align-items: end;
  padding: 50px;
  background-image: url('@/assets/images/login/login-bg.png');
  background-position: center center;
  background-size: cover;
  width: 57%;
}

.login-illustration::after {
  content: '';
  position: absolute;
  inset: 0;
  background: radial-gradient(63.51% 59.23% at 48.06% 57.11%, #9897e0 0%, #080a0e 100%);
  mix-blend-mode: multiply;
  pointer-events: none;
  z-index: 1;
}

.login-illustration img {
  max-width: 100%;
  border-radius: 0.5rem;
}

.login-illustration-message {
  width: 360px;
  margin-bottom: 70px;
  z-index: 2;
}

.login-illustration-message img {
  width: 65px;
  margin-bottom: 25px;
}

.login-illustration-message p {
  color: #fff;
  font-size: 28px;
  font-weight: 300;
  line-height: 33px;
}

.login-illustration-message__highlight {
  color: #5e5cf0;
}
</style>