<template>
  <v-container>
    <h1>Devices</h1>
    <v-data-table
      :headers="columns"
      :items="filteredDevices"
      :items-per-page="9999"
      class="elevation-1"
      item-value="id"
    >
      <template #bottom></template>
      <template #top>
        <v-toolbar flat>
          <v-toolbar-title>Device List</v-toolbar-title>
          <v-spacer />
          <v-text-field
            v-model="searchFilter"
            prepend-inner-icon="mdi-magnify"
            label="Filter by any column"
            single-line
            hide-details
            clearable
            density="compact"
            class="filter-field"
            style="max-width: 280px;"
          />
          <v-btn color="primary" @click="fetchTableData">Refresh</v-btn>
          <v-btn color="success" @click="openCreateDeviceModal">Create New</v-btn>
          <v-btn color="info" @click="openConfirmCheckUpdatesAll">Check Updates for All</v-btn>
        </v-toolbar>
      </template>

      <!-- Custom columns -->
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
            <v-list-item
              v-for="(action, index) in pluginActions"
              :key="index"
              @click="action.callback(item)"
            >
              <v-list-item-title>
                {{ action.label }}
              </v-list-item-title>
            </v-list-item>
          </v-list>
        </v-menu>
      </template>
    </v-data-table>

    <!-- Create Device Modal -->
    <ModalCreateDevice v-model:isOpen="isCreateDeviceModalOpen" />

    <!-- Confirm Check Updates for All -->
    <v-dialog v-model="showConfirmCheckUpdatesAll" persistent max-width="420">
      <v-card>
        <v-card-title class="text-h6">Check updates for all devices?</v-card-title>
        <v-card-text>
          This will send an update check request to every device that is currently online.
          Do you want to continue?
        </v-card-text>
        <v-card-actions>
          <v-spacer />
          <v-btn color="grey" variant="text" @click="showConfirmCheckUpdatesAll = false">Cancel</v-btn>
          <v-btn color="primary" variant="text" @click="confirmCheckUpdatesForAll">Confirm</v-btn>
        </v-card-actions>
      </v-card>
    </v-dialog>

    <!-- Check Updates Progress Modal -->
    <v-dialog v-model="showCheckUpdatesProgress" persistent max-width="560" scrollable>
      <v-card>
        <v-card-title class="text-h6">Check updates – progress</v-card-title>
        <v-card-text class="pa-0">
          <v-list v-if="checkUpdatesProgressList.length > 0" density="compact">
            <v-list-item
              v-for="entry in checkUpdatesProgressList"
              :key="String(entry.device.id)"
              class="check-updates-progress-item"
            >
              <template #prepend>
                <v-icon v-if="entry.status === 'pending'" color="grey" size="small" class="mr-2">mdi-clock-outline</v-icon>
                <v-icon v-else-if="entry.status === 'success'" color="success" size="small" class="mr-2">mdi-check-circle</v-icon>
                <v-icon v-else color="error" size="small" class="mr-2">mdi-close-circle</v-icon>
              </template>
              <v-list-item-title>{{ entry.device.device_hash ?? entry.device.id }}</v-list-item-title>
              <v-list-item-subtitle>
                <span v-if="entry.status === 'pending'">Waiting…</span>
                <span v-else-if="entry.status === 'success'">Update check sent</span>
                <span v-else>Failed</span>
              </v-list-item-subtitle>
            </v-list-item>
          </v-list>
          <p v-else class="pa-4 text-medium-emphasis">No online devices to check.</p>
        </v-card-text>
        <v-card-actions>
          <v-spacer />
          <v-btn color="primary" variant="text" @click="closeCheckUpdatesProgress">Close</v-btn>
        </v-card-actions>
      </v-card>
    </v-dialog>
  </v-container>
</template>

<script lang="ts">
import { defineComponent, ref, onMounted, computed } from 'vue';
import api from '@/api';
import ModalCreateDevice from './ModalCreateDevice.vue';
import { AxiosError } from 'axios';
import { getDeviceActions } from '@plugins/device-actions-plugin';

