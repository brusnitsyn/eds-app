<script setup lang="ts">
import { format } from 'date-fns'
import { cn } from '~/lib/utils'

interface validProps {
  cert: {
    validTo: Date
    hasValid: boolean
    hasRequestNew: boolean
  }
}

const props = defineProps<validProps>()

const hasValid = computed(() => props.cert.hasValid && !props.cert.hasRequestNew)
const hasNotValid = computed(() => !props.cert.hasValid && !props.cert.hasRequestNew)
const hasRequestNew = computed(() => props.cert.hasValid && props.cert.hasRequestNew)

const text = computed(() => {
  if (hasValid.value && !hasRequestNew.value) {
    return 'Сертификат действителен'
  }
  else if (!hasValid.value && !hasRequestNew.value) {
    return 'Сертификат недействителен'
  }
  else { return 'Требуется перевыпуск' }
})
</script>

<template>
  <div :class="cn('rounded px-40 py-[67px] relative', { 'bg-[#42FF00]/40': hasValid }, { 'bg-[#FF0000]/40': hasNotValid }, { 'bg-[#FDA52C]/40': hasRequestNew })">
    <div class="flex flex-col items-center justify-center gap-y-2">
      <!-- <div>
        <Icon v-if="hasValid && !hasRequestNew" name="octicon:feed-issue-closed-16" size="96" class="opacity-70 drop-shadow-2xl" />
        <Icon v-else-if="!hasValid && !hasRequestNew" name="octicon:x-circle-fill-12" size="96" class="opacity-70 drop-shadow-2xl" />
        <Icon v-else name="octicon:clock-fill-16" size="96" class="opacity-70 drop-shadow-2xl" />
      </div> -->
      <div class="text-lg text-nowrap font-semibold">
        {{ text }}
      </div>
    </div>
  </div>
</template>

<style scoped>

</style>
