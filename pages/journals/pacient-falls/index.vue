<script setup lang="ts">
import { NButton } from 'naive-ui'
import { IconSearch, IconSquareRoundedPlus } from '@tabler/icons-vue'

const fallPage = computed({
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
  // {
  //   label: 'СНИЛС',
  //   value: 'snils'
  // },
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

const currentQuery = computed(() => new URLSearchParams(useRoute().query).toString())

const { $api } = useNuxtApp()
const { data, refresh, status } = await useAsyncData('staff', () => $api(`/api/journal/fall?${currentQuery.value}`), {
  watch: [fallPage]
})

interface responseData {
  events: (PacientFallEvent[])[]
}

interface PacientFallEvent {
  id: number
  full_name: string
  reason: string
  place: string
  held_event: string
  consequence: string
  division_name: string
}

const columns = [
  {
    type: 'selection'
  },
  {
    title: 'ID',
    key: 'id',
    width: 50
  },
  {
    title: 'ФИО',
    key: 'full_name',
    width: 240,
  },
  {
    title: 'Причина падения',
    key: 'reason',
    width: 180
  },
  {
    title: 'Место падения',
    key: 'place',
    width: 180
  },
  {
    title: 'Проведено мероприятие',
    key: 'held_event',
    ellipsis: {
      tooltip: true
    }
  },
  {
    title: 'Последствие',
    key: 'consequence',
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
]

function openEditPage(row) {
  return {
    style: 'cursor: pointer;',
    onClick: async () => {
      await navigateTo({ name: 'certificates-id', params: { id: row.id } })
    }
  }
}

const hasOpenAddDialog = ref(false)
function openDialog() {
  hasOpenAddDialog.value = true
}

const pagination = computed(() => {
  return {
    page: data.value.meta?.current_page,
    pageSize: data.value.meta?.per_page,
    pageCount: data.value.meta?.last_page,
    itemCount: data.value.meta?.total,
    onChange: (page: number) => {
      staffPage.value = page
      pagination.value.page = page
    },
    prefix({ itemCount }) {
      return `Кол-во случаев: ${itemCount}.`
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

function addEvent(value: PacientFallEvent) {
  data.value.data.events.push(value)
  data.value.meta.total++
}
</script>

<template>
  <div>
    <div class="flex flex-row justify-between items-center pb-5">
      <h1 class="text-2xl font-bold">
        Регистрация падений пациентов и посетителей
      </h1>
      <NButton type="primary" @click="openDialog">
        <template #icon>
          <IconSquareRoundedPlus />
        </template>
        Добавить событие
      </NButton>
    </div>

    <NSpace vertical>
      <NSpace vertical>
        <!--        <NFlex justify="space-between" align="center"> -->
        <!--          <n-radio-group v-model:value="validType" :disabled="status === 'pending'"> -->
        <!--            <n-radio-button label="Все" :value="null" /> -->
        <!--            <n-radio-button label="Требующие перевыпуск" value="new-request" /> -->
        <!--            <n-radio-button label="Истекшие" value="no-valid" /> -->
        <!--          </n-radio-group> -->

        <!--          <NButton v-if="checkedRows.length" secondary :disabled="status === 'pending'" @click="downloadCert"> -->
        <!--            <template #icon> -->
        <!--              <IconFileZip /> -->
        <!--            </template> -->
        <!--            Скачать -->
        <!--          </NButton> -->
        <!--        </NFlex> -->
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
        :max-height="600" :columns="columns"
        :data="(data as responseData).data.events" :bordered="true"
        @update:checked-row-keys="handleCheck"
      />
    </NSpace>
  </div>

  <LazyModalsAddPacientFallEvent :open="hasOpenAddDialog" :refresh="refresh" @created:value="(value) => addEvent(value)" @update:open="value => hasOpenAddDialog = value" />
</template>

<style scoped>

</style>
