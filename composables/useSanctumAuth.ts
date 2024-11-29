import { useSanctumConfig } from './useSanctumConfig'
import {navigateTo} from "#app";

export function useSanctumAuth() {
  const user = useState<T | null>('user', () => null)
  const cookieToken = useCookie('token')
  const isAuthenticated = computed(() => cookieToken.value)
  const nuxtApp = useNuxtApp()
  const config = useSanctumConfig()
  const { redirect } = useSanctumConfig()

  async function refreshUser() {
    const { data } = await useAPI(config.endpoints.user)
    user.value = data.value
  }

  async function login(credentials: Record<string, any>) {
    const { data } = await useAPI(config.endpoints.login, {
      method: 'POST',
      body: credentials
    })

    if (data.value.token) {
      useCookie('token').value = data.value.token
      refreshCookie('token')

      await refreshUser()

      nuxtApp.runWithContext(() => navigateTo(redirect.onLogin, { replace: true }))
    }
  }

  return {
    user,
    isAuthenticated,
    cookieToken,
    refreshUser,
    login
  }
}
