<template>
    <v-container class="text-center py-10">
      <v-row justify="center">
        <v-col cols="12" md="8">
          <h1 class="display-1 mb-4">404</h1>
          <h2 class="mb-6">Page Not Found</h2>
          <p class="text-subtitle-1 mb-6">
            The page you are looking for might have been removed, had its name changed, or is temporarily unavailable.
          </p>
          <v-btn color="primary" large @click="goHome">
            Go to Homepage
          </v-btn>
        </v-col>
      </v-row>
    </v-container>
  </template>
  
  <script lang="ts">
  import { defineComponent } from "vue";
  import { useRouter } from "vue-router";
  
  export default defineComponent({
    name: "NotFound",
    setup() {
      const router = useRouter();
  
      const goHome = () => {
        router.push({ name: "dashboard" }); // Change this to your desired default route
      };
  
      return {
        goHome,
      };
    },
  });
  </script>
  
  <style scoped>
  h1 {
    font-size: 6rem;
    font-weight: bold;
    color: #ff5252;
  }
  h2 {
    font-size: 2rem;
    font-weight: 500;
  }
  .text-subtitle-1 {
    color: #757575;
  }
  </style>
  