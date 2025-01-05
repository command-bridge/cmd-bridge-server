import { createApp } from 'vue';
import App from './App.vue';

import authStore from './stores/auth.store';
import alertPlugin from './component-plugins/alert.plugin';
import { vuetify } from './vuetify';
import router from './router';

async function initializeApp() {
    authStore.loadTokenFromStorage(); // Ensure store is initialized before starting app
  
    const app = createApp(App);
    app.use(router); // Register Vue Router
    app.use(alertPlugin);
    app.use(vuetify);
    app.mount('#app');
  }
  
  initializeApp();