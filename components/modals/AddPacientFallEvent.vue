<script setup lang="ts">
import type {FormInst} from "naive-ui";

const props = defineProps<{ open: boolean, refresh: void }>()
const emits = defineEmits(['update:open', 'created:value'])
const formRef = ref<FormInst | null>(null)
const loading = ref(false)
const formValue = ref({
  division_id: 1
})

async function handleClickAdd() {
  loading.value = true
  const { data, status } = await useAPI('/api/journal/fall', {
    method: 'post',
    body: formValue.value
  })

  if (status.value === 'success') {
    loading.value = false
    emits('created:value', data.value)
    emits('update:open', false)
  }
}
</script>

<template>
  <NModal :show="open" :mask-closable="false" preset="card" class="w-1/3" title="Добавить событие" @update:show="value => emits('update:open', value)">
    <NForm ref="formRef" :model="formValue">
      <NGrid cols="2" x-gap="18">
        <NFormItemGi span="2" label="ФИО пациента">
          <NInput v-model:value="formValue.full_name" />
        </NFormItemGi>
        <NFormItemGi label="Дата падения">
          <NDatePicker v-model:formatted-value="formValue.date" class="w-full" value-format="yyyy-MM-dd" />
        </NFormItemGi>
        <NFormItemGi label="Причина падения">
          <NInput v-model:value="formValue.reason" />
        </NFormItemGi>
        <NFormItemGi label="Место падения">
          <NInput v-model:value="formValue.place" />
        </NFormItemGi>
        <NFormItemGi label="Проведено мероприятие">
          <NInput v-model:value="formValue.held_event" />
        </NFormItemGi>
        <NFormItemGi span="2" label="Последствие">
          <NInput
            v-model:value="formValue.consequence" type="textarea" :autosize="{
              minRows: 3,
              maxRows: 3,
            }"
          />
        </NFormItemGi>
        <NFormItemGi span="2" label="Подразделение">
          <SelectDivision v-model:value="formValue.division_id" />
        </NFormItemGi>
      </NGrid>
    </NForm>
    <template #footer>
      <NFlex justify="end" align="center">
        <NButton type="primary" @click="handleClickAdd">
          Добавить
        </NButton>
      </NFlex>
    </template>
  </NModal>
</template>

<style scoped>

</style>
