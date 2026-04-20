<template>
    <v-card :class="cardClass">
        <v-img 
          v-if="img.length > 0" 
          cover 
          :src="img" 
          class="px-6 align-end text-white py-4" 
          gradient="to top, rgba(0,0,0,0.7), rgba(0,0,0,0.1)" 
          :height="myImgHeight">
            <v-card-title>{{ title }}</v-card-title>
            <v-divider/>
            <v-card-subtitle>{{ subtitle }}</v-card-subtitle>
        </v-img>
        <div v-else>
            <v-card-title>{{ title }}</v-card-title>
            <v-divider/>
            <v-card-subtitle class="wrap">{{ subtitle }}</v-card-subtitle>
        </div>
        <v-card-text class="pa-2">
            <v-row no-gutters align="start">
                <v-col>
                    <slot />
                </v-col>
                <v-col v-if="$slots.info" cols="auto">
                    <slot name="info" />
                </v-col>
            </v-row>
        </v-card-text>
        <v-card-actions v-if="$slots.actions" class="px-2 py-0">
            <slot name="actions" />
        </v-card-actions>
    </v-card>
</template>

<script setup lang="ts">



const {img, title, subtitle, imgHeight, cardClass, mobileImgHeight} = defineProps({
    img: {type: String, required: false, default: ""},
    title : {type: String, required: false, default: ""},
    subtitle: {type: String, required: false, default: ""},
    imgHeight: {type: String, required: false, default: "300"},
    mobileImgHeight: {type: String, required: false, default: "100"},
    cardClass: {type: String, required: false, default: "h-100"}
})

// In some cases, like the Cancel page, we may want the hero image to take up a larger portion of the screen if there is nothing else to display.
// This is especially true on mobile so we can optimize this 
const myImgHeight = computed(() => {
    const {smAndDown} = useDisplay()
    console.log("GOT MOBILE: ", smAndDown.value)
    console.log("GOT IMG HEIGHT: ", imgHeight);
    console.log("GOT MOBILE IMG HEIGHT: ", mobileImgHeight);
    
        
    return smAndDown.value ? mobileImgHeight : imgHeight
    // return "300"
})
</script>