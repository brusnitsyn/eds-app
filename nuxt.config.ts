// https://nuxt.com/docs/api/configuration/nuxt-config
export default defineNuxtConfig({
  app: {
    head: {
      charset: 'utf-8',
      viewport: 'width=device-width, initial-scale=1',
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
    provider: {
      type: 'local',
      endpoints: {
        getSession: { path: '/user' }
      },
      pages: {
        login: '/auth'
      },
      token: {
        signInResponseTokenPointer: '/token/accessToken'
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
