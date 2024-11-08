<script setup lang="ts">
const props = defineProps<{ staffId: number }>()
const emits = defineEmits('createdIntegrate')

const show = defineModel('show')

const model = defineModel('model')

const { pending, rules, reset, onSubmit, edited, apiErrors, formRef } = useNaiveForm(model)

rules.value = {
  full_name: [
    {
      required: true,
      message: 'ФИО обязательно!',
      trigger: ['blur', 'input']
    }
  ],
  inn: [
    {
      required: false,
    },
  ],
  snils: [
    {
      required: false,
    },
  ],
  job_title: [
    {
      required: false,
    }
  ],
  division: [
    {
      required: false,
    }
  ],
}

function handleSubmit() {
  formRef.value?.validate(async (errors) => {
    if (!errors) {
      const { data, status } = await useAPI(`/api/staff/${props.staffId}/integrate`, {
        method: 'POST',
        body: model.value,
      })

      if (status.value === 'success') {
        emits('createdIntegrate', data.value)
        show.value = false
      }
    }
  })
}

function handleClose() {
  show.value = false
  reset()
}
</script>

<template>
  <NModal v-model:show="show" :mask-closable="false" preset="card" class="w-1/3" title="Редактирование персоны">
    <NTabs type="segment">
      <NTabPane name="info" tab="Общая информация">
        <NForm ref="formRef" :rules="rules" :model="model" @submit.prevent="() => onSubmit(handleSubmit)">
          <NGrid cols="2" x-gap="8">
            <NFormItemGi span="2" label="ФИО" path="full_name">
              <NInput
                v-model:value="model.full_name"
                placeholder="Брусницын Андрей Олегович"
              />
            </NFormItemGi>
            <NFormItemGi label="ИНН" path="inn">
              <NInput
                v-model:value="model.login"
                placeholder="280122817942"
              />
            </NFormItemGi>
            <NFormItemGi label="СНИЛС" path="snils">
              <NInput
                v-model:value="model.password"
                placeholder="18165141866"
              />
            </NFormItemGi>
            <NFormItemGi label="Должность" path="job_title">
              <NInput
                v-model:value="model.link"
                placeholder="Программист"
              />
            </NFormItemGi>
            <NFormItemGi label="Подразделение" path="division">
              <NInput
                v-model:value="model.link"
                placeholder="Отдел автоматизированных систем управления и телемедицинских технологий"
              />
            </NFormItemGi>
          </NGrid>
        </NForm>
      </NTabPane>
      <NTabPane name="certificate" tab="Сертификат">
        <NForm ref="formRef" :rules="rules" :model="model" @submit.prevent="() => onSubmit(handleSubmit)">
          <NGrid cols="2" x-gap="8">
            <NFormItemGi span="2" label="ФИО" path="full_name">
              <NInput
                v-model:value="model.full_name"
                placeholder="Брусницын Андрей Олегович"
              />
            </NFormItemGi>
            <NFormItemGi label="ИНН" path="inn">
              <NInput
                v-model:value="model.login"
                placeholder="280122817942"
              />
            </NFormItemGi>
            <NFormItemGi label="СНИЛС" path="snils">
              <NInput
                v-model:value="model.password"
                placeholder="18165141866"
              />
            </NFormItemGi>
            <NFormItemGi label="Должность" path="job_title">
              <NInput
                v-model:value="model.link"
                placeholder="Программист"
              />
            </NFormItemGi>
            <NFormItemGi label="Подразделение" path="division">
              <NInput
                v-model:value="model.link"
                placeholder="Отдел автоматизированных систем управления и телемедицинских технологий"
              />
            </NFormItemGi>
          </NGrid>
        </NForm>
      </NTabPane>
    </NTabs>

    <template #action>
      <NFlex justify="space-between" align="center">
        <NButton secondary @click="handleClose">
          Отмена
        </NButton>
        <NButton type="primary" :loading="pending" :disabled="pending || !edited" attr-type="submit" @click="handleSubmit">
          Обновить
        </NButton>
      </NFlex>
    </template>
  </NModal>
</template>

<style scoped>

</style>
