import { createApp } from 'vue';
import App from './App.vue';

import authStore from './stores/auth.store';
import alertPlugin from './component-plugins/alert.plugin';
import { vuetify } from './vuetify';
import router from './router';

async function initializeApp() {
    // Load token from storage and verify its validity
    authStore.loadTokenFromStorage(); 
  
    const app = createApp(App);
    app.use(router); // Register Vue Router
    app.use(alertPlugin);
    app.use(vuetify);
    app.mount('#app');
  }
  
  initializeApp();