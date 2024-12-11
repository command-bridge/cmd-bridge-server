<template>
  <v-container>
    <h1>Devices</h1>
    <v-data-table :headers="columns" :items="devices" :items-per-page="5" class="elevation-1" item-value="id">
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
            <v-list-item @click="requestLogs(item)">
              <v-list-item-title>Request Logs</v-list-item-title>
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
import { AxiosError } from 'axios';

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

    const requestLogs = async (device: Record<string, unknown>) => {
      try {
        const result = await api.post(`/device-events/${device.id}/logs`);

        pollLogs(device.id as number, result.data.uuid);
        alert(`Logs requested for device ${device.device_hash}. An download will start when they ready.`);
      } catch (error) {
        console.error(`Failed to request logs of device ${device.id}:`, error);
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

    const pollLogs = async (deviceId: number, uuid: string) => {
      const interval = setInterval(async () => {
        try {
          // Tenta obter os logs diretamente do endpoint
          const response = await api.get(`/device-events/${deviceId}/logs/${uuid}`, { responseType: 'blob' });

          // Se o status não for 404, assume que os logs estão prontos
          clearInterval(interval);

          // Cria um link para download automático
          const blob = new Blob([response.data], { type: 'text/plain' });
          const link = document.createElement('a');
          link.href = URL.createObjectURL(blob);
          link.download = `logs-${uuid}.log`;
          document.body.appendChild(link);
          link.click();
          document.body.removeChild(link);

          alert('Logs downloaded successfully.');
        } catch (err) {

          const error = err as AxiosError;

          if (error.response && error.response.status === 404) {
            // Continua tentando se o status for 404 (logs ainda não prontos)
            console.log('Logs not ready yet. Retrying...');
          } else {
            // Interrompe o polling em caso de outros erros
            clearInterval(interval);
            console.error('Error fetching logs:', error);
          }
        }
      }, 3000); // Consulta a cada 3 segundos
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
      requestLogs,
    };
  },
});
</script>
