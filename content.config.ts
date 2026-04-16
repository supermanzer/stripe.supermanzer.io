import { defineContentConfig, defineCollection } from '@nuxt/content'

export default defineContentConfig({
  collections: {
    content: defineCollection({
      type: 'page',
      source: '**',
    }),
    snippets: defineCollection({
      type: 'data',
      source: 'snippets/*'
    })
  },
})
