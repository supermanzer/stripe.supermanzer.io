<template>
  <v-footer
    :style="{ backgroundImage: 'linear-gradient(to right, #243949 0%, #517fa4 100%)' }"
    class="d-flex justify-space-between align-center px-6 py-0 flex-wrap"
    height="90"
    app
  >
    <span class="text-white text-body-2">
      &copy; {{ year }} supermanzer
    </span>
    <span class="text-white text-body-2">
      Built with
      <a href="https://nuxt.com" target="_blank" rel="noopener" class="text-white">Nuxt</a>
      &amp;
      <a href="https://stripe.com" target="_blank" rel="noopener" class="text-white">Stripe</a>
    </span>
  </v-footer>
</template>

<script setup lang="ts">
const year = new Date().getFullYear()
</script>
