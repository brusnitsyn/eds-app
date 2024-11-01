<script setup lang="ts">
import { IconArrowLeft } from '@tabler/icons-vue'

const router = useRouter()
</script>

<template>
  <NButton text @click="router.back()">
    <template #icon>
      <NIcon>
        <IconArrowLeft />
      </NIcon>
    </template>
    Назад
  </NButton>
</template>

<style scoped>

</style>