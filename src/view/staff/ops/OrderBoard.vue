<template>
  <div class="kitchen-board">
    <!-- 角色顯示 -->
    <div class="top-bar">
      <div class="role-bar">目前角色：{{ roleLabel }}</div>
      <button class="logout-btn" @click="logout">登出</button>
    </div>

    <!-- 狀態統計 -->
    <div class="status-bar">
      <div v-if="role === 'kitchen'" class="status-row">
        <div>待處理：{{ count('待處理') }}</div>
        <div>準備中：{{ count('準備中') }}</div>
      </div>
      <div v-else-if="role === 'runner'">待送餐：{{ count('待送餐') }}</div>
    </div>

    <!-- 卡片 -->
    <div class="card-grid">
      <div
        v-for="order in orders"
        :key="order.id"
        class="order-card"
        :class="[statusLabel(order.orderStatus)]"
        @click="nextStatus(order)"
      >
        <div class="card-header">
          <div class="table">桌 {{ order.tableId }}</div>

          <div class="status-tag" :class="statusLabel(order.orderStatus)">
            {{ order.orderStatus }}
          </div>
        </div>

        <div class="items">
          <div v-for="(item, i) in order.orderItems" :key="i" class="item">
            {{ item.menuName }} x{{ item.quantity }}
          </div>
        </div>

        <div class="hint">點擊處理訂單</div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { useNavigation } from '@/composables/useNavigation'
import api from '@/service/api'
import { useStaffDataStore } from '@/stores/staffData'
import { ElMessage } from 'element-plus'
import { computed, onMounted, onUnmounted, ref } from 'vue'

const { goTo } = useNavigation()

const staffData = useStaffDataStore()
const role = ref('runner')

const roleLabel = computed(() => {
  if (role.value === 'kitchen') return '廚房'
  else return '送餐'
})

const orders = ref([])
let timer

const fetchOrders = async () => {
  role.value = staffData.role
  let res
  if (role.value === 'kitchen') {
    res = await api.getKitchenOrders()
  } else {
    res = await api.getRunnerOrders()
  }

  orders.value = res.data
}

const startPolling = () => {
  if (timer) return
  timer = setInterval(fetchOrders, 3000)
}

// 👉 自動依角色決定流程
const nextStatus = async (order) => {
  if (role.value === 'kitchen') {
    if (order.orderStatus === '待處理')
      await api.updateOrder({ id: order.id, orderStatus: '準備中' })
    else if (order.orderStatus === '準備中')
      await api.updateOrder({ id: order.id, orderStatus: '待送餐' })
  } else {
    if (order.orderStatus === '待送餐')
      await api.updateOrder({ id: order.id, orderStatus: '已完成' })
  }

  await fetchOrders()
}

const statusLabel = (status) => {
  switch (status) {
    case '待處理':
      return 'pending'
    case '準備中':
      return 'cooking'
    case '待送餐':
      return 'ready'
    case '已完成':
      return 'served'
  }
}

const count = (status) => orders.value.filter((o) => o.orderStatus === status).length

const logout = async () => {
  try {
    await api.logout()
  } finally {
    localStorage.removeItem('accessToken')
    staffData.clearStaffData()

    ElMessage.success('登出成功！')

    goTo('Login')
  }
}

onMounted(() => {
  fetchOrders()

  startPolling()
})

onUnmounted(() => {
  clearInterval(timer)
  timer = null
})
</script>

<style scoped>
.kitchen-board {
  padding: 16px;
  background: #111;
  min-height: 100vh;
  color: #fff;
}

.role-bar {
  margin-bottom: 10px;
  font-size: 14px;
  color: #aaa;
}

/* 狀態列 */
.status-bar {
  display: flex;
  gap: 16px;
  margin-bottom: 16px;
  font-size: 14px;
  color: #ccc;
}

.status-row {
  display: flex;
  gap: 16px;
}

/* 卡片 */
.card-grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(260px, 1fr));
  gap: 12px;
}

.order-card {
  background: #2c2c2c;
  border-radius: 12px;
  padding: 12px;
  cursor: pointer;
  transition: 0.2s;
}

.order-card:hover {
  transform: translateY(-3px);
}

/* 狀態色 */
.order-card.pending {
  border-left: 6px solid gray;
}
.order-card.cooking {
  border-left: 6px solid orange;
}
.order-card.ready {
  border-left: 6px solid #3498db;
}
.order-card.delivering {
  border-left: 6px solid purple;
}
.order-card.served {
  border-left: 6px solid green;
  opacity: 0.6;
}

/* 超時 */
.order-card.warning {
  box-shadow: 0 0 10px orange;
}
.order-card.danger {
  box-shadow: 0 0 10px red;
}

.card-header {
  display: flex;
  justify-content: space-between;
  margin-bottom: 8px;
}

.table {
  font-size: 18px;
  font-weight: bold;
}

.status-tag {
  font-size: 12px;
  padding: 2px 8px;
  border-radius: 999px;
}

.status-tag.pending {
  background: gray;
}
.status-tag.cooking {
  background: orange;
}
.status-tag.ready {
  background: #3498db;
}
.status-tag.delivering {
  background: purple;
}
.status-tag.served {
  background: green;
}

.item {
  font-size: 14px;
}

.note {
  color: #f39c12;
}

.order-note {
  margin-top: 8px;
  color: #ff6b6b;
  font-size: 13px;
}

.hint {
  margin-top: 10px;
  font-size: 11px;
  color: #777;
}

.top-bar {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 10px;
}

.logout-btn {
  background: #e74c3c;
  border: none;
  padding: 6px 12px;
  border-radius: 6px;
  color: #fff;
  cursor: pointer;
}

.logout-btn:hover {
  background: #c0392b;
}
</style>
