<script setup>
import { RouterView } from 'vue-router';
import NavigationDrawer from './components/NavigationDrawer.vue';
import AppBar from './components/AppBar.vue';
</script>

<template>
  <v-responsive class="border rounded">
    <v-app style="height: 100% !important">
      <NavigationDrawer/>
      <AppBar/>
      <v-main>
        <v-col class="pa-8" style="max-height: 94vh; overflow: auto !important;">
          <RouterView />
        </v-col>
      </v-main>
    </v-app>
  </v-responsive>
</template>
