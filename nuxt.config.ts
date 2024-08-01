// https://nuxt.com/docs/api/configuration/nuxt-config
export default defineNuxtConfig({
  app: {
    head: {
      charset: 'utf-8',
      viewport: 'width=device-width, initial-scale=1',
    }
  },

  runtimeConfig: {
    public: {
      api: 'http://eds-server.test/api'
    }
  },

  nitro: {
    routeRules: {
      "/s/**": { proxy: 'http://eds-server.test/api/**' },
    }
  },

  modules: [
    '@nuxtjs/tailwindcss',
    '@bg-dev/nuxt-naiveui',
    '@sidebase/nuxt-auth',
  ],

  devtools: {
    enabled: true
  },

  auth: {
    globalAppMiddleware: false,
    baseURL: 'http://eds-server.test/api/auth',
    provider: {
      type: 'local',
      endpoints: {
        signIn: { path: '/login' },
        getSession: { path: '/user' }
      },
      pages: {
        login: '/auth'
      },
      token: {
        signInResponseTokenPointer: '/token',
        type: 'Bearer',
        cookieName: 'auth.token',
        headerName: 'Authorization',
        maxAgeInSeconds: 1800,
        sameSiteAttribute: 'lax',
      }
    },
  },

  build: {
    transpile: [
      'trpc-nuxt',
      'jsonwebtoken'
    ]
  },

  typescript: {
    shim: false
  }
})
