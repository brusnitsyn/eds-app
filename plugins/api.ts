export default defineNuxtPlugin((nuxtApp) => {
  const config = useRuntimeConfig()
  const cookieToken = useSanctumAuth().cookieToken
  const api = $fetch.create({
    baseURL: config.public.apiUrl ?? 'http://127.0.0.1:8000/api',
    onRequest({ request, options, error }) {
      if (cookieToken.value) {
        const headers = options.headers ||= {}
        if (Array.isArray(headers)) {
          headers.push(['Authorization', `Bearer ${cookieToken.value}`])
        }
        else if (headers instanceof Headers) {
          headers.set('Authorization', `Bearer ${cookieToken.value}`)
        }
        else {
          headers.Authorization = `Bearer ${cookieToken.value}`
        }
      }
    },
    async onResponseError({ response }) {
      if (response.status === 401) {
        await nuxtApp.runWithContext(() => navigateTo('/auth'))
      }
    }
  })

  // Expose to useNuxtApp().$api
  return {
    provide: {
      api
    }
  }
})
