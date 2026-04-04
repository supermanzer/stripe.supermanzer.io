<template>
  <v-row justify="center">
    <v-btn :to="to" color="primary" variant="elevated">{{ text }}</v-btn>
  </v-row>
</template>

<script setup lang="ts">
defineProps<{ to: string; text: string }>()
</script>
