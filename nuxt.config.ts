/// <reference types="node" />
// https://nuxt.com/docs/api/configuration/nuxt-config
export default defineNuxtConfig({
  modules: [
    '@nuxt/content',
    '@nuxt/icon',
    '@nuxt/image',
    '@nuxt/eslint',
    '@vueuse/nuxt',
  ],
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