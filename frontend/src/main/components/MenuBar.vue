<template>
  <v-app-bar app>
    <v-toolbar-title>Command-Bridge</v-toolbar-title>
    <v-spacer />
    <v-btn v-for="(item, index) in menuItems" :key="index" text @click="navigate(item.route)">
      {{ item.label }}
    </v-btn>
    <v-btn text color="error" @click="logout">Logout</v-btn>
  </v-app-bar>
</template>

<script lang="ts">
import { defineComponent, PropType } from 'vue';

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
  emits: ['navigate', 'logout'],
  setup(_, { emit }) {
    const navigate = (route: string) => {
      emit('navigate', route);
    };

    const logout = () => {
      emit('logout');
    };    

    return {
      navigate,
      logout,
    };
  },
});
</script>
