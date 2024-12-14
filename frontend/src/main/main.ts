import { createApp } from 'vue';
import App from './App.vue';

import authStore from './stores/auth.store';
import alertPlugin from './component-plugins/alert.plugin';
import { vuetify } from './vuetify';

authStore.loadTokenFromStorage();

const app = createApp(App);
app.use(vuetify);
app.use(alertPlugin);
app.mount('#app');