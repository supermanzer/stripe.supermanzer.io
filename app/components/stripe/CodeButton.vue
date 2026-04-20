<template>
  <v-tooltip :text="snippetsVisible ? 'Hide code' : 'Show code'">
    <template #activator="{ props }">
      <v-btn
        v-if="pageSnippets.length"
        v-bind="props"
        :icon="snippetsVisible ? 'mdi-code-tags-check' : 'mdi-code-tags'"
        density="compact"
        variant="text"
        @click="snippetsVisible = !snippetsVisible"
      />
    </template>
  </v-tooltip>
</template>

<script setup lang="ts">
import type { Snippet } from '#shared/types'

const pageSnippets = useState<Snippet[]>('page-snippets', () => [])
const snippetsVisible = useState<boolean>('snippets-visible', () => false)
</script>
