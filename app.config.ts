import { cookieTokenStorage } from './storages/sanctumTokenStorage'

export default defineAppConfig({
  sanctum: {
    tokenStorage: cookieTokenStorage,
  },
})