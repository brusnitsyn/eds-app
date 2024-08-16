import { useSanctumAuth } from '../composables/useSanctumAuth'

export default defineNitroPlugin(async (nitroApp) => {
  const { cookieToken, refreshUser } = useSanctumAuth()
  if (cookieToken) { await refreshUser() }
})
