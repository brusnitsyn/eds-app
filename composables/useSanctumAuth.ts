import { useSanctumConfig } from './useSanctumConfig'

export function useSanctumAuth() {
  const user = useState<T | null>('user', () => null)
  const cookieToken = useCookie('token')
  const isAuthenticated = computed(() => cookieToken.value)
  const config = useSanctumConfig()
  // const { client } = useSanctumFetch()

  async function refreshUser() {
    const { data } = await useAPI(config.endpoints.user)
    user.value = data.value
  }

  async function login(credentials: Record<string, any>) {
    const { data } = await useAPI(config.endpoints.login, {
      method: 'POST',
      mode: 'no-cors',
      body: credentials
    })

    if (data.value.token) {
      cookieToken.value = data.value.token
      // return navigateTo(config.redirect.onLogin, { replace: true })
      // await refreshUser()
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
