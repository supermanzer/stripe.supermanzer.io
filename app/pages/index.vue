<script setup lang="ts">
const { data: page } = await useAsyncData('index-page', () =>
  queryCollection('content').path('/').first()
)

const { data: integrations } = await useAsyncData('integrations', () =>
  queryCollection('content').where('path', 'LIKE', '/integrations/%').all()
)
</script>

<template>
  <v-container>
    <ContentRenderer v-if="page" :value="page" />

    <v-divider class="my-6" />

    <h2 class="text-h5 mb-4">Integrations</h2>
    <v-row>
      <v-col
        v-for="integration in integrations"
        :key="integration.path"
        cols="12"
        sm="6"
        md="4"
      >
        <v-card
          :to="integration.path"
          :title="integration.title"
          :subtitle="integration.description"
          variant="outlined"
          hover
        />
      </v-col>
    </v-row>
  </v-container>
</template>
