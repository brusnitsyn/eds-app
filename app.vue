<script lang="ts" setup>
import { dateRuRU, ruRU } from 'naive-ui'

const defaultLang = ruRU
const defaultLangDate = dateRuRU
</script>

<template>
  <Html lang="ru">
    <Body>
      <NaiveConfig :locale="defaultLang" :date-locale="defaultLangDate">
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
