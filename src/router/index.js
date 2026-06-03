import { useTableStorage } from '@/composables/useTableStorage'
import { setStaffFromToken } from '@/service/setStaffFromToken'
import { useTableDataStore } from '@/stores/tableData'
import { ElMessage } from 'element-plus'
import { createRouter, createWebHistory } from 'vue-router'

const routes = [
  // Customer
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
    path: '/menu',
    name: 'Menu',
    component: () => import('@/view/customer/Menu.vue'),
    meta: { requiresTable: true },
  },
  {
    path: '/order',
    name: 'Order',
    component: () => import('@/view/customer/Order.vue'),
    meta: { requiresTable: true },
  },

  // Staff
  {
    path: '/login',
    name: 'Login',
    component: () => import('@/view/staff/Login.vue'),
  },
  {
    path: '/dashboard',
    name: 'Dashboard',
    component: () => import('@/view/staff/Dashboard.vue'),
    meta: { requiresAuth: true },
    children: [
      // Admin
      {
        path: '/management/tables',
        name: 'Tables',
        component: () => import('@/view/staff//admin/TableManagement.vue'),
      },
      {
        path: '/management/menus',
        name: 'Menus',
        component: () => import('@/view/staff/admin/MenuManagement.vue'),
      },
      {
        path: '/management/orders',
        name: 'Orders',
        component: () => import('@/view/staff/admin/OrderManagement.vue'),
      },
      {
        path: '/management/employees',
        name: 'Employees',
        component: () => import('@/view/staff/admin/StaffManagement.vue'),
      },

      // Menus
      {
        path: '/management/menus/addMenu',
        name: 'AddMenu',
        component: () => import('@/view/staff/menus/AddMenu.vue'),
      },
      {
        path: '/management/menus/editMenu/:id',
        name: 'EditMenu',
        component: () => import('@/view/staff/menus/EditMenu.vue'),
      },

      // Tables
      {
        path: '/management/tables/editTable/:id',
        name: 'EditTable',
        component: () => import('@/view/staff/tables/EditTable.vue'),
      },

      // Employees
      {
        path: '/management/employees/addStaff',
        name: 'AddStaff',
        component: () => import('@/view/staff/employees/AddStaff.vue'),
      },
      {
        path: '/management/employees/editStaff/:id',
        name: 'EditStaff',
        component: () => import('@/view/staff/employees/EditStaff.vue'),
      },

      //Front
      {
        path: '/front/orders',
        name: 'FrontOrders',
        component: () => import('@/view/staff/front/FrontOrders.vue'),
      },
    ],
  },
  {
    path: '/kitchen/orders',
    name: 'KitchenOrderBoard',
    component: () => import('@/view/staff/ops/OrderBoard.vue'),
    meta: { requiresAuth: true },
  },
  {
    path: '/runner/orders',
    name: 'RunnerOrderBoard',
    component: () => import('@/view/staff/ops/OrderBoard.vue'),
    meta: { requiresAuth: true },
  },
]
const router = createRouter({
  history: createWebHistory(),
  routes,
})

router.beforeEach(async (to, from, next) => {
  const { checkTableExpiry } = useTableStorage()
  const tableDataStore = useTableDataStore()

  const requiresAuth = to.matched.some((record) => record.meta.requiresAuth)

  if (to.meta.requiresTable) {
    const isValid = await checkTableExpiry()
    if (!isValid) {
      ElMessage.error('請重新掃描 QR Code')
      tableDataStore.clearTableData()

      return next({ name: 'Home' })
    }
  }

  if (requiresAuth) {
    const token = localStorage.getItem('accessToken')
    if (!token) {
      return next({ name: 'Login' })
    }

    setStaffFromToken(token)
  }
  next()
})

export default router
