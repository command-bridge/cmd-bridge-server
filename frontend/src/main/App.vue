<template>
  <v-app>
    <!-- Show Login Screen when not authenticated -->
    <LoginScreen v-if="!isAuthenticated" @authenticated="isAuthenticated = true" />

    <!-- Show Layout when authenticated -->
    <div v-else>
      <MenuBar :menuItems="menuItems" @navigate="handleNavigation" @logout="handleLogout"/>
      <v-main>
        <v-container>
          <component v-if="currentComponent" :is="currentComponent" />
          <v-progress-circular v-else indeterminate color="primary" />
        </v-container>
      </v-main>
    </div>
  </v-app>
</template>

<!-- eslint-disable @typescript-eslint/no-explicit-any -->
<script lang="ts">
import { defineComponent, ref, shallowRef } from 'vue';
import LoginScreen from './components/LoginScreen.vue';
import MenuBar from './components/MenuBar.vue';

export default defineComponent({
  name: 'App',
  components: {
    LoginScreen,
    MenuBar,
  },
  setup() {
    const isAuthenticated = ref<boolean>(!!localStorage.getItem('authToken'));
    const currentRoute = ref<string>('dashboard');

    // `shallowRef` to store the resolved Vue component
    const currentComponent = shallowRef<any>(null);

    // Define menu items
    const menuItems = ref([
      { label: 'Dashboard', route: 'dashboard' },
      { label: 'Environments', route: 'environments' },
      { label: 'Devices', route: 'devices' },
    ]);

    // Define route-to-component mapping
    const routes: Record<string, () => Promise<typeof import('*.vue')>> = {
      dashboard: () => import('./components/ViewDashboard.vue'),
      environments: () => import('./components/ViewEnvironments.vue'),
      devices: () => import('./components/ViewDevices.vue'),
    };

    // Function to load and resolve the component
    const loadComponent = async (route: string) => {
      if (routes[route]) {
        const component = await routes[route]();
        currentComponent.value = component.default;
      } else {
        currentComponent.value = null; // Handle unknown routes
      }
    };

    // Handle navigation
    const handleNavigation = async (route: string) => {
      currentRoute.value = route;
      await loadComponent(route);
    };

    const handleLogout = () => {
      // Clear token from localStorage
      localStorage.removeItem('authToken');

      // Reset authentication state
      isAuthenticated.value = false;
    };    

    // Load the initial route on app startup
    loadComponent(currentRoute.value);

    return {
      handleLogout,
      isAuthenticated,
      currentRoute,
      currentComponent,
      menuItems,
      handleNavigation,
    };
  },
});
</script>
