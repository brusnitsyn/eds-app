<script setup lang="ts">
const attrs = useAttrs()
</script>

<template>
  <NuxtLink v-bind="attrs" #="{ navigate, href }" custom>
    <n-a :href="href" @click="navigate">
      <slot />
    </n-a>
  </NuxtLink>
</template>

<style scoped>

</style>