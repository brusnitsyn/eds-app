export default defineNuxtPlugin(async (nitroApp) => {
  const { refreshUser } = useSanctumAuth()
  const cookieToken = useCookie('token')
  if (cookieToken.value) { await refreshUser() }
})
