<script setup lang="ts">
import { definePageMeta } from '#imports'
import type {int} from "@es-joy/jsdoccomment";

const { client } = useSanctumFetch()
const { data, refresh } = await useAsyncData('staff', () => client('/api/staff'))

interface responseData {
  persons: (Person[])[]
}

interface Person {
  id: number
  full_name: string
  snils: string
  job_title: string
  cert_valid_to: int
}

const columns = [
  {
    title: 'ID',
    key: 'id',
    width: 50
  },
  {
    title: 'ФИО',
    key: 'full_name',
    width: 280
  },
  {
    title: 'СНИЛС',
    key: 'snils',
    width: 120
  },
  {
    title: 'Действует до',
    key: 'cert_valid_to',
    width: 120
  },
  {
    title: 'Должность',
    key: 'job_title',
    ellipsis: {
      tooltip: true
    }
  }
]

function handleAddClick() {
  navigateTo({ name: 'certificates-new' })
}

function openEditPage(row) {
  return {
    style: 'cursor: pointer;',
    onClick: async () => {
      await navigateTo({ name: 'certificates-id', params: { id: row.id } })
    }
  }
}

const addOptions = [
  {
    label: 'Пакет сертификатов',
    key: 'add-multi',
  },
  {
    label: 'Один сертификат',
    key: 'add-single',
  },
]
const hasOpenMultiAddDialog = ref(false)
const openDialog = () => {
  hasOpenMultiAddDialog.value = true
}
// const handleSelect = (key: string | number) => {
//   switch (key) {
//     case 'add-multi':
//       hasOpenMultiAddDialog.value = true
//       break
//     case 'add-single':
//       useRouter().push({ name: 'certificates-new' })
//       break
//   }
// }

definePageMeta({
  middleware: 'sanctum-auth'
})
</script>

<template>
  <div>
    <div class="flex flex-row justify-between items-center pb-5">
      <h1 class="text-2xl font-bold">
        Сертификаты
      </h1>
      <NButton type="primary" @click="openDialog">
        Добавить
      </NButton>
    </div>
    <n-data-table
      striped :max-height="500" :row-props="openEditPage" :columns="columns"
      :data="(data as responseData).persons" :bordered="true"
    />
  </div>
  <ModalsAddManyCertificates :open="hasOpenMultiAddDialog" :refresh="refresh" @update:open="value => hasOpenMultiAddDialog = value" />
</template>

<style scoped></style>
