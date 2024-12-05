import { createRouter, createWebHashHistory } from 'vue-router';
import CalculatorView from '@/views/CalculatorView.vue';

const routes = [
  { path: '/calculator', name: 'Calculator', component: CalculatorView },
];

const router = createRouter({
  history: createWebHashHistory(),
  routes,
});

export default router;
