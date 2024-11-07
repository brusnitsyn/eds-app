<script lang="ts" setup>
import {
  IconChevronLeft,
  IconDownload,
  IconEdit,
  IconExternalLink,
  IconSquareRoundedPlus,
  IconTrash,
  IconUpload
} from '@tabler/icons-vue'
import { format, toDate } from 'date-fns'

const config = useRuntimeConfig()
const message = useMessage()
const { $api } = useNuxtApp()

const id = Number.parseInt(useRoute().params.id as string)

// const userModel = await $client.getUser.useQuery({ id })

const { data: staff } = await useAsyncData(`staff-id`, () => $api(`/api/staff/${id}`))

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

const showStaffIntegrate = ref(false)

async function removeIntegrate(staffId: number, integrateId: number) {
  const { status } = await useAPI(`/api/staff/${staffId}/integrate/${integrateId}`, {
    method: 'DELETE',
  })

  if (status.value === 'success') {
    const sliceIntegrationId = staff.value.integrations.findIndex(item => item.id === integrateId)
    staff.value.integrations.splice(sliceIntegrationId, 1)
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
          <NButton class="absolute top-2 left-0 -translate-x-1/2" :style="{ border: '1px', borderColor: useThemeVars().value.borderColor, borderStyle: 'solid' }" :color="useThemeVars().value.cardColor" :text-color="useThemeVars().value.textColor3" circle>
            <template #icon>
              <NIcon :component="IconChevronLeft" />
            </template>
          </NButton>
          <NAvatar round :size="120" class="font-bold text-3xl">
            {{ staff.last_name[0] }}{{ staff.first_name[0] }}
          </NAvatar>
          <template #action>
            <NSpace align="center" :size="50">
              <NText class="text-lg font-bold">
                {{ staff.full_name }}
              </NText>
            </NSpace>
          </template>
        </NCard>

        <n-alert v-if="hasAlerValid" title="Все хорошо" type="success">
          Сертификат действителен
        </n-alert>
        <n-alert v-if="hasAlerNewRequest" title="Требуется внимание" type="warning">
          Срок действия сертификата подходит к концу
          Срок действия закрытого ключа подходит к концу
        </n-alert>
        <n-alert v-if="hasAlerNoValid" title="Все плохо" type="error">
          Сертификат не действителен
          Закрытый ключ не действителен
        </n-alert>

        <NCard title="Общая информация">
          <template #header-extra>
            <NButton text>
              <template #icon>
                <IconEdit />
              </template>
              Изменить
            </NButton>
          </template>
          <NList hoverable>
            <NListItem>
              <template #suffix>
                <AppCopyButton :value="staff.inn" />
              </template>
              <NGrid :cols="2">
                <NGi><NText>ИНН</NText></NGi>
                <NGi><NText>{{ staff.inn }}</NText></NGi>
              </NGrid>
            </NListItem>
            <NListItem>
              <template #suffix>
                <AppCopyButton :value="staff.snils" />
              </template>
              <NGrid :cols="2">
                <NGi><NText>СНИЛС</NText></NGi>
                <NGi><NText>{{ staff.snils }}</NText></NGi>
              </NGrid>
            </NListItem>
            <NListItem>
              <template #suffix>
                <AppCopyButton :value="staff.job_title" />
              </template>
              <NGrid :cols="2">
                <NGi><NText>Должность</NText></NGi>
                <NGi><NEllipsis>{{ staff.job_title }}</NEllipsis></NGi>
              </NGrid>
            </NListItem>
            <NListItem>
              <template #suffix>
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
              <NButton text>
                <template #icon>
                  <IconUpload />
                </template>
                Установить
              </NButton>
              <NButton text>
                <template #icon>
                  <IconDownload />
                </template>
                Скачать
              </NButton>
            </NSpace>
          </template>
          <NList hoverable>
            <NListItem>
              <template #suffix>
                <AppCopyButton :value="staff.cert.serial_number" />
              </template>
              <NGrid :cols="2">
                <NGi>
                  <NText class="font-bold">
                    {{ staff.cert.serial_number }}
                  </NText>
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
                      В следующем обновлении
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
          <NButton text @click="showStaffIntegrate = true">
            <template #icon>
              <IconSquareRoundedPlus />
            </template>
            Добавить
          </NButton>
        </template>
        <NList v-if="staff.integrated && staff.integrated.length">
          <NScrollbar class="max-h-[360px] pl-4 -mx-4">
            <NListItem v-for="integrate in staff.integrations" :key="integrate.id">
              <NThing :title="integrate.name" content-style="margin-top: 10px;">
                <template #header-extra>
                  <NSpace>
                    <NButton v-if="integrate.link" text tag="a" :href="integrate.link" target="_blank">
                      <template #icon>
                        <NIcon :size="20" :component="IconExternalLink" />
                      </template>
                    </NButton>
                    <NButton text>
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
                    <NButton v-if="integrate.login" size="small" secondary>
                      Логин
                    </NButton>
                    <NButton v-if="integrate.password" size="small" secondary>
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
            <NButton secondary size="small" @click="showStaffIntegrate = true">
              Добавить новую запись
            </NButton>
          </template>
        </NEmpty>
      </NCard>
    </NGi>
  </NGrid>

  <ModalsAddStaffIntegrate v-model:show="showStaffIntegrate" :staff-id="staff.id" />
</template>
