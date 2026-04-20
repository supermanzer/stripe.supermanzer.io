<template>
    <v-list>
        <v-list-subheader>STRIPE DOCS</v-list-subheader>

        <v-list-item
          v-for="(doc, i) in docs"
          :key="i"
          :value="doc"
          color="primary"
        >
            <template #prepend>
                <v-icon icon="mdi-book-education" />
            </template>
            <v-list-item-title>{{ doc.title }}</v-list-item-title>
            <template #append>
                <v-btn icon="mdi-link" :href="doc.url" target="_blank" flat />
            </template>
        </v-list-item>
    </v-list>
</template>

<script setup lang="ts">
import type {Doc} from '#shared/types';

const {docs} = defineProps({
    docs: {type: Array<Doc>, required: false, default: () => []}
})
</script>