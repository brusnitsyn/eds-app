<script setup lang="ts">
import type { UploadCustomRequestOptions } from "naive-ui";

const { client } = useSanctumFetch()
const props = defineProps<{ open: boolean }>()
const emits = defineEmits('update:open')

const uploadArchive = async ({ file }: UploadCustomRequestOptions) => {
  const formData = new FormData()
  formData.append(file.name, file.file as File)

  const response = await client('/api/certificate/upload', {
    method: 'POST',
    body: formData
  })

  console.log(response)
}
</script>

<template>
  <NModal :show="open" :mask-closable="false" preset="card" class="w-1/3" @update:show="value => emits('update:open', value)" title="Загрузка сертификатов">
    <NUpload
        directory-dnd
        :custom-request="customRequest"
    >
      <NUploadDragger>
        <div style="margin-bottom: 12px">
          <NaiveIcon size="48" :depth="3" name="tabler:archive" />
        </div>
        <NText style="font-size: 16px">
          Нажмите или перетащите архив в эту область, чтобы загрузить
        </NText>
<!--        <NP depth="3" style="margin: 8px 0 0 0">-->
<!--          Важно! Архив должен соответствовать <a href="https://github.com/brusnitsyn/eds-server/blob/main/cert-schema.md">схеме</a>.-->
<!--          Поддерживаемый формат архива: .zip-->
<!--        </NP>-->
      </NUploadDragger>
    </NUpload>
    <template #footer>
      <NFlex justify="end">
        <NButton>
          Готово
        </NButton>
      </NFlex>
    </template>
  </NModal>
</template>

<style scoped>

</style>
