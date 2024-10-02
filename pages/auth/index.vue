<script setup lang="ts">
import type { FormValidationError } from 'naive-ui'

const formRef = ref()
const loading = ref(false)

const model = ref({
  login: '',
  password: '',
})

const rules = {
  login: {
    required: true,
    trigger: ['blur', 'input'],
    message: 'Введите логин'
  },
  password: {
    required: true,
    trigger: ['blur', 'input'],
    message: 'Введите пароль'
  }
}

const { login, refreshUser } = useSanctumAuth()
const { redirect } = useSanctumConfig()
async function validateForm(e) {
  e.preventDefault()
  formRef.value?.validate(
    async (errors: Array<FormValidationError> | undefined) => {
      if (!errors) {
        loading.value = true
        const result = await login({
          login: model.value.login,
          password: model.value.password
        })

        if (result) {
          await navigateTo(redirect.onLogin, { replace: true })
          loading.value = false
        }
      }
      else {
        /// TODO: add message send
      }
    }
  )
}

definePageMeta({
  layout: 'centered',
  middleware: 'sanctum-guest'
})
</script>

<template>
  <NCard class="max-w-sm">
    <NTabs
      class="card-tabs"
      default-value="signin"
      size="large"
      animated
      pane-wrapper-style="margin: 0 -4px"
      pane-style="padding-left: 4px; padding-right: 4px; box-sizing: border-box;"
    >
      <NTabPane name="signin" tab="Авторизация">
        <NForm ref="formRef" :model="model" :rules="rules" class="pb-2" @submit.prevent="validateForm" :disabled="loading">
          <NFormItem path="login" label="Имя пользователя">
            <NInput id="login" v-model:value="model.login" type="text" placeholder="abrusnitsyn" @keydown.enter.prevent="validateForm" />
          </NFormItem>
          <NFormItem path="password" label="Пароль">
            <NInput id="password" v-model:value="model.password" show-password-on="click" type="password" placeholder="••••••" @keydown.enter.prevent="validateForm" />
          </NFormItem>

          <NButton attr-type="submit" type="primary" block strong @click="validateForm" :loading="loading">
            Войти
          </NButton>
        </NForm>
      </NTabPane>
    </NTabs>
  </NCard>
</template>

<style scoped>

</style>
