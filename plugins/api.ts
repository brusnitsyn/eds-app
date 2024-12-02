export default defineNuxtPlugin((nuxtApp) => {
  const config = useRuntimeConfig()
  const api = $fetch.create({
    baseURL: config.public.apiUrl ?? 'http://127.0.0.1:8000/api',
    onRequest({ request, options, error }) {

      if (useCookie('token').value) {
        options.mode = options.mode ?? 'same-origin'
        const headers = options.headers ||= {}
        if (Array.isArray(headers)) {
          headers.push(['Authorization', `Bearer ${useCookie('token').value}`])
          headers.push(['Accept', `application/json`])
        }
        else if (headers instanceof Headers) {
          headers.set('Authorization', `Bearer ${useCookie('token').value}`)
          headers.set('Accept', `application/json`)
        }
        else {
          headers.Authorization = `Bearer ${useCookie('token').value}`
          headers.Accept = `application/json`
        }
      }
    },
    async onResponseError({ response }) {
      if (response.status === 401) {
        useCookie('token').value = null
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
