import { createApp } from 'vue';
import ConfigurationSettings from './ConfigurationSettings.vue';

import { createVuetify } from 'vuetify';
import 'vuetify/styles'; // Global Vuetify styles
import * as components from 'vuetify/components';
import * as directives from 'vuetify/directives';

const vuetify = createVuetify({
  components,
  directives,
});

const app = createApp(ConfigurationSettings);
app.use(vuetify);
app.mount('#app');