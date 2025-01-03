import { createRouter, createWebHistory } from 'vue-router';
import DashboardView from '../views/DashboardView.vue';
import AuthView from '../views/AuthView.vue';
import FlashcardsView from '@/views/FlashcardsView.vue';

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    {
      path: '/',
      name: 'home',
      component: AuthView
    },
    {
      path: '/dashboard',
      name: 'dashboard',
      component: DashboardView
    },
    {
      path: '/dashboard/:id',
      name: 'flashcards',
      props: true,
      component: FlashcardsView
    }
  ]
})

export default router
