<template>
  <v-app>
    <LayoutAppHeader />
    <v-main>
      <v-container :fluid="fluid">
        <NuxtPage />
      </v-container>
    </v-main>
    <LayoutAppFooter />
  </v-app>
</template>

<script setup lang="ts">
// Reduce horizontal margins on smaller displays
const {mdAndDown: fluid} = useDisplay()
</script>