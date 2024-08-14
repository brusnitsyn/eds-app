<script lang="ts" setup>
import { dateRuRU, ruRU } from 'naive-ui'

const defaultLang = ruRU
const defaultLangDate = dateRuRU
</script>

<template>
  <Html lang="ru">
    <Body>
      <naive-config :locale="defaultLang" :date-locale="defaultLangDate">
        <n-notification-provider>
          <n-message-provider>
            <NuxtLayout>
              <NuxtPage />
            </NuxtLayout>
            <naive-notification />
          </n-message-provider>
        </n-notification-provider>
      </naive-config>
    </Body>
  </Html>
</template>
