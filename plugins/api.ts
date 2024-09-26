export default defineNuxtPlugin((nuxtApp) => {
  const config = useRuntimeConfig()
  const cookieToken = useSanctumAuth().cookieToken
  const api = $fetch.create({
    baseURL: config.public.apiUrl ?? 'http://127.0.0.1:8000/api',
    onRequest({ request, options, error }) {
      if (cookieToken.value) {
        options.mode = 'cors'
        const headers = options.headers ||= {}
        if (Array.isArray(headers)) {
          headers.push(['Authorization', `Bearer ${cookieToken.value}`])
          headers.push(['Accept', `application/json`])
        }
        else if (headers instanceof Headers) {
          headers.set('Authorization', `Bearer ${cookieToken.value}`)
          headers.set('Accept', `application/json`)
        }
        else {
          headers.Authorization = `Bearer ${cookieToken.value}`
          headers.Accept = `application/json`
        }
      }
    },
    async onResponseError({ response }) {
      if (response.status === 401) {
        cookieToken.value = null
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
