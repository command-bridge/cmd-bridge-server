<template>
  <v-dialog v-model="localIsOpen" max-width="600px">
    <v-card>
      <v-card-title>{{ mode === 'create' ? 'Create Environment' : 'Edit Environment' }}</v-card-title>
      <v-card-text>
        <v-form ref="environmentForm" v-model="isFormValid">
          <v-text-field v-model="config.name" label="Environment Name" outlined required
            :error-messages="errors.name" />
          <v-switch v-model="config.useDefaultDbCredentials" label="Use Default Database Credentials"
            outlined />
          <div v-if="!config.useDefaultDbCredentials">
            <v-select v-model="config.db_type" :items="dbEngines" item-title="text" item-value="value"
              label="Environment Database Engine" outlined />
            <v-text-field v-model="config.db_url" label="Environment Host" outlined
              :error-messages="errors.db_url" />
            <v-text-field v-model="config.db_user" label="Environment User" outlined
              :error-messages="errors.db_user" />
            <v-text-field v-model="config.db_password" label="Environment Password" type="password" outlined
              :error-messages="errors.db_password" />
          </div>
        </v-form>
      </v-card-text>
      <v-card-actions>
        <v-btn text @click="close">Cancel</v-btn>
        <v-btn color="primary" :disabled="!isFormValid" @click="handleSubmit">
          {{ mode === 'create' ? 'Create' : 'Save' }}
        </v-btn>
      </v-card-actions>
    </v-card>
  </v-dialog>
</template>

<script lang="ts">
import { defineComponent, ref, watch } from 'vue';
import api from '@/api';

export default defineComponent({
  name: 'ModalEnvironment',
  props: {
    isOpen: {
      type: Boolean,
      required: true,
    },
    initialData: {
      type: Object,
      default: () => ({}),
    },
    mode: {
      type: String,
      default: 'create', // Can be 'create' or 'edit'
    },
  },
  emits: ['update:isOpen', 'refresh'],
  setup(props, { emit }) {
    // Reactive state
    const localIsOpen = ref(props.isOpen);
    const isFormValid = ref(false);

    // Config and error state
    const config = ref({
      name: '',
      useDefaultDbCredentials: true,
      db_type: null,
      db_url: '',
      db_user: '',
      db_password: '',
    });

    const errors = ref<{
      name: string | null;
      db_url: string | null;
      db_user: string | null;
      db_password: string | null;
    }>({
      name: null,
      db_url: null,
      db_user: null,
      db_password: null,
    });

    const dbEngines = ref([
      { text: 'PostgreSQL', value: 'postgres' },
      { text: 'MySQL', value: 'mysql' },
      { text: 'MariaDB', value: 'mariadb' },
      { text: 'SQL Server', value: 'mssql' },
    ]);

    // Watchers for syncing props and form validation
    watch(
      () => props.isOpen,
      (newValue) => {
        localIsOpen.value = newValue;
        if (newValue && props.mode === 'edit') {
          Object.assign(config.value, props.initialData);
        }
      }
    );

    watch(localIsOpen, (newValue) => {
      emit('update:isOpen', newValue);
    });

    const close = () => {
      localIsOpen.value = false;
    };

    const validateForm = () => {
      const newErrors = {
        name: !config.value.name ? 'Environment Name is required' : null,
        db_url: !config.value.useDefaultDbCredentials && !config.value.db_url ? 'Database Host is required' : null,
        db_user: !config.value.useDefaultDbCredentials && !config.value.db_user ? 'Database User is required' : null,
        db_password: !config.value.useDefaultDbCredentials && !config.value.db_password ? 'Database Password is required' : null,
      };
      errors.value = newErrors;
      isFormValid.value = !Object.values(newErrors).some((error) => error !== null);
    };

    watch(config, validateForm, { deep: true });

    // Submit handler
    const handleSubmit = async () => {
      try {
        if (!isFormValid.value) return;
        if (props.mode === 'create') {
          await api.post('/admin/environment', config.value);
        } else {
          await api.put(`/admin/environment/${config.value.name}`, config.value);
        }
        emit('refresh'); // Notify parent to refresh the environment list
        close();
      } catch (error) {
        console.error('Failed to save environment:', error);
      }
    };

    return {
      localIsOpen,
      config,
      errors,
      dbEngines,
      isFormValid,
      close,
      handleSubmit,
    };
  },
});
</script>

<style scoped>
/* Custom styles, if necessary */
</style>