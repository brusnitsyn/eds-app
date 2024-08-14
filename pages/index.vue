<script setup lang="ts">
const client = useSanctumClient()
const { data: divisions } = await useAsyncData('divisions', () => client('/api/division'))
</script>

<template>
  <pre>
    {{ divisions }}
  </pre>
</template>
