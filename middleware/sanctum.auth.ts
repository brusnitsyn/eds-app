export default defineNuxtRouteMiddleware(async (to, from) => {
  const { isAuthenticated } = useSanctumAuth()

  if (isAuthenticated.value === true) { return }

  return await navigateTo('/auth', { replace: true })
})
