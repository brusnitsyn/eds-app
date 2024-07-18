<script lang="ts" setup>
import { IconUpload } from '@tabler/icons-vue'

const { $client } = useNuxtApp()

const id = Number.parseInt(useRoute().params.id as string)

const userModel = await $client.getUser.useQuery({ id })

const formatDate = 'dd.MM.yyyy'

const disableForm = ref(false)

const data = ref({
  ...userModel.data.value
})

function handleFinish({ file, event }: {
  file: UploadFileInfo
  event?: ProgressEvent
}) {
  if (!event?.target) { return }

  const responseData = JSON.parse(event?.target.response)

  data.value = { ...data.value, ...responseData }
  data.value.cert = { ...responseData.cert.create }
}

async function onSubmit() {
  const { data: responseData } = await useFetch('/api/person/edit', {
    method: 'post',
    body: data.value
  })
  if (responseData.value) { await useRouter().go(-1) }
}

definePageMeta({
  middleware: 'auth'
})
</script>

<template>
  <div>
    <div class="flex flex-row justify-between items-center pb-5">
      <h1 class="text-2xl font-bold">
        {{ userModel?.data.value?.fullName }}
      </h1>
      <n-form-item label="Редактирование" label-placement="left" :show-feedback="false">
        <n-switch v-model:value="disableForm" />
      </n-form-item>
    </div>
  </div>

  <n-upload v-if="disableForm" directory-dnd action="/api/cert/transform" :show-file-list="false" @finish="handleFinish">
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

  <ValidateCert v-else :cert="{ validTo: data.cert.validTo!, hasValid: data.cert?.hasValid, hasRequestNew: data.cert?.hasRequestNew }" />

  <n-form ref="formRef" :label-width="80" :model="data" class="pt-4" :disabled="!disableForm">
    <n-form-item label="Серийный номер сертификата" path="cert.serialNumber">
      <n-input v-model:value="data.cert.serialNumber" placeholder="Серийный номер сертификата" disabled />
    </n-form-item>

    <div class="grid grid-cols-2 gap-4 w-full">
      <n-form-item label="Дата выпуска" path="cert.validFrom">
        <n-date-picker
          v-model:value="data.cert.validFrom" type="datetime" placeholder="Дата выпуска" class="w-full"
          :format="formatDate"
          clearable disabled
        />
      </n-form-item>
      <n-form-item label="Дата окончания" path="cert.validTo">
        <n-date-picker
          v-model:value="data.cert.validTo" type="datetime" placeholder="Дата окончания" class="w-full"
          :format="formatDate"
          clearable disabled
        />
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
          <n-radio-button value="slava" label="Мужской" />
          <n-radio-button value="liza" label="Женский" />
        </n-radio-group>
      </n-form-item>
      <n-form-item label="Дата рождения" path="dob">
        <n-date-picker
          v-model:value="data.dob" :actions="null" type="date" placeholder="Дата рождения"
          :format="formatDate"
          class="w-full" clearable
        />
      </n-form-item>
      <n-form-item label="Номер телефона" path="tel">
        <n-input v-model:value="data.tel" placeholder="Номер телефона" clearable />
      </n-form-item>
    </div>
  </n-form>

  <n-flex v-if="disableForm" justify="center" class="mt-4">
    <n-button class="px-6" type="primary" @click="onSubmit">
      Сохранить
    </n-button>
  </n-flex>
</template>
