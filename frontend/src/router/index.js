import { createRouter, createWebHistory } from 'vue-router';
import { useAuthStore } from '../stores/authStore';
import AuthView from '../views/AuthView.vue';
import DashboardView from '../views/DashboardView.vue';
import FlashcardsView from '../views/FlashcardsView.vue';

const routes = [
  {
    path: '/',
    name: 'auth',
    component: AuthView,
  },
  {
    path: '/dashboard',
    name: 'dashboard',
    component: DashboardView,
    meta: { requiresAuth: true },
  },
  {
    path: '/dashboard/:id',
    name: 'flashcards',
    props: true,
    component: FlashcardsView,
    meta: { requiresAuth: true },
  },
];

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes,
});

router.beforeEach((to, from, next) => {
  const authStore = useAuthStore();

  authStore.checkToken();

  if (to.meta.requiresAuth && !authStore.isAuthenticated) {
    return next('/');
  }

  if (to.path === '/' && authStore.isAuthenticated) {
    return next('/dashboard');
  }

  next();
});

export default router;
