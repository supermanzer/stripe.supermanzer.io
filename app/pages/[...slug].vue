<script setup lang="ts">
import type { Doc, Snippet } from '#shared/types'

const route = useRoute()

const { data: page } = await useAsyncData('page-' + route.path, () => {
  return queryCollection('content').path(route.path).first()
})

if (!page.value) {
  throw createError({ statusCode: 404, statusMessage: 'Page not found', fatal: true })
}

if (route.path.startsWith('/snippets/')) {
  throw createError({ statusCode: 404, statusMessage: 'Page not found', fatal: true })
}

const docs = computed<Doc[]>(() => page.value?.docs ?? [])
const docsOpen = ref(false)

const pageSnippets = useState<Snippet[]>('page-snippets', () => [])
const snippetsVisible = useState<boolean>('snippets-visible', () => false)

watchEffect(() => { pageSnippets.value = page.value?.snippets ?? [] })
onUnmounted(() => {
  pageSnippets.value = []
  snippetsVisible.value = false
})
</script>

<template>
  <div>
    <ContentRenderer v-if="page" :value="page" />

    <v-expand-transition>
      <v-row v-if="snippetsVisible && pageSnippets.length" class="mt-4" dense>
        <v-col
          v-for="snippet in pageSnippets"
          :key="snippet.path"
          cols="12"
        >
          <stripe-snippet-card :snippet="snippet" />
        </v-col>
      </v-row>
    </v-expand-transition>

    <v-navigation-drawer
      v-if="docs.length"
      v-model="docsOpen"
      location="right"
      :width="280"
      temporary
    >
      <stripe-docs-list :docs="docs" />
    </v-navigation-drawer>

    <v-tooltip text="documentation">
      <template #activator="{props}">
        <v-btn
          v-if="docs.length"
          icon="mdi-book-open-variant"
          color="primary"
          position="fixed"
          v-bind="props"
          :style="{ right: docsOpen ? '280px' : '0', top: '50%', transform: 'translateY(-50%)' }"
          rounded="s-lg e-0"
          @click="docsOpen = !docsOpen"
        />
      </template>
    </v-tooltip>
  </div>
</template>
