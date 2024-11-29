import { createApp } from 'vue';
import App from './App.vue';

import { createVuetify } from 'vuetify';
import 'vuetify/styles'; // Global Vuetify styles
import * as components from 'vuetify/components';
import * as directives from 'vuetify/directives';
import '@mdi/font/css/materialdesignicons.css'; // Import MDI CSS
import authStore from './stores/auth.store';

authStore.loadTokenFromStorage();

const vuetify = createVuetify({
  components,
  directives,
  icons: {
    defaultSet: 'mdi',
  },
});

const app = createApp(App);
app.use(vuetify);
app.mount('#app');