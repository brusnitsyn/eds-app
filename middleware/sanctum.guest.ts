export default defineNuxtRouteMiddleware(async (to, from) => {
  const { cookieToken } = useSanctumAuth()

  if (cookieToken.value) {
    return navigateTo({ name: 'index' })
  }
})
