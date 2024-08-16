import { useSanctumAuth } from '../composables/useSanctumAuth'

export default defineNuxtPlugin(async (nitroApp) => {
  const { cookieToken, refreshUser } = useSanctumAuth()
  if (cookieToken.value !== null) { await refreshUser() }
})
