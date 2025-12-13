import { useTableStorage } from '@/composables/useTableStorage'
import { useTableDataStore } from '@/stores/tableData'
import { ElMessage } from 'element-plus'
import { createRouter, createWebHistory } from 'vue-router'

const routes = [
  {
    path: '/',
    name: 'Home',
    component: () => import('@/view/customer/Home.vue'),
  },
  {
    path: '/qr/:qrCode',
    name: 'QRRedirect',
    component: () => import('@/view/customer/QRRedirect.vue'),
  },
  {
    path: '/Menu',
    name: 'Menu',
    component: () => import('@/view/customer/Menu.vue'),
    meta: { requiresTable: true },
  },
  {
    path: '/Order',
    name: 'Order',
    component: () => import('@/view/customer/Order.vue'),
    meta: { requiresTable: true },
  },
]
const router = createRouter({
  history: createWebHistory(),
  routes,
})

router.beforeEach(async (to, from, next) => {
  const { checkTableExpiry } = useTableStorage()
  const tableDataStore = useTableDataStore()
  if (to.meta.requiresTable) {
    const isValid = await checkTableExpiry()
    if (!isValid) {
      ElMessage.error('請重新掃描 QR Code')
      tableDataStore.clearTableData()

      return next({ name: 'Home' })
    }
  }
  next()
})

export default router
