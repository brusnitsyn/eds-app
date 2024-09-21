<script setup lang="ts">
import type { UploadCustomRequestOptions, UploadFileInfo, UploadInst } from 'naive-ui'

const props = defineProps<{ open: boolean, refresh: void }>()
const emits = defineEmits('update:open')
const isPackage = ref(0)
const uploadRef = ref<UploadInst | null>(null)
const fileListLength = ref(0)
const loading = ref(false)

async function uploadArchive({ file }: UploadCustomRequestOptions) {
  loading.value = true
  const formData = new FormData()
  formData.append('archive', file.file as File)
  formData.append('is_package', isPackage.value)

  const { status } = await useAPI('/api/certificate/upload', {
    method: 'POST',
    body: formData
  })

  if (status.value === 'success') {
    await props.refresh()
    emits('update:open', false)
  }
  loading.value = false
}

function handleChangeUpload(data: { fileList: UploadFileInfo[] }) {
  fileListLength.value = data.fileList.length
}

function handleClickUpload() {
  uploadRef.value?.submit()
}
</script>

<template>
  <NModal :show="open" :mask-closable="false" preset="card" class="w-1/3" title="Загрузка сертификатов" @update:show="value => emits('update:open', value)">
    <NUpload
      ref="uploadRef"
      :disabled="loading"
      directory-dnd
      :custom-request="uploadArchive"
      :default-upload="false"
      @change="handleChangeUpload"
    >
      <NUploadDragger>
        <div style="margin-bottom: 12px">
          <NaiveIcon size="48" :depth="3" name="tabler:archive" />
        </div>
        <NText style="font-size: 16px">
          Нажмите или перетащите архив в эту область, чтобы загрузить
        </NText>
        <!--        <NP depth="3" style="margin: 8px 0 0 0"> -->
        <!--          Важно! Архив должен соответствовать <a href="https://github.com/brusnitsyn/eds-server/blob/main/cert-schema.md">схеме</a>. -->
        <!--          Поддерживаемый формат архива: .zip -->
        <!--        </NP> -->
      </NUploadDragger>
    </NUpload>
    <template #footer>
      <NFlex justify="space-between" align="center">
        <NCheckbox v-model:checked="isPackage" :checked-value="1" :unchecked-value="0" :disabled="loading">
          Архив содержит несколько сертификатов
        </NCheckbox>
        <NButton type="primary" :loading="loading" :disabled="!fileListLength" @click="handleClickUpload">
          Загрузить
        </NButton>
      </NFlex>
    </template>
  </NModal>
</template>

<style scoped>

</style>
