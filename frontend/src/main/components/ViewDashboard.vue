<template>
  <div class="dashboard">
    <div class="dashboard-default">
      <v-card>
        <v-card-title>Dashboard</v-card-title>
        <v-card-text>
          Welcome. Use the menu to navigate. Plugins can add widgets below.
        </v-card-text>
      </v-card>
    </div>

    <template v-for="widget in dashboardWidgets" :key="widget.id">
      <v-card class="dashboard-widget mt-4">
        <v-card-title v-if="widget.title" class="text-subtitle-1">
          {{ widget.title }}
        </v-card-title>
        <v-card-text>
          <Suspense>
            <component :is="widget.component" />
            <template #fallback>
              <div class="text-medium-emphasis">Loading…</div>
            </template>
          </Suspense>
        </v-card-text>
      </v-card>
    </template>
  </div>
</template>

<script lang="ts">
import { defineComponent, ref, onMounted, defineAsyncComponent } from 'vue';
import { getDashboardWidgets } from '@plugins/dashboard-widget-plugin';
import type { DashboardWidget } from '@plugins/dashboard-widget-plugin';

function normalizeWidget(widget: DashboardWidget): DashboardWidget {
  const component =
    typeof widget.component === 'function'
      ? defineAsyncComponent(widget.component as () => Promise<import('vue').Component>)
      : widget.component;
  return { ...widget, component };
}

export default defineComponent({
  name: 'ViewDashboard',
  setup() {
    const dashboardWidgets = ref<DashboardWidget[]>([]);
    onMounted(() => {
      dashboardWidgets.value = getDashboardWidgets().map(normalizeWidget);
    });
    return { dashboardWidgets };
  },
});
</script>

<style scoped>
.dashboard-widget + .dashboard-widget {
  margin-top: 1rem;
}
</style>
