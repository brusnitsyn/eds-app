<script lang="ts" setup>
import { dateRuRU, ruRU } from 'naive-ui'

const defaultLang = ruRU
const defaultLangDate = dateRuRU

const themeConfig = ref({
  shared: {
    fontFamily: ['Golos Text']
  }
})
</script>

<template>
  <Html lang="ru">
    <Body>
      <NaiveConfig :theme-config="themeConfig" :locale="defaultLang" :date-locale="defaultLangDate">
        <NGlobalStyle />
        <NNotificationProvider>
          <NMessageProvider placement="top">
            <NLoadingBarProvider>
              <NaiveLoadingBar navigation />
            </NLoadingBarProvider>
            <NuxtLayout>
              <NuxtPage />
            </NuxtLayout>
            <naive-notification />
          </NMessageProvider>
        </NNotificationProvider>
      </NaiveConfig>
    </Body>
  </Html>
</template>

<style>
body {
  font-family: "Golos Text", system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", sans-serif, "Apple Color Emoji", "Segoe UI Emoji", "Segoe UI Symbol" !important;
}
</style>
