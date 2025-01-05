<template>
    <v-container class="text-center py-10">
      <v-row justify="center">
        <v-col cols="12" md="8">
          <v-icon color="error" size="100" class="mb-4">mdi-alert-circle</v-icon>
          <h1 class="display-1 mb-4">Something Went Wrong</h1>
          <h2 class="mb-6">An unexpected error has occurred.</h2>
          <p class="text-subtitle-1 mb-6">
            Please try again later or contact support if the issue persists.
          </p>
          <v-btn color="primary" large @click="reloadPage">
            Reload Page
          </v-btn>
          <v-btn color="secondary" large @click="goHome" class="ml-4">
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
    name: "ErrorPage",
    setup() {
      const router = useRouter();
  
      const reloadPage = () => {
        window.location.reload();
      };
  
      const goHome = () => {
        router.push({ name: "dashboard" }); // Change this to your default route
      };
  
      return {
        reloadPage,
        goHome,
      };
    },
  });
  </script>
  
  <style scoped>
  h1 {
    font-size: 3rem;
    font-weight: bold;
    color: #d32f2f;
  }
  h2 {
    font-size: 1.5rem;
    font-weight: 500;
  }
  .text-subtitle-1 {
    color: #757575;
  }
  </style>
  