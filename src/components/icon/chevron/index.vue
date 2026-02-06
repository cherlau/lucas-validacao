<template>
  <svg
    :width="width"
    :height="height"
    viewBox="0 0 7 5"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
  >
    <path fill-rule="evenodd" clip-rule="evenodd" d="M3.5 5L7 0H0L3.5 5Z" :fill="fill" />
  </svg>
</template>

<script setup>
defineProps({
  fill: {
    type: String,
    default: '#5E5CF0',
  },
  width: {
    type: [String, Number],
    default: 7,
  },
  height: {
    type: [String, Number],
    default: 5,
  },
})
</script>
