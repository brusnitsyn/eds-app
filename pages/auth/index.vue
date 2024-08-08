<script setup lang="ts">
import type {FormValidationError} from "naive-ui";

const formRef = ref()

const model = ref({
  login: "",
  password: "",
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

const { signIn } = useAuth()
const validateForm = (e: MouseEvent) => {
  e.preventDefault()
  formRef.value?.validate(
      async (errors: Array<FormValidationError> | undefined) => {
        if (!errors) {
          signIn('credentials', {callbackUrl: '/', login: model.value.login, password: model.value.password})
        } else {
          /// TODO: add message send
        }
      }
  )
}

definePageMeta({
  layout: "centered",
  auth: { middleware: "guest-only", unauthenticatedOnly: true, navigateAuthenticatedTo: '/'}
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
        <NForm ref="formRef" :model="model" :rules="rules">
          <NFormItem path="login" label="Имя пользователя">
            <NInput v-model:value="model.login" type="text" id="login" placeholder="abrusnitsyn" @keydown.enter.prevent />
          </NFormItem>
          <NFormItem path="password" label="Пароль">
            <NInput v-model:value="model.password" show-password-on="click" type="password" id="password" placeholder="••••••" @keydown.enter.prevent />
          </NFormItem>
        </NForm>
        <NButton attr-type="submit" type="primary" block secondary strong @click="validateForm">
          Войти
        </NButton>
      </NTabPane>
    </NTabs>
  </NCard>
</template>

<style scoped>

</style>
