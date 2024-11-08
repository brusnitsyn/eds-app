<script setup lang="ts">
const props = defineProps<{ staffId: number }>()
const emits = defineEmits('updatedIntegrate')

const show = defineModel('show')

const model = defineModel('model')

const { pending, rules, reset, onSubmit, edited, apiErrors, formRef } = useNaiveForm(model)

rules.value = {
  name: [
    {
      required: true,
      message: 'Наменование учетной записи обязательно!',
      trigger: ['blur', 'input']
    }
  ],
  login: [
    {
      required: false,
    },
  ],
  password: [
    {
      required: false,
    },
  ],
  link: [
    {
      required: false,
    }
  ]
}

function handleSubmit() {
  formRef.value?.validate(async (errors) => {
    if (!errors) {
      const { data, status } = await useAPI(`/api/staff/${props.staffId}/integrate/${model.value.id}`, {
        method: 'PUT',
        body: model.value,
      })

      if (status.value === 'success') {
        emits('updatedIntegrate', data.value)
        show.value = false
      }
    }
  })
}

function handleClose() {
  show.value = false
}
</script>

<template>
  <NModal v-model:show="show" :mask-closable="false" preset="card" class="w-1/3" title="Редактирование учетной записи">
    <NForm ref="formRef" :rules="rules" :model="model" @submit.prevent="() => onSubmit(handleSubmit)">
      <NGrid cols="2" x-gap="8">
        <NFormItemGi span="2" label="Наименование" path="name">
          <NInput
            v-model:value="model.name"
            placeholder="GitHub"
          />
        </NFormItemGi>
        <NFormItemGi label="Логин" path="login">
          <NInput
            v-model:value="model.login"
            placeholder="brusnitsyn"
          />
        </NFormItemGi>
        <NFormItemGi label="Пароль" path="password">
          <NInput
            v-model:value="model.password"
            type="password"
            show-password-on="click"
            placeholder="••••••••••••••••••"
          />
        </NFormItemGi>
        <NFormItemGi span="2" label="Ссылка" path="link">
          <NInput
            v-model:value="model.link"
            placeholder="https://github.com/brusnitsyn"
          />
        </NFormItemGi>
      </NGrid>
    </NForm>
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
