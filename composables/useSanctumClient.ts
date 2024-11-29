import type { $Fetch } from 'ofetch'
import { useNuxtApp } from '#app'

export function useSanctumClient(): $Fetch {
  const { $api } = useNuxtApp()
  return $api as $Fetch
}
