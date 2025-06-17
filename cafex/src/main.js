import './assets/main.css';

import { createApp } from 'vue';

import App from './App.vue';
import router from './router';
import vuetify from './plugins/vuetify';
import Toaster from "@meforma/vue-toaster";

const app = createApp(App)

app.use(router)
app.use(vuetify)
app.use(Toaster)

app.mount('#app')
