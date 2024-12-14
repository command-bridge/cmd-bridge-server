<template>
  <v-container>
    <h1>Environments</h1>
    <v-data-table
      :headers="headers"
      :items="environments"
      :items-per-page="5"
      class="elevation-1"
      item-value="id"
    >
      <template #top>
        <v-toolbar flat>
          <v-toolbar-title>Environment List</v-toolbar-title>
          <v-spacer />
          <v-btn color="primary" @click="fetchEnvironments">Refresh</v-btn>
          <v-btn color="success" @click="openCreateModal">Create New</v-btn>
        </v-toolbar>
      </template>

      <!-- Render db_port column -->
      <template #item.db_port="{ item }">
        {{ item.db_port || 'N/A' }}
      </template>

      <!-- Render actions column -->
      <template #item.actions="{ item }">
        <v-menu bottom left>
          <template #activator="{ props }">
            <v-btn v-bind="props" icon>
              <v-icon>mdi-dots-vertical</v-icon>
            </v-btn>
          </template>
          <v-list>
            <v-list-item @click="useEnvironment(item)">
              <v-list-item-title>Use this</v-list-item-title>
            </v-list-item>
          </v-list>
        </v-menu>
      </template>
    </v-data-table>

    <ModalEnvironment
      v-model:isOpen="isEnvironmentModalOpen"
      :initialData="selectedEnvironment"
      :mode="modalMode"
      @refresh="fetchEnvironments"
    />    
  </v-container>
</template>

<script lang="ts">
import { defineComponent, getCurrentInstance, ref } from 'vue';
import api from '@/api';
import ModalEnvironment from './ModalEnvironment.vue';
import authStore from '../stores/auth.store';

export default defineComponent({
  name: 'ViewEnvironments',
  components: {
    ModalEnvironment,
  },
  setup() {
    const instance = getCurrentInstance();
    const isEnvironmentModalOpen = ref(false);
    const selectedEnvironment = ref({});
    const modalMode = ref('create');

    // Data state
    const environments = ref([]);
    const headers = ref([
      { title: '#ID', key: 'id' },
      { title: 'Name', key: 'name' },
      { title: 'Host', key: 'db_host' },
      { title: 'Port', key: 'db_port' },
      { title: 'Type', key: 'db_type' },
      { title: 'Database', key: 'db_database' },
      { title: 'Actions', key: 'actions', sortable: false }, // Add actions column
    ]);

    const openCreateModal = () => {
      selectedEnvironment.value = {};
      modalMode.value = 'create';
      isEnvironmentModalOpen.value = true;
    };

    // Fetch data from the API
    const fetchEnvironments = async () => {
      try {
        const response = await api.get('/admin/environment');
        environments.value = response.data; // Populate environments
      } catch (error) {
        console.error('Failed to fetch environments:', error);
        // Optionally, display an error message or alert
      }
    };

    // Handle the "Use this" action
    const useEnvironment = async (item: Record<string, string>) => {
      try {
        const response = await api.get(`/admin/environment/${item.id}/use`);

        const { token } = response.data;

        authStore.setToken(token);

        instance?.appContext.config.globalProperties.$alert({
          title: 'Environment changed',
          message: `Now you navigating in ${item.name} environment!`,
        });
      } catch (error) {
        console.error('Failed to use environment:', error);
      }
    };

    // Initial fetch
    fetchEnvironments();

    return {
      isEnvironmentModalOpen,
      selectedEnvironment,
      modalMode,
      openCreateModal,
      environments,
      headers,
      fetchEnvironments,
      useEnvironment,
    };
  },
});
</script>
