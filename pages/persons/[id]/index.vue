<script lang="ts" setup>
import {
  IconAlertCircleFilled,
  IconChevronLeft,
  IconCopy,
  IconDatabaseImport,
  IconEdit,
  IconExternalLink,
  IconFileZip,
  IconProgressCheck,
  IconSquareRoundedPlus,
  IconTrash
} from '@tabler/icons-vue'
import { format, toDate } from 'date-fns'
import { NIcon } from 'naive-ui'

const config = useRuntimeConfig()
const message = useMessage()
const { $api } = useNuxtApp()

const id = Number.parseInt(useRoute().params.id as string)

// const userModel = await $client.getUser.useQuery({ id })

const { data: staff, refresh } = await useAsyncData(`staff-id`, () => $api(`/api/staff/${id}`))

const { data: divisions } = await useAsyncData('divisions', () => $api(`/api/division`))

const formatedDivisions = divisions.value.divisions.map(item => ({
  ...item,
  value: item.id
}))

const formatDate = 'dd.MM.yyyy'

const disableForm = ref(false)

const model = ref({
  ...staff.value
})

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
  const { data: responseData } = await useAPI('/api/certificate/read', {
    method: 'POST',
    body: formData
  })
  model.value = responseData.value
}

async function onSubmit() {
  const { status } = await useAPI(`/api/staff/${id}`, {
    method: 'POST',
    body: model.value
  })
  if (status.value === 'success') {
    message.success(response.message, {
      keepAliveOnHover: true
    })
    await useRouter().go(-1)
  }
}

const hasAlerNewRequest = ref(false)
const hasAlerNoValid = ref(false)
const hasAlerValid = ref(false)

if (staff.value.cert.has_valid && !staff.value.cert.has_request_new) {
  hasAlerValid.value = true
}
else if (!staff.value.cert.has_valid && !staff.value.cert.has_request_new) {
  hasAlerNoValid.value = true
}
else if (staff.value.cert.has_valid && staff.value.cert.has_request_new) {
  hasAlerNewRequest.value = true
}

const showAddStaffIntegrate = ref(false)
const showEditStaffIntegrate = ref(false)
const showEdit = ref(false)

async function removeIntegrate(staffId: number, integrateId: number) {
  const { status } = await useAPI(`/api/staff/${staffId}/integrate/${integrateId}`, {
    method: 'DELETE',
  })

  if (status.value === 'success') {
    const sliceIntegrationId = staff.value.integrations.findIndex(item => item.id === integrateId)
    staff.value.integrations.splice(sliceIntegrationId, 1)
  }
}

async function installCert() {
  const { status } = await useAPI(`/api/staff/${staff.value.id}/mis/set`)
  if (status.value === 'success') { await refresh() }
}

const editIntegrate = ref(null)

function handleEdit(integrate) {
  editIntegrate.value = integrate
  showEditStaffIntegrate.value = true
}

function updateIntegrate(value) {
  const updatedIntegration = staff.value.integrations.find(item => item.id === value.id)
  updatedIntegration.value = value
}

function copyIntegratedValue(value) {
  navigator.clipboard.writeText(value)
  message.success('Значение скопировано в буфер обмена', {
    icon: () => h(NIcon, null, { default: () => h(IconCopy) })
  })
}

async function syncMis() {
  const { status } = await useAPI(`/api/staff/${staff.value.id}/sync`)
}

async function downloadCert() {
  const { data: downloadData, status: downloadStatus } = await useAPI('/api/certificate/download', {
    method: 'POST',
    body: {
      staff_ids: [staff.value.id]
    }
  })

  if (downloadStatus.value === 'success') {
    const file = window.URL.createObjectURL(downloadData.value)
    window.location.assign(file)
  }
}

definePageMeta({
  middleware: 'sanctum-auth'
})
</script>

