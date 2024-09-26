<script setup lang="ts">
import { h, ref } from 'vue'
import { NAvatar, NIcon, NText } from 'naive-ui'
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

const { user } = useSanctumAuth()

function renderIcon(icon: Component) {
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

function renderUserInfo() {
  return h(
    'div',
    {
      class: 'flex items-center py-1 px-4'
    },
    [
      h(NAvatar, {
        round: true,
        class: 'mr-3',
      }, { default: () => user.value.name[0] }),
      h('div', null, [
        h('div', null, [
          h(NText, { depth: 0 }, { default: () => user.value.name })
        ]),
        h('div', null, [
          h(NText, { depth: 3 }, { default: () => user.value.login })
        ])
      ])
    ]
  )
}

const userOptions = [
  {
    key: 'user',
    type: 'render',
    render: renderUserInfo
  },
  {
    key: 'header-divider',
    type: 'divider'
  },
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
      <NFlex inline :wrap="false" justify="space-between" align="center" class="w-full px-4 py-1">
        <NText class="text-xl font-semibold">
          EDS
        </NText>
        <NDropdown placement="bottom-end" trigger="click" :options="userOptions" :render-icon="renderMenuIcon">
          <NButton quaternary>
            <NFlex align="center">
              <NAvatar size="small" round>
                {{ user.name[0] }}
              </NAvatar>
              <span>{{ user.name }}</span>
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
