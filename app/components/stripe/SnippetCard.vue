<template>
  <v-card :class="cardClass" rounded="lg" variant="tonal">
    <v-card-title class="d-flex align-center ga-2 text-caption font-weight-bold text-uppercase py-2 px-4">
      <v-icon :icon="icon" size="small" />
      {{ snippet.label }}
    </v-card-title>
    <v-card-subtitle class="text-capitalize">Lang: {{ content?.language }}</v-card-subtitle>
    <v-divider />
    <v-card-text class="px-4">
      <ContentRenderer v-if="content" :value="content" />
      <v-skeleton-loader v-else type="paragraph" />
    </v-card-text>
    <v-card-actions v-if="content != null && hasReference">
      <v-btn flat prepend-icon="mdi-code-tags" :href="content.reference">reference</v-btn>
    </v-card-actions>
  </v-card>
</template>

<script setup lang="ts">
import type { Snippet } from '#shared/types'

const { snippet } = defineProps<{ snippet: Snippet }>()

const { data: content } = await useAsyncData('snippets-' + snippet.path, () =>
  queryCollection('snippets').path('/snippets/' + snippet.path).first()
)

const hasReference = computed(() => {
  return Object.hasOwn(content.value ?? {}, 'reference')
})

const cardClass = computed(() =>
  snippet.label === 'server' ? 'border-s-4 border-indigo' : 'border-s-4 border-teal'
)

const icon = computed(() =>
  snippet.label === 'server' ? 'mdi-server' : 'mdi-monitor'
)
</script>

<style scoped>
:deep(pre) {
  white-space: pre-wrap;
  word-break: break-word;
  border-radius: 8px;
  padding: 1rem;
  margin: 0;
}
</style>
