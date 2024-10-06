<script setup lang="ts">
const model = defineModel()

const { data, status } = useAPI('/api/division')
</script>

<template>
  <NSelect v-if="status === 'success'" v-model:value="model" filterable :options="data.divisions" value-field="id" />
  <NSkeleton v-else :sharp="false" height="100%" width="100%" />
</template>
