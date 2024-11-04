<script setup lang="ts">
import { IconCopy } from '@tabler/icons-vue'
import { NIcon } from 'naive-ui'

const props = defineProps<{ value: string }>()
const message = useMessage()
function copyValue() {
  navigator.clipboard.writeText(props.value)
  message.success('Значение скопировано в буфер обмена', {
    icon: () => h(NIcon, null, { default: () => h(IconCopy) })
  })
}
</script>

<template>
  <NFlex>
    <NTooltip trigger="hover">
      <template #trigger>
        <NButton text @click="copyValue">
          <template #icon>
            <IconCopy />
          </template>
        </NButton>
      </template>
      Скопировать значение
    </NTooltip>
  </NFlex>
</template>

<style scoped>

</style>
