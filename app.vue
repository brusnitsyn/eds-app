<script lang="ts" setup>
import {ruRU, dateRuRU} from 'naive-ui'

const defaultLang = ruRU
const defaultLangDate = dateRuRU
</script>

<template>
  <Html lang="ru">
    <Body>
      <naive-config :locale="defaultLang" :date-locale="defaultLangDate">
        <NuxtLayout>
          <NuxtPage />
        </NuxtLayout>
      </naive-config>
    </Body>
  </Html>
</template>
