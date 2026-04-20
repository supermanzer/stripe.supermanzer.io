<template>
  <v-app-bar
    :style="{ backgroundImage: 'linear-gradient(-225deg, #3D4E81 0%, #5753C9 48%, #6E7FF3 100%)' }"
    flat
  >
    <v-app-bar-title>
      <NuxtLink to="/" class="site-title text-white text-decoration-none">
        stripe.supermanzer.io
      </NuxtLink>
    </v-app-bar-title>

    <template #append>
      <v-btn to="/" color="white" variant="text">Home</v-btn>
      <v-btn to="/about" color="white" variant="text">About</v-btn>
      <v-tooltip :text="isDark ? 'Switch to light mode' : 'Switch to dark mode'" location="bottom">
        <template #activator="{ props }">
          <v-btn
            v-bind="props"
            :icon="isDark ? 'mdi-weather-sunny' : 'mdi-weather-night'"
            color="white"
            variant="text"
            @click="toggleTheme"
          />
        </template>
      </v-tooltip>
    </template>
  </v-app-bar>
</template>

<script setup lang="ts">
const { isDark, toggleTheme } = useThemePreference()
</script>

<style scoped>
.site-title {
  font-weight: 600;
  letter-spacing: 0.02em;
}
</style>
