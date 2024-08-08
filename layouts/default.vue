<script setup lang="ts">
import { defineComponent, h, ref } from 'vue'
import { NIcon } from 'naive-ui'
import {
  IconAffiliate,
  IconBook,
  IconBriefcase,
  IconCertificate,
  IconChevronDown,
  IconLockAccess,
  IconLogout,
  IconNotes,
  IconUsersGroup
} from '@tabler/icons-vue'
import { NuxtLink } from '#components'
import { TOP_MENU_HEIGHT } from '~/constants'

const { data } = useAuth()

function renderIcon(icon: Object) {
  return h(NIcon, null, { default: () => h(icon) })
}

const collapsed = ref(true)

function renderMenuLabel(option: MenuOption) {
  if ('href' in option) {
    return h('a', { href: option.href, target: '_blank' }, [
      option.label as string
    ])
  }

  if ('to' in option) {
    return h(NuxtLink, { to: { name: option.to.name } }, [
      option.label as string
    ])
  }

  return option.label as string
}

function renderMenuIcon(option: MenuOption) {
  return h(NIcon, null, { default: () => h(option.icon) })
}

function expandIcon() {
  return h(NIcon, null, { default: () => h(IconChevronDown) })
}

const menuOptions = [
  {
    label: 'ЭЦП',
    key: 'eds',
    icon: IconCertificate,
    to: {
      name: 'certificates'
    }
  },
  {
    label: 'Доступы',
    key: 'access',
    icon: IconLockAccess,
    to: {
      name: 'certificates'
    }
  },
  {
    label: 'Кадры',
    key: 'cadrs',
    icon: IconUsersGroup,
    to: {
      name: 'cadrs'
    }
  },
  {
    label: 'Журналы',
    key: 'journals',
    icon: IconBook,
    children: [
      {
        label: 'Отчет по пролежням',
        key: 'rob',
        icon: IconNotes
      },
      {
        label: 'Вакансии',
        key: 'vacan',
        icon: IconBriefcase
      },
      {
        label: 'Журнал регистрации падений пациентов и посетителей',
        key: 'fallslog',
        icon: IconNotes
      },
      {
        label: 'Реестр рисков',
        key: 'riskreg',
        icon: IconNotes
      },
      {
        label: 'Хирургия Осложнения',
        key: 'surcom',
        icon: IconNotes
      },
      {
        label: 'Учет нежелательных событий в регистратуре поликлиники ',
        key: 'events',
        icon: IconNotes
      }
    ]
  },
  {
    label: 'Подразделения',
    key: 'divisions',
    icon: IconAffiliate,
    to: {
      name: 'divisions'
    }
  }
]

const userOptions = [
  {
    label: 'Выход из аккаунта',
    key: 'logout',
    icon: IconLogout
  }
]
</script>

<template>
  <NLayout class="max-h-screen">
    <NLayoutHeader bordered class="sticky top-0 z-50">
      <NFlex inline :wrap="false" justify="end" align="center" class="w-full px-4 py-1">
        <NDropdown :options="userOptions">
          <NButton quaternary>
            <NFlex align="center">
              <NAvatar size="small" round src="https://sun67-2.userapi.com/s/v1/ig2/YK9JXVcvBHPl2DzdLHXg--kQDMKmkFQfzjO8z534cqBHdx53JU0fX7UTBqoe5OroRTy08lE5pXN7xDdABMJ1heWI.jpg?size=50x50&quality=95&crop=0,0,511,511&ava=1" />
              <span>{{ data.login }}</span>
            </NFlex>
          </NButton>
        </NDropdown>
      </NFlex>
    </NLayoutHeader>
    <n-layout has-sider class="h-full sticky left-0 bottom-0 top-0 z-40">
      <n-layout-sider
        bordered
        collapse-mode="width"
        :collapsed-width="64"
        :width="240"
        :collapsed="collapsed"
        show-trigger
        @collapse="collapsed = true"
        @expand="collapsed = false"
      >
        <n-menu
          :collapsed="collapsed"
          :collapsed-width="64"
          :collapsed-icon-size="22"
          :options="menuOptions"
          :render-label="renderMenuLabel"
          :render-icon="renderMenuIcon"
          :expand-icon="expandIcon"
          :default-value="1"
        />
      </n-layout-sider>
      <div class="container max-w-5xl mx-auto pt-8 h-[calc(100vh-42px)] max-h-[calc(100vh-42px)]">
        <slot />
      </div>
    </n-layout>
  </NLayout>
</template>

<style scoped>

</style>
