<script setup>
import { useRoute } from 'vue-router'
import IntegrationListView from '@/views/integration/erp/integration-list/index.vue'

const route = useRoute()
</script>

<template>
  <IntegrationListView :type="route.params.type" />
</template>
