<template>
  <v-container class="fill-height d-flex justify-center align-center">
    <v-card class="pa-5" width="400">
      <v-card-title>Login</v-card-title>
      <v-card-text>
        <!-- Display error message -->
        <v-alert
          v-if="errorMessage"
          type="error"
          border="start"
          prominent
          class="mb-4"
        >
          {{ errorMessage }}
        </v-alert>

        <!-- Login Form -->
        <v-form @submit.prevent="handleLogin">
          <v-text-field
            v-model="username"
            label="Username"
            outlined
            required
          />
          <v-text-field
            v-model="password"
            label="Password"
            outlined
            type="password"
            required
          />
          <v-btn type="submit" color="primary" block>Login</v-btn>
        </v-form>
      </v-card-text>
    </v-card>
  </v-container>
</template>

<script lang="ts">
import { defineComponent, ref } from 'vue';
import { useRouter } from 'vue-router'; // Import useRouter for navigation
import api from '@/api';
import { AxiosError } from 'axios';
import authStore from '../stores/auth.store';

export default defineComponent({
  name: 'LoginScreen',
  setup() {
    const username = ref<string>('');
    const password = ref<string>('');
    const errorMessage = ref<string | null>(null); // Error message state

    const router = useRouter(); // Initialize the Vue Router instance

    const handleLogin = async () => {
      try {
        errorMessage.value = null; // Clear previous error messages
        const result = await api.post('/user/login', {
          user_name: username.value,
          password: password.value,
        });

        const { token } = result.data;

        // Save the token to the store
        authStore.setToken(token);

        // Redirect to the Dashboard
        router.push({ name: 'Dashboard' });
      } catch (error) {
        // Display a user-friendly error message
        if (
          error instanceof AxiosError &&
          error.response &&
          [400, 401].includes(error.response.status)
        ) {
          errorMessage.value =
            typeof error.response.data.message === 'string'
              ? error.response.data.message
              : error.response.data.message[0];
        } else {
          errorMessage.value = 'An unexpected error occurred. Please try later.';
        }
        console.error('Login error:', error);
      }
    };

    return {
      username,
      password,
      errorMessage,
      handleLogin,
    };
  },
});
</script>

<style>
.fill-height {
  height: 100vh;
}
</style>
