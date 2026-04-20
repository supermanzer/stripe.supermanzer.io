/// <reference types="node" />
// https://nuxt.com/docs/api/configuration/nuxt-config
export default defineNuxtConfig({
  content: {
    build: {
      markdown: {
        highlight: {
          theme: {
            default: 'night-owl-light',
            dark: 'night-owl',
          },
          langs: ['typescript', 'javascript', 'bash', 'json', 'vue'],
        },
      },
    },
  },
  modules: [
    '@nuxt/content',
    '@nuxt/fonts',
    '@nuxt/icon',
    '@nuxt/image',
    '@nuxt/eslint',
    '@vueuse/nuxt',
    'vuetify-nuxt-module',
  ],
  vuetify: {
    moduleOptions: {},
    vuetifyOptions: {
      theme: {
        defaultTheme: 'light',
        themes: {
          light: {
            dark: false,
            colors: {
              primary: '#1867C0',
              secondary: '#48A9A6',
              background: '#FFFFFF',
              surface: '#FFFFFF',
              error: '#B00020',
              info: '#2196F3',
              success: '#4CAF50',
              warning: '#FB8C00',
            },
          },
          dark: {
            dark: true,
            colors: {
              primary: '#2196F3',
              secondary: '#48A9A6',
              background: '#121212',
              surface: '#212121',
              error: '#CF6679',
              info: '#2196F3',
              success: '#4CAF50',
              warning: '#FB8C00',
            },
          },
        },
      },
    },
  },
  routeRules: {
    // '/integrations/**': { ssr: false },
  },
  css: ['~/assets/css/shiki.css'],
  devtools: { enabled: true },
  compatibilityDate: '2024-04-03',

  runtimeConfig: {
    // SECRET VALUES: These values are only ever exposed to the server runtime
    STRIPE_SK: process.env.STRIPE_SK,

    // PUBLIC VALUES: These values are exposed to the client-side runtime and are therefore publice
    public: {
      STRIPE_PK: process.env.STRIPE_PK
    }
  }
})