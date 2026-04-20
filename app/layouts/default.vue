<template>
  <v-app :theme="currentTheme">
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
const { mdAndDown: fluid } = useDisplay()
const { currentTheme } = useThemePreference()
</script>
