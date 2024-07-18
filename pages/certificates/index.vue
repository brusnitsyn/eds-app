<script setup lang="ts">
import { definePageMeta } from '#imports'

const { data } = await useAsyncData('person', () => $fetch('/api/person/all'))

interface responseData {
  persons: (Person[])[]
}

interface Person {
  id: number
  fullName: string
  snils: string
  jobTitle: string
}

const columns = [
  {
    title: 'ID',
    key: 'id',
    width: 120
  },
  {
    title: 'ФИО',
    key: 'fullName'
  },
  {
    title: 'СНИЛС',
    key: 'snils'
  },
  {
    title: 'Должность',
    key: 'jobTitle',
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
  middleware: 'auth'
})
</script>

<template>
  <div>
    <div class="flex flex-row justify-between items-center">
      <h1 class="text-2xl font-bold pb-5">
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
