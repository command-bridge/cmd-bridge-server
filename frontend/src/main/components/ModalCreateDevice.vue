<template>
  <v-dialog v-model="localIsOpen" max-width="500px">
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
        <v-btn text @click="close">Cancel</v-btn>
      </v-card-actions>
    </v-card>
  </v-dialog>
</template>

<script lang="ts">
import { defineComponent, ref, watch } from 'vue';
import api from '@/api';

export default defineComponent({
  name: 'ModalCreateDevice',
  props: {
    isOpen: {
      type: Boolean,
      required: true,
    },
  },
  emits: ['update:isOpen'],
  setup(props, { emit }) {
    // Local reactive variable to sync with `isOpen` prop
    const localIsOpen = ref(props.isOpen);

    // Sync local variable with prop changes
    watch(
      () => props.isOpen,
      (newValue) => {
        localIsOpen.value = newValue;
      }
    );

    // Emit changes to parent when local variable changes
    watch(localIsOpen, (newValue) => {
      emit('update:isOpen', newValue);
    });

    const activationCode = ref<string | null>(null);
    const isLoading = ref(false);
    const isFormValid = ref(false);
    const downloadLink = ref('https://example.com/client-download'); // Replace with the actual link

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

    const close = () => {
      localIsOpen.value = false; // Close the modal locally
    };

    return {
      localIsOpen,
      activationCode,
      isLoading,
      isFormValid,
      downloadLink,
      createDevice,
      close,
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
