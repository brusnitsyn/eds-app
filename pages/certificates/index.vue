<script setup lang="ts">
import { definePageMeta } from '#imports'

const { client } = useSanctumFetch()
const { data } = await useAsyncData('staff', () => client('/api/staff'))

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
    width: 120
  },
  {
    title: 'ФИО',
    key: 'full_name'
  },
  {
    title: 'СНИЛС',
    key: 'snils'
  },
  {
    title: 'Действует до',
    key: 'cert_valid_to'
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
      <n-button type="primary" @click="handleAddClick">
        Добавить
      </n-button>
    </div>
    <n-data-table
      striped :max-height="500" :row-props="openEditPage" :columns="columns"
      :data="(data as responseData).persons" :bordered="true"
    />
  </div>
</template>

<style scoped></style>
