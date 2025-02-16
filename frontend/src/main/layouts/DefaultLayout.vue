<template>
  <div>
    <MenuBar :menuItems="filteredMenuItems" @logout="handleLogout" />
    <v-main>
      <v-container>
        <router-view />
      </v-container>
    </v-main>
  </div>
</template>
  
  <script lang="ts">
  import { defineComponent, computed } from 'vue';
  import MenuBar from '@components/MenuBar.vue';
  import authStore from '@stores/auth.store';
import { getMenuItems } from '../plugins/menu-item-plugin';
  
  export default defineComponent({
    name: 'DefaultLayout',
    components: { MenuBar },
    setup() {
      const filteredMenuItems = computed(() => {
        return [
          { label: 'Dashboard', route: 'Dashboard' },
          { label: 'Environments', route: 'Environments', requiresAdmin: true },
          { label: 'Devices', route: 'Devices' },
          ...getMenuItems()
        ].filter((item) => !item.requiresAdmin || authStore.state.decodedToken?.is_admin);
      });
  
      const handleLogout = () => {
        localStorage.removeItem('authToken');
        authStore.clearToken();
        window.location.href = '/login'; // Redirect to login
      };
  
      return { filteredMenuItems, handleLogout };
    },
  });
  </script>
  