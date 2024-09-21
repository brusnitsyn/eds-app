export default defineNuxtRouteMiddleware(async (to, from) => {
  const cookieToken = useCookie('token')

  if (!cookieToken.value) {
    abortNavigation()
    return navigateTo('/auth', { replace: true })
  }
})
