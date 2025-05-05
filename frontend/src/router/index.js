import { createRouter, createWebHistory } from 'vue-router';
import { useAuth } from '../composables/useAuth';

import AuthView from '../views/AuthView.vue';
import DashboardView from '../views/DashboardView.vue';
import FlashcardsView from '../views/FlashcardsView.vue';

const routes = [
  {
    path: '/',
    name: 'auth',
    component: AuthView,
    meta: { requiresAuth: false }
  },
  {
    path: '/dashboard',
    name: 'dashboard',
    component: DashboardView,
    meta: { requiresAuth: true }
  },
  {
    path: '/dashboard/:id',
    name: 'flashcards',
    props: true,
    component: FlashcardsView,
    meta: { requiresAuth: true }
  }
];

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes
});

router.beforeEach((to, from, next) => {
  const { isAuthenticated } = useAuth();

  if (to.path === '/' && isAuthenticated.value) {
    return next('/dashboard');
  }

  if (to.meta.requiresAuth && !isAuthenticated.value) {
    return next('/');
  }

  next();
});
export default router;
