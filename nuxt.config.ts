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
      proxyApiUrl: process.env.PROXY_API_URL,
      sanctum: {
        baseUrl: process.env.PROXY_API_URL,
        endpoints: {
          login: '/api/auth/login',
          user: '/api/user',
        },
        redirect: {
          keepRequestedRoute: false,
          onLogin: '/',
          onLogout: '/',
          onAuthOnly: '/auth',
          onGuestOnly: '/',
        },
      },
    }
  },

  sanctum: {
    mode: 'token',
    baseUrl: process.env.PROXY_API_URL,
    endpoints: {
      login: '/api/auth/login',
      user: '/api/user',
    },
    redirect: {
      keepRequestedRoute: false,
      onLogin: '/',
      onLogout: '/',
      onAuthOnly: '/auth',
      onGuestOnly: '/',
    },
  },

  modules: [
    '@nuxtjs/tailwindcss',
    '@bg-dev/nuxt-naiveui',
  ],

  devtools: {
    enabled: true
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
