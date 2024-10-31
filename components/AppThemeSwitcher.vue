<script setup lang="ts">
import { IconMoonFilled, IconSunFilled } from '@tabler/icons-vue'

const { colorModePreference } = useNaiveColorMode()

const currentTheme = computed(() => colorModePreference.get())

function switchTheme() {
  colorModePreference.get() === 'light' ? colorModePreference.set('dark') : colorModePreference.set('light')
}
</script>

<template>
  <NButton class="text-xl" text @click="switchTheme">
    <NIcon>
      <IconSunFilled v-if="currentTheme === 'light'" />
      <IconMoonFilled v-else />
    </NIcon>
  </NButton>
</template>

<style scoped>

</style>