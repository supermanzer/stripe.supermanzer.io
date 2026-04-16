<template>
  <v-card class="pa-5" flat>
    <v-row>
      <slot name="header"/>
    </v-row>
    <v-row>
      <v-col cols="12" md="5">
        <slot name="left" />
      </v-col>
      <v-col cols="12" md="7" >
        <slot name="right" />
      </v-col>
    </v-row>
  </v-card>
</template>