export default defineComponent({
  name: 'ViewDevices',
  components: {
    ModalCreateDevice,
  },
  setup() {
    const columns = ref([]);
    const devices = ref<Record<string, unknown>[]>([]);
    const searchFilter = ref('');
    const isCreateDeviceModalOpen = ref(false);
    const showConfirmCheckUpdatesAll = ref(false);
    const showCheckUpdatesProgress = ref(false);
    type UpdateStatus = 'pending' | 'success' | 'failed';
    const checkUpdatesProgressList = ref<{ device: Record<string, unknown>; status: UpdateStatus }[]>([]);
    const pluginActions = computed(() => getDeviceActions());

    const filteredDevices = computed(() => {
      const q = searchFilter.value.trim().toLowerCase();
      if (!q) return devices.value;
      return devices.value.filter((item) =>
        Object.values(item).some((val) =>
          String(val ?? '').toLowerCase().includes(q)
        )
      );
    });

    const fetchTableData = async () => {
      try {
        const response = await api.get('/device');
        columns.value = response.data.columns;
        devices.value = response.data.data;
      } catch (error) {
        console.error('Failed to fetch table data:', error);
      }
    };

    const openCreateDeviceModal = () => {
      isCreateDeviceModalOpen.value = true;
    };

    const checkUpdates = async (device: Record<string, unknown>, options?: { silent?: boolean }) => {
      try {
        await api.post(`/device-events/${device.id}/check-updates`);
        if (!options?.silent) {
          alert(`Update check initiated for device ${device.device_hash}`);
        }
        return true;
      } catch (error) {
        console.error(`Failed to check updates for device ${device.id}:`, error);
        return false;
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
        alert(`Logs requested for device ${device.device_hash}. A download will start when ready.`);
      } catch (error) {
        console.error(`Failed to request logs of device ${device.id}:`, error);
      }
    };

    const openConfirmCheckUpdatesAll = () => {
      showConfirmCheckUpdatesAll.value = true;
    };

    const confirmCheckUpdatesForAll = async () => {
      showConfirmCheckUpdatesAll.value = false;
      const onlineDevices = devices.value.filter((d) => d.is_online);
      if (onlineDevices.length === 0) {
        checkUpdatesProgressList.value = [];
        showCheckUpdatesProgress.value = true;
        return;
      }
      checkUpdatesProgressList.value = onlineDevices.map((device) => ({
        device,
        status: 'pending' as UpdateStatus,
      }));
      showCheckUpdatesProgress.value = true;
      for (let i = 0; i < checkUpdatesProgressList.value.length; i++) {
        const entry = checkUpdatesProgressList.value[i];
        const ok = await checkUpdates(entry.device, { silent: true });
        entry.status = ok ? 'success' : 'failed';
        checkUpdatesProgressList.value = [...checkUpdatesProgressList.value];
      }
    };

    const closeCheckUpdatesProgress = () => {
      showCheckUpdatesProgress.value = false;
      checkUpdatesProgressList.value = [];
    };

    const pollLogs = async (deviceId: number, uuid: string) => {
      const interval = setInterval(async () => {
        try {
          const response = await api.get(`/device-events/${deviceId}/logs/${uuid}`, { responseType: 'blob' });
          clearInterval(interval);
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
            console.log('Logs not ready yet. Retrying...');
          } else {
            clearInterval(interval);
            console.error('Error fetching logs:', error);
          }
        }
      }, 3000);
    };

    onMounted(fetchTableData);

    return {
      columns,
      devices,
      searchFilter,
      filteredDevices,
      isCreateDeviceModalOpen,
      openCreateDeviceModal,
      fetchTableData,
      checkUpdates,
      restartDevice,
      openConfirmCheckUpdatesAll,
      confirmCheckUpdatesForAll,
      requestLogs,
      pluginActions,
      showConfirmCheckUpdatesAll,
      showCheckUpdatesProgress,
      checkUpdatesProgressList,
      closeCheckUpdatesProgress,
    };
  },
});
</script>
