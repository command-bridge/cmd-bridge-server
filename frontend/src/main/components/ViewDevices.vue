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
      <template #item.db_port="{ item }">
        {{ item.db_port || 'N/A' }}
      </template>
    </v-data-table>

    <!-- Create Device Modal -->
    <ModalCreateDevice v-model:isOpen="isCreateDeviceModalOpen" />
  </v-container>
</template>

<script lang="ts">
import { defineComponent, ref } from 'vue';
import api from '@/api';
import ModalCreateDevice from './ModalCreateDevice.vue'; // Import the modal component

export default defineComponent({
  name: 'ViewDevices',
  components: {
    ModalCreateDevice,
  },
  setup() {
    const devices = ref([]);
    const headers = ref([
      { title: '#ID', key: 'id' },
      { title: 'Hardware ID', key: 'device_hash' },
      { title: 'Auth Token', key: 'integration_token' },
      { title: 'Active?', key: 'is_active' },
    ]);

    const isCreateDeviceModalOpen = ref(false);

    const fetchDevices = async () => {
      try {
        const response = await api.get('/device');
        devices.value = response.data;
      } catch (error) {
        console.error('Failed to fetch devices:', error);
      }
    };

    const openCreateDeviceModal = () => {
      isCreateDeviceModalOpen.value = true;
    };

    fetchDevices();

    return {
      devices,
      headers,
      isCreateDeviceModalOpen,
      openCreateDeviceModal,
      fetchDevices,
    };
  },
});
</script>
