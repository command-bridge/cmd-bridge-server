<template>
  <v-dialog v-model="isVisible" persistent max-width="400">
    <v-card>
      <v-card-title class="text-h6">{{ title }}</v-card-title>
      <v-card-text>{{ message }}</v-card-text>
      <v-card-actions>
        <v-spacer></v-spacer>
        <v-btn color="primary" text @click="confirm">OK</v-btn>
      </v-card-actions>
    </v-card>
  </v-dialog>
</template>

<script lang="ts">
import { defineComponent, ref } from 'vue';

export default defineComponent({
  name: 'CustomAlert',
  props: {
    title: {
      type: String,
      default: 'Alert',
    },
    message: {
      type: String,
      required: true,
    },
  },
  emits: ['confirm'],
  setup(_, { emit }) {
    const isVisible = ref(true);

    const confirm = () => {
      isVisible.value = false;
      emit('confirm');
    };

    return { isVisible, confirm };
  },
});
</script>