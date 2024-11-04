<script setup lang="ts">
import { h, ref } from 'vue'
import { NAvatar, NIcon, NText } from 'naive-ui'
import {
  IconAffiliate,
  IconBook,
  IconBriefcase,
  IconCertificate,
  IconChevronDown,
  IconLogout,
  IconNotes,
  IconUsersGroup
} from '@tabler/icons-vue'
import { NuxtLink } from '#components'

const { user } = useSanctumAuth()
const route = useRoute()

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
    key: '/certificates',
    icon: IconCertificate,
    to: {
      name: 'certificates'
    }
  },
  // {
  //   label: 'Доступы',
  //   key: '/access',
  //   icon: IconLockAccess,
  //   to: {
  //     name: 'certificates'
  //   }
  // },
  {
    label: 'Кадры',
    key: '/cadrs',
    icon: IconUsersGroup,
    to: {
      name: 'cadrs'
    }
  },
  {
    label: 'Журналы',
    key: '/journals',
    icon: IconBook,
    children: [
      {
        label: 'Отчет по пролежням',
        key: '/journals/rob',
        icon: IconNotes
      },
      {
        label: 'Вакансии',
        key: '/journals/vacan',
        icon: IconBriefcase
      },
      {
        label: 'Журнал регистрации падений пациентов и посетителей',
        key: '/journals/pacient-falls',
        icon: IconNotes,
        to: {
          name: 'journals-pacient-falls'
        }
      },
      {
        label: 'Реестр рисков',
        key: '/journals/riskreg',
        icon: IconNotes
      },
      {
        label: 'Хирургия Осложнения',
        key: '/journals/surcom',
        icon: IconNotes
      },
      {
        label: 'Учет нежелательных событий в регистратуре поликлиники ',
        key: '/journals/events',
        icon: IconNotes
      }
    ]
  },
  {
    label: 'Подразделения',
    key: '/divisions',
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
  <NLayout class="h-screen max-h-screen">
    <NLayout has-sider class="h-full sticky left-0 bottom-0 top-0 z-40">
      <NLayoutSider
        collapse-mode="width"
        :collapsed-width="64"
        :width="280"
        content-class="flex flex-col"
      >
        <NFlex vertical justify="space-between" class="h-full">
          <NSpace vertical>
            <div class="px-2">
              <NButton quaternary class="!my-6 !py-2 !mb-4 !mt-4 !w-full !h-auto">
                <template #default>
                  <NFlex align="center" class="!-ml-16">
                    <NAvatar :size="48" circle>
                      {{ user.name[0] }}
                    </NAvatar>
                    <NFlex vertical justify="center" :size="2">
                      <NText class="text-start font-semibold">
                        {{ user.name }}
                      </NText>
                      <NText class="text-start">
                        {{ user.login }}
                      </NText>
                    </NFlex>
                  </NFlex>
                </template>
              </NButton>
            </div>
            <NMenu
              :collapsed-width="64"
              :collapsed-icon-size="22"
              :options="menuOptions"
              :render-label="renderMenuLabel"
              :render-icon="renderMenuIcon"
              :expand-icon="expandIcon"
              :default-value="route.path"
            />
          </NSpace>
          <NSpace vertical class="p-8">
            <NaiveColorModeSwitch :text="false" secondary icon-light="tabler:sun" icon-dark="tabler:moon" icon-system="tabler:device-desktop" />
          </NSpace>
        </NFlex>
      </NLayoutSider>
      <div class="container max-w-7xl mx-auto pt-8 max-h-screen">
        <slot />
      </div>
    </NLayout>
  </NLayout>
</template>

<style scoped>

</style>
