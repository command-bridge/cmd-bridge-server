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
        </v-toolbar>
      </template>
      <template #item.db_port="{ item }">
        <!-- Handle nullable db_port -->
        {{ item.db_port || 'N/A' }}
      </template>
    </v-data-table>
  </v-container>
</template>

<script lang="ts">
import { defineComponent, ref } from 'vue';
import api from '@/api';

export default defineComponent({
  name: 'ViewEnvironments',
  setup() {
    // Data state
    const environments = ref([]);
    const headers = ref([
      { title: '#ID', key: 'id' },
      { title: 'Name', key: 'name' },
      { title: 'Host', key: 'db_host' },
      { title: 'Port', key: 'db_port' },
      { title: 'Type', key: 'db_type' },
      { title: 'Database', key: 'db_database' },
    ]);

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

    // Initial fetch
    fetchEnvironments();

    return {
      environments,
      headers,
      fetchEnvironments,
    };
  },
});
</script>

<style scoped>
/* Add any custom styles if needed */
</style>
