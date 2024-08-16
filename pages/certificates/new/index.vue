<script setup lang="ts">
import { IconUpload } from '@tabler/icons-vue'
import type { UploadCustomRequestOptions, UploadFileInfo } from 'naive-ui'
import { useSanctumFetch } from '../../../composables/useSanctumFetch'

definePageMeta({
  middleware: 'sanctum-auth'
})

const config = useRuntimeConfig()
const message = useMessage()
const { client } = useSanctumFetch()

const { data: divisions } = await useAsyncData('division', () => client('/api/division'))

const formatedDivisions = divisions.value.divisions.map(item => ({
  ...item,
  value: item.id
}))

const model = ref({
  cert: {
    serial_number: '',
    valid_from: null,
    valid_to: null,
  },
  snils: '',
  inn: '',
  first_name: '',
  middle_name: '',
  last_name: '',
  dob: null,
  gender: 'slava',
  job_title: '',
  tel: null,
  division_id: null
})

function handleFinish({ file, event }: {
  file: UploadFileInfo
  event?: ProgressEvent
}) {
  if (!event?.target) { return }

  const responseData = JSON.parse(event?.target.response)

  model.value = { ...model.value, ...responseData }
}

async function customRequest({
  file,
  data,
}: UploadCustomRequestOptions) {
  const formData = new FormData()
  if (data) {
    Object.keys(data).forEach((key) => {
      formData.append(
        key,
        data[key as keyof UploadCustomRequestOptions['data']]
      )
    })
  }
  formData.append('certificate', file.file as File)
  const response = await useSanctumFetch('/api/certificate/read', {
    method: 'POST',
    body: formData
  })
  model.value = { ...model.value, ...response }
}

async function onSubmit() {
  const response = await useSanctumFetch(`/api/staff`, {
    method: 'post',
    body: model.value
  })
  console.log(response)
  if (response.status === 'ok') {
    message.success(response.message, {
      keepAliveOnHover: true
    })
    await useRouter().go(-1)
  }
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
      :show-file-list="false"
      :custom-request="customRequest"
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
      :model="model"
      class="pt-4"
    >
      <n-form-item label="Серийный номер сертификата" path="cert.serial_number">
        <n-input v-model:value="model.cert.serial_number" placeholder="Серийный номер сертификата" disabled />
      </n-form-item>

      <div class="grid grid-cols-2 gap-4 w-full">
        <n-form-item label="Дата выпуска" path="cert.valid_from">
          <n-date-picker v-model:value="model.cert.valid_from" type="datetime" placeholder="Дата выпуска" class="w-full" clearable disabled />
        </n-form-item>
        <n-form-item label="Дата окончания" path="cert.valid_to">
          <n-date-picker v-model:value="model.cert.valid_to" type="datetime" placeholder="Дата окончания" class="w-full" clearable disabled />
        </n-form-item>
      </div>

      <div class="grid grid-cols-2 gap-4 w-full">
        <n-form-item label="СНИЛС" path="snils">
          <n-input v-model:value="model.snils" placeholder="СНИЛС" clearable />
        </n-form-item>
        <n-form-item label="ИНН" path="inn">
          <n-input v-model:value="model.inn" placeholder="ИНН" clearable />
        </n-form-item>
      </div>

      <div class="grid grid-cols-2 gap-4 w-full">
        <n-form-item label="Должность" path="job_title">
          <n-input v-model:value="model.job_title" placeholder="Должность" clearable />
        </n-form-item>
        <n-form-item label="Структурное подразделение" path="division_id">
          <n-select
            v-model:value="model.division_id"
            filterable
            placeholder="Структурное подразделение"
            :options="formatedDivisions"
          />
        </n-form-item>
      </div>

      <div class="grid grid-cols-3 gap-4 w-full">
        <n-form-item label="Фамилия" path="last_name">
          <n-input v-model:value="model.last_name" placeholder="Фамилия" clearable />
        </n-form-item>
        <n-form-item label="Имя" path="first_name">
          <n-input v-model:value="model.first_name" placeholder="Имя" clearable />
        </n-form-item>
        <n-form-item label="Отчество" path="middle_name">
          <n-input v-model:value="model.middle_name" placeholder="Отчество" clearable />
        </n-form-item>
      </div>

      <div class="grid grid-cols-3 gap-4 w-full">
        <n-form-item label="Пол" path="gender">
          <n-radio-group v-model:value="model.gender">
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
          <n-date-picker v-model:value="model.dob" :actions="null" type="date" placeholder="Дата рождения" class="w-full" clearable />
        </n-form-item>
        <n-form-item label="Номер телефона" path="tel">
          <n-input v-model:value="model.tel" placeholder="Номер телефона" clearable />
        </n-form-item>
      </div>
    </n-form>
  </div>
</template>

<style scoped>

</style>
