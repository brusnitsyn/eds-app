import { useSanctumConfig } from './useSanctumConfig'

export function useSanctumAuth() {
  const user = useState<T | null>('user', () => null)
  const cookieToken = useCookie('token')
  const isAuthenticated = computed(() => cookieToken.value)
  const config = useSanctumConfig()
  // const { client } = useSanctumFetch()

  async function refreshUser() {
    console.log('refreshUser')
    const { data } = await useAPI(config.endpoints.user)
    console.log(`Получен ответ: ${data.value}`)
    user.value = data.value
  }

  async function login(credentials: Record<string, any>) {
    console.log('Отправка response')
    const { data } = await useAPI(config.endpoints.login, {
      method: 'POST',
      mode: 'no-cors',
      body: credentials
    })
    console.log(`Получен ответ: ${data.value.token}`)

    if (data.value.token) {
      console.log(`Сохранение токена: ${data.value.token}`)
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