<template>
  <NGrid :cols="5" :x-gap="16">
    <NGi span="3">
      <NSpace vertical class="max-w-3xl">
        <NCard class="relative">
          <NFlex class="absolute top-4 right-4">
            <NTag v-if="staff.mis_user_id != null" type="info" round>
              ТМ:МИС {{ format(new Date(staff.mis_sync_at), 'dd.MM.yyyy') }} в {{ format(new Date(staff.mis_sync_at), 'HH:mm') }}
              <template #icon>
                <NIcon :component="IconProgressCheck" :size="20" />
              </template>
            </NTag>
          </NFlex>
          <NButton class="absolute top-2 left-0 -translate-x-1/2" :style="{ border: '1px', borderColor: useThemeVars().value.borderColor, borderStyle: 'solid' }" :color="useThemeVars().value.cardColor" :text-color="useThemeVars().value.textColor3" circle @click="useRouter().back()">
            <template #icon>
              <NIcon :component="IconChevronLeft" />
            </template>
          </NButton>
          <NAvatar round :size="120" class="font-bold text-3xl">
            {{ staff.last_name[0] }}{{ staff.first_name[0] }}
          </NAvatar>
          <template #action>
            <NFlex justify="space-between" align="center">
              <NText class="text-lg font-bold">
                {{ staff.full_name }}
              </NText>

              <NText v-if="staff.mis_user_id">
                #{{ staff.mis_user_id }}
              </NText>
            </NFlex>
          </template>
        </NCard>

        <NAlert v-if="hasAlerValid" title="Сертификат действителен" type="success" />
        <NAlert v-if="hasAlerNewRequest" title="Срок действия сертификата подходит к концу" type="warning" />
        <NAlert v-if="hasAlerNoValid" title="Сертификат не действителен" type="error" />

        <NCard title="Общая информация">
          <!--          <template #header-extra> -->
          <!--            <NButton text @click="showEdit = true"> -->
          <!--              <template #icon> -->
          <!--                <IconEdit /> -->
          <!--              </template> -->
          <!--              Изменить -->
          <!--            </NButton> -->
          <!--          </template> -->
          <NList hoverable>
            <NListItem>
              <template v-if="staff.inn" #suffix>
                <AppCopyButton :value="staff.inn" />
              </template>
              <NGrid :cols="2">
                <NGi><NText>ИНН</NText></NGi>
                <NGi><NText>{{ staff.inn }}</NText></NGi>
              </NGrid>
            </NListItem>
            <NListItem>
              <template v-if="staff.snils" #suffix>
                <AppCopyButton :value="staff.snils" />
              </template>
              <NGrid :cols="2">
                <NGi><NText>СНИЛС</NText></NGi>
                <NGi><NText>{{ staff.snils }}</NText></NGi>
              </NGrid>
            </NListItem>
            <NListItem>
              <template v-if="staff.job_title" #suffix>
                <AppCopyButton :value="staff.job_title" />
              </template>
              <NGrid :cols="2">
                <NGi><NText>Должность</NText></NGi>
                <NGi><NEllipsis>{{ staff.job_title }}</NEllipsis></NGi>
              </NGrid>
            </NListItem>
            <NListItem>
              <template v-if="staff.division" #suffix>
                <AppCopyButton :value="staff.division" />
              </template>
              <NGrid :cols="2">
                <NGi><NText>Подразделение</NText></NGi>
                <NGi><NText>{{ staff.division }}</NText></NGi>
              </NGrid>
            </NListItem>
          </NList>
        </NCard>

        <NCard title="Сведения о сертификате">
          <template #header-extra>
            <NSpace>
              <NButton text @click="downloadCert">
                <template #icon>
                  <IconFileZip />
                </template>
                Скачать
              </NButton>
              <NButton v-if="staff.cert.has_mis_identical === false && staff.mis_user_id != null" text @click="installCert">
                <template #icon>
                  <IconDatabaseImport />
                </template>
                Установить в ТМ:МИС
              </NButton>
            </NSpace>
          </template>
          <NList hoverable>
            <NListItem>
              <template #suffix>
                <AppCopyButton :value="staff.cert.serial_number" />
              </template>
              <NGrid :cols="2" class="flex items-center">
                <NGi>
                  <NText class="font-bold">
                    {{ staff.cert.serial_number }}
                  </NText>
                </NGi>
                <NGi v-if="staff.cert.has_mis_identical === false && staff.mis_user_id != null">
                  <NTag type="warning" round class="-ml-6">
                    <div class="!text-sm">
                      Сертификат отличается
                    </div>
                    <template #icon>
                      <NIcon :component="IconAlertCircleFilled" :size="20" />
                    </template>
                  </NTag>
                </NGi>
              </NGrid>
            </NListItem>
            <NListItem>
              <NGrid :cols="2">
                <NGi><NText>Действителен с</NText></NGi>
                <NGi><NText>{{ format(toDate(staff.cert.valid_from), 'dd.MM.yyyy') }}</NText></NGi>
              </NGrid>
            </NListItem>
            <NListItem>
              <NGrid :cols="2">
                <NGi><NText>Действителен по</NText></NGi>
                <NGi><NText>{{ format(toDate(staff.cert.valid_to), 'dd.MM.yyyy') }}</NText></NGi>
              </NGrid>
            </NListItem>
            <NListItem>
              <NGrid :cols="2">
                <NGi><NText>Срок действия закрытого ключа</NText></NGi>
                <NGi>
                  <NText class="blur select-none">
                    00.00.0000
                  </NText>

                  <NTag round :bordered="false" class="ml-4">
                    <div class="!text-sm">
                      Совсем скоро
                    </div>
                  </NTag>
                </NGi>
              </NGrid>
            </NListItem>
          </NList>
        </NCard>
      </NSpace>
    </NGi>
    <NGi span="2">
      <NCard title="Учетные записи">
        <template #header-extra>
          <NButton text @click="showAddStaffIntegrate = true">
            <template #icon>
              <IconSquareRoundedPlus />
            </template>
            Добавить
          </NButton>
        </template>
        <NList v-if="staff.integrations && staff.integrations.length">
          <NScrollbar class="max-h-[360px] px-4">
            <NListItem v-for="integrate in staff.integrations" :key="integrate.id">
              <NThing :title="integrate.name" content-style="margin-top: 10px;">
                <template #header-extra>
                  <NSpace>
                    <NButton v-if="integrate.link" text tag="a" :href="integrate.link" target="_blank">
                      <template #icon>
                        <NIcon :size="20" :component="IconExternalLink" />
                      </template>
                    </NButton>
                    <NButton text @click="handleEdit(integrate)">
                      <template #icon>
                        <NIcon :size="20" :component="IconEdit" />
                      </template>
                    </NButton>
                    <NButton text type="error" @click="removeIntegrate(staff.id, integrate.id)">
                      <template #icon>
                        <NIcon :size="20" :component="IconTrash" />
                      </template>
                    </NButton>
                  </NSpace>
                </template>
                <template #action>
                  <NSpace size="small">
                    <NButton v-if="integrate.login" size="small" secondary @click="copyIntegratedValue(integrate.login)">
                      Логин
                    </NButton>
                    <NButton v-if="integrate.password" size="small" secondary @click="copyIntegratedValue(integrate.password)">
                      Пароль
                    </NButton>
                  </NSpace>
                </template>
              </NThing>
            </NListItem>
          </NScrollbar>
        </NList>
        <NEmpty v-else description="Учетные записи не найдены" class="py-4 pb-8">
          <template #extra>
            <NButton secondary size="small" @click="showAddStaffIntegrate = true">
              Добавить новую запись
            </NButton>
          </template>
        </NEmpty>
      </NCard>
    </NGi>
  </NGrid>

  <ModalsAddStaffIntegrate v-model:show="showAddStaffIntegrate" :staff-id="staff.id" @created-integrate="(value) => staff.integrations.push(value)" />
  <ModalsEditStaffIntegrate v-model:show="showEditStaffIntegrate" v-model:model="editIntegrate" :staff-id="staff.id" @updated-integrate="(value) => updateIntegrate(value)" />
  <ModalsEditStaff v-model:show="showEdit" v-model:model="staff" />
</template>
