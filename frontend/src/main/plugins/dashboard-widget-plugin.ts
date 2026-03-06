import type { Component } from 'vue';

export type DashboardWidget = {
  /** Unique id for the widget (e.g. plugin name + widget name). */
  id: string;
  /** Optional title shown above the widget (e.g. card title). */
  title?: string;
  /** Optional order; lower values appear first. Default 0. */
  order?: number;
  /** Vue component to render. Can be sync or async (e.g. `() => import('./MyWidget.vue')`). */
  component: Component | (() => Promise<Component>);
};

const widgets: DashboardWidget[] = [];

export const registerDashboardWidget = (widget: DashboardWidget): void => {
  widgets.push(widget);
};

export const getDashboardWidgets = (): DashboardWidget[] =>
  [...widgets].sort((a, b) => (a.order ?? 0) - (b.order ?? 0));
