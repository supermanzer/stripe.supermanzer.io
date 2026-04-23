import { defineContentConfig, defineCollection, z } from '@nuxt/content'

const snippetSchema = z.object({
  path: z.string(),
  label: z.enum(['server', 'client']),
  intentType: z.enum(['payment', 'setup']).optional(),
})

export default defineContentConfig({
  collections: {
    content: defineCollection({
      type: 'page',
      source: '**',
      schema: z.object({
        docs: z.array(z.object({ title: z.string(), url: z.string() })).optional(),
        snippets: z.array(snippetSchema).optional(),
      }),
    }),
    snippets: defineCollection({
      type: 'page',
      source: 'snippets/**',
      schema: z.object({
        language: z.string(),
        reference: z.string(),
      }),
    }),
  },
})
