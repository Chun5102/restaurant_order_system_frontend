import { createRouter, createWebHistory } from 'vue-router'

const routes = [
  {
    path: '/Table/:tableNumber',
    name: 'Table',
    component: () => import('@/view/customer/TableNumber.vue'),
  },
]
const router = createRouter({
  history: createWebHistory(),
  routes,
})

export default router
