import { createRouter, createWebHistory, RouteRecordRaw } from 'vue-router';
import LoginScreen from '@components/LoginScreen.vue';
import ViewDashboard from '@components/ViewDashboard.vue';
import ViewEnvironments from '@components/ViewEnvironments.vue';
import ViewDevices from '@components/ViewDevices.vue';

const routes: Array<RouteRecordRaw> = [
  {
    path: '/login',
    name: 'Login',
    component: LoginScreen,
    meta: { requiresAuth: false },
  },
  {
    path: '/',
    name: 'Root',
    component: () => import('@layouts/DefaultLayout.vue'), // Default layout
    meta: { requiresAuth: true }, // All child routes require authentication
    children: [
      {
        path: '', // Default child route
        name: 'Dashboard',
        component: ViewDashboard,
      },
      {
        path: 'environments',
        name: 'Environments',
        component: ViewEnvironments,
        meta: { requiresAdmin: true }, // Only admins can access
      },
      {
        path: 'devices',
        name: 'Devices',
        component: ViewDevices,
      }
    ],
  },
  {
    path: '/:pathMatch(.*)*',
    name: 'NotFound',
    component: () => import('@components/NotFound.vue'),
  },
];

const router = createRouter({
  history: createWebHistory(),
  routes,
});

// Global navigation guard for authentication and admin validation
router.beforeEach(async (to, from, next) => {
  const authStore = await import('@stores/auth.store'); // Import store dynamically
  const isAuthenticated = authStore.default.isAuthenticated();

  // Handle routes that require authentication
  if (to.meta.requiresAuth && !isAuthenticated) {
    return next({ name: 'Login' });
  }

  // Handle admin-only routes
  if (to.meta.requiresAdmin && !authStore.default.state.decodedToken?.is_admin) {
    alert('Access denied. Admins only.');
    return next(false); // Cancel navigation
  }

  next(); // Allow navigation
});

export default router;
