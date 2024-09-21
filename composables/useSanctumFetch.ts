import defu from 'defu'
import { useSanctumAuth } from './useSanctumAuth'
import {callWithNuxt, type UseFetchOptions} from '#app'

export default defineNuxtPlugin((nuxtApp) => {
  const config = useRuntimeConfig()

  async function client<T>(url: string, options: UseFetchOptions<T> = {}) {
    const { cookieToken } = useSanctumAuth()

    const defaults: UseFetchOptions<T> = {
      baseURL: config.public.proxyApiUrl ?? 'http://127.0.0.1:8000/api',
      // set user token if connected
      headers: cookieToken.value
          ? { Authorization: `Bearer ${cookieToken.value}`, Accept: 'application/json' }
          : { Accept: 'application/json' },

      onResponse(_ctx) {
        // _ctx.response._data = new myBusinessResponse(_ctx.response._data)
      },

      async onResponseError(_ctx) {
        // throw new myBusinessError()
        if (_ctx.response.status === 401) {
          await callWithNuxt(nuxtApp, () => navigateTo("/auth"))
        }
      }
    }

    // for nice deep defaults, please use unjs/defu
    const params = defu(defaults, options)

    return $fetch(url, params)
  }

  return {
    client
  }
})
