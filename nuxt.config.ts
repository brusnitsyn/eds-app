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
      apiUrl: process.env.API_URL,
      sanctum: {
        baseUrl: process.env.API_URL,
        endpoints: {
          login: '/api/auth/login',
          user: '/api/user',
        },
        redirect: {
          keepRequestedRoute: false,
          onLogin: '/certificates',
          onLogout: '/',
          onAuthOnly: '/auth',
          onGuestOnly: '/',
        },
      },
    }
  },

  sanctum: {
    mode: 'token',
    baseUrl: process.env.API_URL,
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

  modules: ['@nuxtjs/tailwindcss', '@bg-dev/nuxt-naiveui', '@nuxt/fonts'],

  devtools: {
    enabled: true
  },

  naiveui: {
    themeConfig: {
      fontFamily: 'Golos Text'
    }
  },

  fonts: {
    families: [
      { name: 'Golos Text', provider: 'google', global: true }
    ],
    default: {
      weights: [500],
      styles: ['normal'],
      subsets: [
        'cyrillic-ext',
        'cyrillic',
        'latin-ext',
        'latin'
      ]
    }
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
