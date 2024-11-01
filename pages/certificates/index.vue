<script setup lang="ts">
import { NButton } from 'naive-ui'
import { IconFileExcel, IconFileZip, IconLink, IconSearch, IconSquareRoundedPlus } from '@tabler/icons-vue'
import { definePageMeta } from '#imports'
import { AppLink } from '#components'
import {parse} from 'date-fns'

const staffPage = computed({
  get() {
    return useRoute().query.page ?? 1
  },
  set(page: number) {
    const query = {
      ...useRoute().query,
      page
    }
    useRouter().push({ name: useRoute().name, query })
  }
})

const selectSearchStaffOptions = [
  {
    label: 'ФИО',
    value: 'full_name'
  },
  {
    label: 'СНИЛС',
    value: 'snils'
  },
]

const selectedSearchStaffOption = computed({
  get() {
    return useRoute().query.search_from ? selectSearchStaffOptions.find(i => i.value === useRoute().query.search_from)?.value : selectSearchStaffOptions[0].value
  },
  set(search_from: string) {
    const query = {
      ...useRoute().query,
      search_from,
    }
    useRouter().push({ name: useRoute().name, query })
  }
})

const searchStaffValue = ref(useRoute().query.search_value ?? '')

const validType = computed({
  get() {
    return useRoute().query.valid_type ?? null
  },
  set(valid_type: string | null) {
    const query = {
      ...useRoute().query,
      page: 1,
      valid_type
    }
    useRouter().push({ name: useRoute().name, query })
  }
})

const currentQuery = computed(() => new URLSearchParams(useRoute().query).toString())

const { $api } = useNuxtApp()
const { data, refresh, status } = await useAsyncData('staff', () => $api(`/api/staff?${currentQuery.value}`), {
  watch: [staffPage, validType]
})

interface responseData {
  persons: (Person[])[]
}

interface Person {
  id: number
  full_name: string
  snils: string
  job_title: string
  cert_valid_to: number
}

const columns = ref([
  {
    type: 'selection',
  },
  {
    title: 'ID',
    key: 'id',
    width: 50,
  },
  {
    title: 'ФИО',
    key: 'full_name',
    width: 280,
    // sorter: 'default',
    render(row) {
      return h(
        AppLink,
        {
          to: { name: 'certificates-id', params: { id: row.id } },
        },
        {
          default: () => row.full_name,
        }
      )
    }
  },
  {
    title: 'СНИЛС',
    key: 'snils',
    width: 120,
    // sorter: 'default',
  },
  {
    title: 'Действует до',
    key: 'cert_valid_to',
    width: 120,
    // sortOrder: false,
    // sorter(rowA, rowB) {
    //   const dateA = parse(rowA.cert_valid_to, 'dd.MM.yyyy', new Date())
    //   const dateB = parse(rowB.cert_valid_to, 'dd.MM.yyyy', new Date())
    //   const rsl = dateA - dateB
    //   return rsl
    // }
  },
  {
    title: 'Должность',
    key: 'job_title',
    // sorter: 'default',
    ellipsis: {
      tooltip: true
    }
  },
  // {
  //   title: '',
  //   key: 'actions',
  //   width: 150,
  //   render(row) {
  //     return h(
  //       NButton,
  //       {
  //         tertiary: true,
  //         size: 'small',
  //         onClick: async () => {
  //           await navigateTo({ name: 'certificates-id', params: { id: row.id } })
  //         }
  //       },
  //       {
  //         default: () => 'Сертификат',
  //         icon: () => h(IconLink)
  //       }
  //     )
  //   }
  // }
])

/// TODO: параметр remote на таблице отключает сортировку. Сортировка требуется со стороны API
function handleSorterChange(sorter) {
  columns.value.forEach((column) => {
    if (column.sortOrder === undefined) { return }
    if (!sorter) {
      column.sortOrder = false
      return
    }
    if (column.key === sorter.columnKey) {
      column.sortOrder = sorter.order
    }
    else { column.sortOrder = false }
  })
}

function openEditPage(row) {
  return {
    style: 'cursor: pointer;',
    onClick: async () => {
      await navigateTo({ name: 'certificates-id', params: { id: row.id } })
    }
  }
}

const hasOpenMultiAddDialog = ref(false)
function openDialog() {
  hasOpenMultiAddDialog.value = true
}

