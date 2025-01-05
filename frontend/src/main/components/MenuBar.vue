<template>
  <v-app-bar app>
    <v-toolbar-title>Command-Bridge</v-toolbar-title>
    <v-spacer />
    <!-- Render menu items -->
    <v-btn
      v-for="(item, index) in menuItems"
      :key="index"
      text
      @click="navigate(item.route)"
    >
      {{ item.label }}
    </v-btn>
    <!-- Logout button -->
    <v-btn text color="error" @click="logout">Logout</v-btn>
  </v-app-bar>
</template>

<script lang="ts">
import { defineComponent, PropType } from 'vue';
import { useRouter } from 'vue-router';

interface MenuItem {
  label: string;
  route: string;
}

export default defineComponent({
  name: 'MenuBar',
  props: {
    menuItems: {
      type: Array as PropType<MenuItem[]>,
      required: true,
    },
  },
  setup() {
    const router = useRouter();

    const navigate = (route: string) => {
      router.push({ name: route }).catch((err) => {
        if (err.name !== 'NavigationDuplicated') {
          console.error('Navigation error:', err);
        }
      });
    };

    const logout = () => {
      // Clear auth token and redirect to the login screen
      localStorage.removeItem('authToken');
      router.push({ name: 'Login' });
    };

    return {
      navigate,
      logout,
    };
  },
});
</script>
