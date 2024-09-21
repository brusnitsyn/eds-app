export default defineNuxtRouteMiddleware(async (to, from) => {
  const { isAuthenticated } = useSanctumAuth()

  if (isAuthenticated.value !== true) {
    abortNavigation()
    return navigateTo('/auth', { replace: true })
  }
})
