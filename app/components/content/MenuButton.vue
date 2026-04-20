<template>
    <v-menu location="bottom end">
        <template #activator="{props: menu}">
            <v-tooltip :text="tooltipText">
                <template #activator="{props: tipProp}">
                    <v-btn v-bind="mergeProps(menu, tipProp)" density="compact" :icon="props.icon" :color="btnColor"/>
                </template>
            </v-tooltip>
        </template>
        <v-card class="pa-4" max-width="400" :color="cardColor">
            <slot/>
        </v-card>
    </v-menu>
</template>

<script setup lang="ts">
import { mergeProps } from 'vue';

    const props = defineProps({
        icon: {type: String, required: false, default: "mdi-information-outline"},
        tooltipText: {type: String, required: false, default: "Information"},
        cardText: {type: String, required: false, default: ""},
        btnColor: {type: String, required: false, default: "light-blue"},
        cardColor: {type: String, required: false, default: ""}
    })
</script>