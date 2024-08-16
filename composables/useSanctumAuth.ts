import { useSanctumConfig } from './useSanctumConfig'
import { useSanctumFetch } from './useSanctumFetch'

export function useSanctumAuth() {
  const user = useState<T | null>('user', () => null)
  const cookieToken = useCookie('token')
  const isAuthenticated = computed(() => user.value !== null)
  const config = useSanctumConfig()

  async function refreshUser() {
    user.value = await useSanctumFetch(config.endpoints.user)
  }

  async function login(credentials: Record<string, any>) {
    console.log('Отправка response')
    const { token } = await useSanctumFetch(config.endpoints.login, {
      method: 'POST',
      body: credentials
    })
    console.log(`Получен ответ: ${token}`)

    if (token) {
      console.log(`Сохранение токена: ${token}`)
      cookieToken.value = token
    }

    if (cookieToken.value) {
      return await navigateTo(config.redirect.onLogin, { replace: true })
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
