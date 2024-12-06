<template>
  <v-container>
    <h1>Devices</h1>
    <v-data-table
      :headers="columns"
      :items="devices"
      :items-per-page="5"
      class="elevation-1"
      item-value="id"
    >
      <template #top>
        <v-toolbar flat>
          <v-toolbar-title>Device List</v-toolbar-title>
          <v-spacer />
          <v-btn color="primary" @click="fetchTableData">Refresh</v-btn>
          <v-btn color="success" @click="openCreateDeviceModal">Create New</v-btn>
          <v-btn color="info" @click="checkUpdatesForAll">Check Updates for All</v-btn>
        </v-toolbar>
      </template>

      <!-- Colunas personalizadas -->
      <template #item.is_online="{ item }">
        <v-icon :color="item.is_online ? 'green' : 'red'">
          {{ item.is_online ? 'mdi-checkbox-marked-circle' : 'mdi-close-circle' }}
        </v-icon>
      </template>

      <template #item.actions="{ item }">
        <v-menu>
          <template #activator="{ props }">
            <v-btn v-if="item.is_active" v-bind="props" icon>
              <v-icon>mdi-dots-vertical</v-icon>
            </v-btn>
          </template>
          <v-list>
            <v-list-item @click="checkUpdates(item)">
              <v-list-item-title>Check for Updates</v-list-item-title>
            </v-list-item>
            <v-list-item @click="restartDevice(item)">
              <v-list-item-title>Restart</v-list-item-title>
            </v-list-item>
          </v-list>
        </v-menu>
      </template>
    </v-data-table>

    <!-- Create Device Modal -->
    <ModalCreateDevice v-model:isOpen="isCreateDeviceModalOpen" />
  </v-container>
</template>



<script lang="ts">
import { defineComponent, ref, onMounted } from 'vue';
import api from '@/api';
import ModalCreateDevice from './ModalCreateDevice.vue';

export default defineComponent({
  name: 'ViewDevices',
  components: {
    ModalCreateDevice,
  },
  setup() {
    const columns = ref([]);
    const devices = ref<Record<string, unknown>[]>([]);
    const isCreateDeviceModalOpen = ref(false);

    // Fetch data and columns from the backend
    const fetchTableData = async () => {
      try {
        const response = await api.get('/device'); // Backend retorna colunas e dados
        columns.value = response.data.columns;
        devices.value = response.data.data;
      } catch (error) {
        console.error('Failed to fetch table data:', error);
      }
    };

    const openCreateDeviceModal = () => {
      isCreateDeviceModalOpen.value = true;
    };

    const checkUpdates = async (device: Record<string, unknown>) => {
      try {
        await api.post(`/device-events/${device.id}/check-updates`);
        alert(`Update check initiated for device ${device.device_hash}`);
      } catch (error) {
        console.error(`Failed to check updates for device ${device.id}:`, error);
      }
    };

    const restartDevice = async (device: Record<string, unknown>) => {
      try {
        await api.post(`/device-events/${device.id}/restart`);
        alert(`Restart initiated for device ${device.device_hash}`);
      } catch (error) {
        console.error(`Failed to restart device ${device.id}:`, error);
      }
    };

    const checkUpdatesForAll = async () => {
      try {
        const onlineDevices = devices.value.filter((device) => device.is_online);
        for (const device of onlineDevices) {
          await checkUpdates(device);
        }
      } catch (error) {
        console.error('Failed to check updates for all devices:', error);
      }
    };

    // Fetch data on component mount
    onMounted(fetchTableData);

    return {
      columns,
      devices,
      isCreateDeviceModalOpen,
      openCreateDeviceModal,
      fetchTableData,
      checkUpdates,
      restartDevice,
      checkUpdatesForAll,
    };
  },
});
</script>

