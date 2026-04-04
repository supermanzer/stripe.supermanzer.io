<template>
    <v-card>
        <v-img 
          v-if="img.length > 0" 
          cover 
          :src="img" 
          class="px-6 align-end text-white py-4" 
          gradient="to top, rgba(0,0,0,0.7), rgba(0,0,0,0.1)" 
          :height="height">
            <v-card-title>{{ title }}</v-card-title>
            <v-divider/>
            <v-card-subtitle>{{ subtitle }}</v-card-subtitle>
        </v-img>
        <div v-else>
            <v-card-title>{{ title }}</v-card-title>
            <v-divider/>
            <v-card-subtitle>{{ subtitle }}</v-card-subtitle>
        </div>
        <v-card-text v-if="$slots.text" class="mx-auto">
            <slot name="text" />
        </v-card-text>
        <v-card-text class="mx-auto">
            <slot />
        </v-card-text>
        <v-card-actions class="mx-auto">
            <slot name="actions" />
        </v-card-actions>
    </v-card>
</template>

<script setup lang="ts">
const {img, title, subtitle} = defineProps({
    img: {type: String, required: false, default: ""},
    title : {type: String, required: false, default: ""},
    subtitle: {type: String, required: false, default: ""},
    height: {type: Number, required: false, default: 300}
})
</script>