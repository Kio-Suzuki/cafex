<script>
import router from "@/router";

  export default {
    name: 'NavigationDrawer',
    data () {
      return {
        drawer: true,
        rail: false,
      }
    },
    methods: {
    }
  }
</script>

<template>
    <v-navigation-drawer
        color="var(--blue-primary)"
        v-model="drawer"
        :rail="rail"
        permanent
        @click="rail = false"
    >
        <v-list-item
          title="admin@utfpr.edu.br"
          height="64px"
          nav
          style="color: var(--orange-primary)"
        >
            <template v-slot:prepend>
              <v-avatar color="var(--orange-primary)">
                <span class="text-h6" style="color: #FFF">A</span>
              </v-avatar>
            </template>
            <template v-slot:append>
                <v-btn
                icon="mdi-chevron-left"
                variant="text"
                @click.stop="rail = !rail"
                color="var(--orange-primary)"
                ></v-btn>
            </template>
        </v-list-item>

        <v-divider></v-divider>

        <v-list style="height: 92% !important;" density="compact" nav>
            <div style="height: 100% !important; display: flex; flex-direction: column; justify-content: space-between;">
              <div>
                  <router-link to="/">
                      <v-list-item class="list-item-menu" prepend-icon="mdi-wrench" title="Oficinas" value="oficinas"></v-list-item>
                  </router-link>

                  <router-link to="/alunos">
                      <v-list-item class="list-item-menu" prepend-icon="mdi-account" title="Alunos" value="alunos"></v-list-item>
                  </router-link>

                  <router-link to="/consulta">
                      <v-list-item class="list-item-menu" prepend-icon="mdi-magnify" title="Consulta" value="consulta"></v-list-item>
                  </router-link>
              </div>
          </div>
        </v-list>
    </v-navigation-drawer>
  </template>

<style>
a{
    text-decoration: none !important;
}
.list-item-menu{
  color: var(--orange-primary) !important;
}
.list-item-menu:hover {
  background-color: transparent !important;
}
</style>