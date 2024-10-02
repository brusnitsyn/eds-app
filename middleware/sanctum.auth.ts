export default defineNuxtRouteMiddleware(async (to, from) => {
  const cookieToken = useCookie('token')
  // const auth = useSanctumAuth()

  if (!cookieToken.value) {
    abortNavigation()
    return navigateTo('/auth', { replace: true })
  }

  // await auth.refreshUser()
})
