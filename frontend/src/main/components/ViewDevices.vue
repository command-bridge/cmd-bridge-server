<template>
  <v-container>
    <h1>Devices</h1>
    <v-data-table
      :headers="headers"
      :items="devices"
      :items-per-page="5"
      class="elevation-1"
      item-value="id"
    >
      <template #top>
        <v-toolbar flat>
          <v-toolbar-title>Device List</v-toolbar-title>
          <v-spacer />
          <v-btn color="primary" @click="fetchDevices">Refresh</v-btn>
          <v-btn color="success" @click="openCreateDeviceModal">Create New Device</v-btn>
        </v-toolbar>
      </template>
    </v-data-table>

    <!-- Create Device Modal -->
    <v-dialog v-model="isCreateDeviceModalOpen" max-width="500px">
      <v-card>
        <v-card-title>Create New Device</v-card-title>
        <v-card-text>
          <v-form ref="createDeviceForm" v-model="isFormValid">
            <div class="mb-3">
              <p>Click the button below to generate an activation code and download the client:</p>
              <v-btn color="primary" @click="createDevice" :disabled="isLoading">
                {{ isLoading ? 'Creating...' : 'Generate Activation Code' }}
              </v-btn>
            </div>

            <!-- Activation Code -->
            <div v-if="activationCode">
              <p class="mt-4">Activation Code:</p>
              <v-otp-input
                v-model="activationCode"
                length="6"
                readonly
                hide-input
                class="activation-code-input"
              />
            </div>

            <!-- Download Link -->
            <div v-if="activationCode">
              <v-btn :href="downloadLink" target="_blank" color="success" class="mt-4">
                Download Client
              </v-btn>
            </div>
          </v-form>
        </v-card-text>
        <v-card-actions>
          <v-btn text @click="closeCreateDeviceModal">Cancel</v-btn>
        </v-card-actions>
      </v-card>
    </v-dialog>
  </v-container>
</template>

<script lang="ts">
import { defineComponent, ref } from 'vue';
import api from '@/api';

export default defineComponent({
  name: 'ViewDevices',
  setup() {
    // Data state
    const devices = ref([]);
    const headers = ref([
      { title: '#ID', key: 'id' },
      { title: 'Hardware ID', key: 'device_hash' },
      { title: 'Auth Token', key: 'integration_token' },
      { title: 'Active?', key: 'is_active' },
    ]);

    // Modal state
    const isCreateDeviceModalOpen = ref(false);
    const activationCode = ref<string | null>(null);
    const isLoading = ref(false);

    // Validation state
    const isFormValid = ref(false);

    // Download link
    const downloadLink = ref('https://example.com/client-download'); // Replace with the actual client download URL

    // Fetch devices
    const fetchDevices = async () => {
      try {
        const response = await api.get('/device');
        devices.value = response.data;
      } catch (error) {
        console.error('Failed to fetch devices:', error);
      }
    };

    // Open modal
    const openCreateDeviceModal = () => {
      isCreateDeviceModalOpen.value = true;
      activationCode.value = null; // Reset activation code
    };

    // Close modal
    const closeCreateDeviceModal = () => {
      isCreateDeviceModalOpen.value = false;
    };

    // Create a new device
    const createDevice = async () => {
      try {
        isLoading.value = true;
        const response = await api.post('/device');
        activationCode.value = response.data.activation_code;
      } catch (error) {
        console.error('Failed to create device:', error);
      } finally {
        isLoading.value = false;
      }
    };

    // Initial fetch
    fetchDevices();

    return {
      devices,
      headers,
      isCreateDeviceModalOpen,
      openCreateDeviceModal,
      closeCreateDeviceModal,
      activationCode,
      createDevice,
      isFormValid,
      fetchDevices,
      isLoading,
      downloadLink,
    };
  },
});
</script>

<style scoped>
.activation-code-input {
  display: flex;
  justify-content: center;
  margin-top: 10px;
}
</style>
