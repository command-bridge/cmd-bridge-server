<template>
  <v-container>
    <component :is="currentComponent" />
  </v-container>
</template>

<script lang="ts">
import { defineComponent, PropType } from 'vue';

export default defineComponent({
  name: 'ContentArea',
  props: {
    currentComponent: {
      type: Object as PropType<unknown>, // Dynamic component type
      required: true,
    },
  },
});
</script>