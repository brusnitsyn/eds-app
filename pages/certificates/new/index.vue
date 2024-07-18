<script setup lang="ts">
import { IconUpload } from '@tabler/icons-vue'
import type { UploadCustomRequestOptions, UploadFileInfo } from 'naive-ui'

definePageMeta({
  middleware: 'auth'
})

const data = ref({
  cert: {
    create: {
      serialNumber: '',
      validFrom: null,
      validTo: null,
    }
  },
  snils: '',
  inn: '',
  firstName: '',
  surName: '',
  lastName: '',
  dob: null,
  sex: 'slava',
  jobTitle: '',
  tel: null
})

function handleFinish({ file, event }: {
  file: UploadFileInfo
  event?: ProgressEvent
}) {
  if (!event?.target) { return }

  const responseData = JSON.parse(event?.target.response)

  data.value = { ...data.value, ...responseData }
}

async function onSubmit() {
  const { data: responseData } = await useFetch('/api/person/store', {
    method: 'post',
    body: data.value
  })
  if (responseData.value) { await useRouter().go(-1) }
}
</script>

<template>
  <div>
    <div class="flex flex-row justify-between items-center pb-5">
      <h1 class="text-2xl font-bold">
        Добавить сертификат
      </h1>
      <n-button type="primary" @click="onSubmit">
        Сохранить
      </n-button>
    </div>

    <n-upload
      directory-dnd
      action="/api/cert/transform"
      :show-file-list="false"
      @finish="handleFinish"
    >
      <n-upload-dragger>
        <div style="margin-bottom: 12px">
          <n-icon size="48" :depth="3">
            <IconUpload />
          </n-icon>
        </div>
        <n-text style="font-size: 16px">
          Нажмите или перетащите файл в эту область, чтобы загрузить
        </n-text>
        <n-p depth="3" style="margin: 8px 0 0 0">
          Поддерживаемые форматы: .cer
        </n-p>
      </n-upload-dragger>
    </n-upload>

    <n-form
      ref="formRef"
      :label-width="80"
      :model="data"
      class="pt-4"
    >
      <n-form-item label="Серийный номер сертификата" path="cert.create.serialNumber">
        <n-input v-model:value="data.cert.create.serialNumber" placeholder="Серийный номер сертификата" disabled />
      </n-form-item>

      <div class="grid grid-cols-2 gap-4 w-full">
        <n-form-item label="Дата выпуска" path="cert.create.validFrom">
          <n-date-picker v-model:value="data.cert.create.validFrom" type="datetime" placeholder="Дата выпуска" class="w-full" clearable disabled />
        </n-form-item>
        <n-form-item label="Дата окончания" path="cert.create.validTo">
          <n-date-picker v-model:value="data.cert.create.validTo" type="datetime" placeholder="Дата окончания" class="w-full" clearable disabled />
        </n-form-item>
      </div>

      <div class="grid grid-cols-2 gap-4 w-full">
        <n-form-item label="СНИЛС" path="snils">
          <n-input v-model:value="data.snils" placeholder="СНИЛС" clearable />
        </n-form-item>
        <n-form-item label="ИНН" path="inn">
          <n-input v-model:value="data.inn" placeholder="ИНН" clearable />
        </n-form-item>
      </div>

      <div class="grid grid-cols-2 gap-4 w-full">
        <n-form-item label="Должность" path="jobTitle">
          <n-input v-model:value="data.jobTitle" placeholder="Должность" clearable />
        </n-form-item>
        <n-form-item label="Структурное подразделение" path="jobTitle">
          <n-input v-model:value="data.jobTitle" placeholder="Структурное подразделение" clearable />
        </n-form-item>
      </div>

      <div class="grid grid-cols-3 gap-4 w-full">
        <n-form-item label="Фамилия" path="lastName">
          <n-input v-model:value="data.lastName" placeholder="Фамилия" clearable />
        </n-form-item>
        <n-form-item label="Имя" path="firstName">
          <n-input v-model:value="data.firstName" placeholder="Имя" clearable />
        </n-form-item>
        <n-form-item label="Отчество" path="surName">
          <n-input v-model:value="data.surName" placeholder="Отчество" clearable />
        </n-form-item>
      </div>

      <div class="grid grid-cols-3 gap-4 w-full">
        <n-form-item label="Пол" path="sex">
          <n-radio-group v-model:value="data.sex">
            <n-radio-button
              value="slava"
              label="Мужской"
            />
            <n-radio-button
              value="liza"
              label="Женский"
            />
          </n-radio-group>
        </n-form-item>
        <n-form-item label="Дата рождения" path="dob">
          <n-date-picker v-model:value="data.dob" :actions="null" type="date" placeholder="Дата рождения" class="w-full" clearable />
        </n-form-item>
        <n-form-item label="Номер телефона" path="tel">
          <n-input v-model:value="data.tel" placeholder="Номер телефона" clearable />
        </n-form-item>
      </div>
    </n-form>
  </div>
</template>

<style scoped>

</style>
