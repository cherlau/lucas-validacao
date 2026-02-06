<template>
  <div class="ui-card">
    <slot />
  </div>
</template>

<script setup>
defineOptions({
  name: 'UiCard',
})
</script>

<style lang="stylus" scoped>
@import './styles.styl'
</style>