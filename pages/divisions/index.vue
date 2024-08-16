<script setup lang="ts">
import { definePageMeta } from '#imports'

const { data } = await useSanctumFetch('/api/division', { server: true })

interface responseData {
  divisions: (Division[])[]
}

interface Division {
  id: number
  label: string
}

const columns = [
  {
    title: 'ID',
    key: 'id',
    width: 120
  },
  {
    title: 'label',
    key: 'label',
    ellipsis: {
      tooltip: true
    }
  },
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
        Подразделения
      </h1>
      <n-button type="primary" @click="handleAddClick">
        Добавить
      </n-button>
    </div>
    <n-data-table
      striped :max-height="500" :row-props="openEditPage" :columns="columns"
      :data="(data as responseData).divisions" :bordered="true"
    />
  </div>
</template>

<style scoped></style>
