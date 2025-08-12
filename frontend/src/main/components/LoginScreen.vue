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
        <form @submit.prevent="handleLogin" name="loginForm" method="post">
          <v-text-field
            v-model="username"
            label="Username"
            outlined
            required
            autocomplete="username"
            name="username"
            id="username"
          />
          <v-text-field
            v-model="password"
            label="Password"
            outlined
            type="password"
            required
            autocomplete="current-password"
            name="password"
            id="password"
          />
          
          <!-- Keep connected checkbox -->
          <v-checkbox
            v-model="keepConnected"
            label="Manter conectado"
            color="primary"
            hide-details
            class="mb-4"
          />
          
          <v-btn type="submit" color="primary" block>Login</v-btn>
        </form>
      </v-card-text>
    </v-card>
  </v-container>
</template>

<script lang="ts">
import { defineComponent, ref, onMounted } from 'vue';
import { useRouter } from 'vue-router'; // Import useRouter for navigation
import api from '@/api';
import { AxiosError } from 'axios';
import authStore from '../stores/auth.store';

export default defineComponent({
  name: 'LoginScreen',
  setup() {
    const username = ref<string>('');
    const password = ref<string>('');
    const keepConnected = ref<boolean>(false);
    const errorMessage = ref<string | null>(null); // Error message state

    const router = useRouter(); // Initialize the Vue Router instance

    // Load saved credentials on component mount
    onMounted(() => {
      const savedKeepConnected = localStorage.getItem('keepConnected');
      
      if (savedKeepConnected) {
        keepConnected.value = JSON.parse(savedKeepConnected);
      }
    });

    const handleLogin = async () => {
      try {
        errorMessage.value = null; // Clear previous error messages
        const result = await api.post('/user/login', {
          user_name: username.value,
          password: password.value,
          keepConnected: keepConnected.value,
        });

        const { token, refreshToken } = result.data;

        // Debug: Show new token info
        try {
          const decoded = authStore.state.decodedToken || JSON.parse(atob(token.split('.')[1]));
          const currentTime = Math.floor(Date.now() / 1000);
          const expiresIn = decoded.exp - currentTime;
          console.log('New token received:', {
            expiresIn: `${Math.floor(expiresIn / 3600)}h ${Math.floor((expiresIn % 3600) / 60)}m`,
            expiresAt: new Date(decoded.exp * 1000).toLocaleString(),
            hasRefreshToken: !!refreshToken
          });
        } catch (e) {
          console.log('Error decoding new token:', e);
        }

        // Save keep connected preference
        localStorage.setItem('keepConnected', JSON.stringify(keepConnected.value));

        // Save the tokens to the store with keep connected info
        if (refreshToken) {
          authStore.setTokens(token, refreshToken, keepConnected.value);
        } else {
          authStore.setToken(token, keepConnected.value);
        }

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
      keepConnected,
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
