import { createRouter, createWebHistory } from 'vue-router'

const routes = [
  {
    path: '/:tableNumber',
    name: 'Home',
    component: () => import('@/view/customer/Home.vue'),
  },
  {
    path: '/Menu',
    name: 'Menu',
    component: () => import('@/view/customer/Menu.vue'),
  },
  {
    path: '/Orders',
    name: 'Orders',
    component: () => import('@/view/customer/Orders.vue'),
  },
]
const router = createRouter({
  history: createWebHistory(),
  routes,
})

export default router