const pagination = computed(() => {
  return {
    page: data.value.meta.current_page,
    pageSize: data.value.meta.per_page,
    pageCount: data.value.meta.last_page,
    itemCount: data.value.meta.total,
    onChange: (page: number) => {
      staffPage.value = page
      pagination.value.page = page
    },
    prefix({ itemCount }) {
      return `Кол-во сертификатов: ${itemCount}.`
    }
  }
})

async function searchStaff() {
  if (searchStaffValue.value.length === 0) {
    const query = {
      ...useRoute().query,
      page: 1,
    }
    await useRouter().push({ name: useRoute().name, query })
  }
  const query = {
    ...useRoute().query,
    search_value: searchStaffValue.value,
    search_from: selectedSearchStaffOption.value
  }
  await useRouter().push({ name: useRoute().name, query })

  await refresh()
}

function stylingRow(row: RowData) {
  if (row.has_valid === false) { return 'has-no-valid' }
  if (row.has_request_new === true) { return 'has-request' }
  return ''
}

function rowKey(row) {
  return row.id
}

const checkedRows = ref([])

function handleCheck(rowKeys) {
  checkedRows.value = rowKeys
}

async function downloadCert() {
  if (checkedRows.value.length) {
    status.value = 'pending'

    const { data: downloadData, status: downloadStatus } = await useAPI('/api/certificate/download', {
      method: 'POST',
      body: {
        staff_ids: checkedRows.value
      }
    })

    if (downloadStatus.value === 'success') {
      const file = window.URL.createObjectURL(downloadData.value)
      window.location.assign(file)
    }

    status.value = downloadStatus.value
  }
}

async function downloadExcel() {
  status.value = 'pending'

  const { data: downloadData, status: downloadStatus } = await useAPI('/api/staff/export', {
    method: 'GET',
    query: {
      valid_type: useRoute().query.valid_type ?? null
    }
  })

  if (downloadStatus.value === 'success') {
    const file = window.URL.createObjectURL(downloadData.value)
    window.location.assign(file)
  }

  status.value = downloadStatus.value
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
      <NSpace>
        <NButton secondary :loading="status === 'pending'" @click="downloadExcel">
          <template #icon>
            <IconFileExcel />
          </template>
          Экспортировать
        </NButton>
        <NButton type="primary" @click="openDialog">
          <template #icon>
            <IconSquareRoundedPlus />
          </template>
          Добавить
        </NButton>
      </NSpace>
    </div>

    <NSpace vertical>
      <NSpace vertical>
        <NFlex justify="space-between" align="center">
          <n-radio-group v-model:value="validType" :disabled="status === 'pending'">
            <n-radio-button label="Все" :value="null" />
            <n-radio-button label="Требующие перевыпуск" value="new-request" />
            <n-radio-button label="Истекшие" value="no-valid" />
          </n-radio-group>

          <NButton v-if="checkedRows.length" secondary :disabled="status === 'pending'" @click="downloadCert">
            <template #icon>
              <IconFileZip />
            </template>
            Скачать
          </NButton>
        </NFlex>
        <n-input-group>
          <n-select v-model:value="selectedSearchStaffOption" :disabled="status === 'pending'" size="large" :style="{ width: '33%' }" :options="selectSearchStaffOptions" placeholder="Искать по" />
          <n-input v-model:value="searchStaffValue" :disabled="status === 'pending'" size="large" placeholder="Значение поиска" @keydown.enter.prevent="searchStaff" />
          <NButton :disabled="status === 'pending'" size="large" @click="searchStaff">
            <template #icon>
              <IconSearch />
            </template>
          </NButton>
        </n-input-group>
      </NSpace>

      <n-data-table
        remote
        :pagination="pagination"
        :loading="status === 'pending'"
        :row-class-name="stylingRow"
        :row-key="rowKey"
        :max-height="600"
        :columns="columns" :data="(data as responseData).data.persons"
        :bordered="true" @update:sorter="handleSorterChange"
        @update:checked-row-keys="handleCheck"
      />
    </NSpace>
  </div>
  <ModalsAddManyCertificates :open="hasOpenMultiAddDialog" :refresh="refresh" @update:open="value => hasOpenMultiAddDialog = value" />
</template>

<style scoped>
:deep(.has-request td) {
  @apply !bg-[#FDA52C]/40;
}
:deep(.has-no-valid td) {
  @apply !bg-[#FF0000]/40;
}
</style>
