import HomeView from '@/views/HomeView.vue';
import { createRouter, createWebHistory } from 'vue-router';

import auth from '../auth/auth';

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    {
      path: "/",
      name: "home",
      component: HomeView,
    },
    {
      path: "/about",
      name: "about",
      meta: {
        authName: auth.authName,
      },
      component: () => import("@/views/AboutView.vue"),
    },
  ],
});

auth.useRouter(router);

export default router;
