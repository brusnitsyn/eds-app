<script setup lang="ts">
const { data: divisions } = await useAsyncData('divisions', () => useSanctumFetch('/api/division'))
</script>

<template>
</template>
