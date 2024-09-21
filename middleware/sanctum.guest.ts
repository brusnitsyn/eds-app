export default defineNuxtRouteMiddleware(async (to, from) => {
  const { isAuthenticated } = useSanctumAuth()

  // if (isAuthenticated.value === true) {
  //   abortNavigation()
  //   return navigateTo({ name: 'certificates' }, { replace: true })
  // }

  // return navigateTo('/auth', { replace: true })
})
