<template>
  <div class="container">
    <!-- Header -->
    <div class="header">
      <h2 class="title">訂單管理</h2>
      <div class="header-actions">
        <el-tabs v-model="activeTab" type="card">
          <el-tab-pane label="現有訂單" name="unpaid"></el-tab-pane>
          <el-tab-pane label="歷史訂單" name="history"></el-tab-pane>
        </el-tabs>
      </div>
    </div>

    <!-- Table -->
    <div class="order-table-container">
      <!-- 未付款 Table -->
      <el-table
        v-if="activeTab === 'unpaid'"
        :data="ordersUnpaid"
        stripe
        border
        style="width: 100%"
      >
        <el-table-column prop="tableId" label="桌號" width="80" />
        <el-table-column prop="totalPrice" label="總金額" width="120" />
        <el-table-column prop="mainOrderStatus" label="狀態" width="100" />
        <el-table-column prop="code" label="訂單編號" width="260" />
        <el-table-column label="操作" width="140" fixed="right">
          <template #default="{ row }">
            <el-button size="small" type="primary" @click="viewOrder(row.code)">查看</el-button>
          </template>
        </el-table-column>
      </el-table>

      <!-- 歷史訂單 Table -->
      <el-table v-else :data="ordersHistory" stripe border style="width: 100%">
        <el-table-column prop="code" label="訂單編號" width="260" />
        <el-table-column prop="tableId" label="桌號" width="80" />
        <el-table-column prop="totalPrice" label="總金額" width="80" />
        <el-table-column prop="mainOrderStatus" label="狀態" width="100" />
        <el-table-column prop="paymentStatus" label="付款狀態" width="100" />
        <el-table-column prop="paymentMethod" label="付款方式" width="80" />
        <el-table-column prop="paidAmount" label="付款金額" width="80" />
        <el-table-column prop="changeAmount" label="找零" width="80" />
        <el-table-column prop="paidAt" label="結帳時間" width="200" />
        <el-table-column label="操作" width="100" fixed="right">
          <template #default="{ row }">
            <el-button size="small" type="primary" @click="viewOrder(row.code)">查看</el-button>
          </template>
        </el-table-column>
      </el-table>
    </div>
  </div>

  <!-- Drawer -->
  <el-drawer v-model="visible" size="60%" :with-header="false" destroy-on-close>
    <div v-if="orderDetail && orderDetail.length">
      <div v-for="order in orderDetail" :key="order.id" class="order-detail">
        <div class="order-detail-header">
          <div class="header-left">
            訂單編號 {{ order.id }}
            <span class="order-time">({{ new Date(order.createdAt).toLocaleString() }})</span>
          </div>

          <div class="header-right">
            <template v-if="order.orderStatus === '已取消' || order.orderStatus === '已完成'">
              <span>
                {{ order.orderStatus === '已取消' ? '❌' : '🟢' }}{{ order.orderStatus }}
              </span>
            </template>
            <template v-else>
              <div v-if="activeTab === 'unpaid'">
                <el-select v-model="order.tempStatus" size="large" placeholder="選擇狀態">
                  <el-option
                    v-for="status in statusOptions"
                    :key="status.value"
                    :label="status.label"
                    :value="status.value"
                  />
                </el-select>
                <el-button type="primary" size="small" @click="saveOrder(order)">儲存</el-button>
              </div>

              <div v-else>
                {{ order.orderStatus === '待處理' ? '🔴' : '🟡' }}{{ order.orderStatus }}
              </div>
            </template>
          </div>
        </div>

        <div
          v-for="(item, iIndex) in order.orderItems || []"
          :key="iIndex"
          class="order-detail-item"
        >
          <span>{{ item.menuName }} x{{ item.quantity }}</span>
          <span>${{ item.subtotal }}</span>
        </div>

        <div class="order-detail-total"><strong>總計：</strong> ${{ order.totalPrice }}</div>

        <hr style="margin: 16px 0" />
      </div>
    </div>
  </el-drawer>
</template>

<script setup>
import api from '@/service/api'
import { ElMessage } from 'element-plus'
import { onMounted, ref } from 'vue'

const activeTab = ref('unpaid')
const ordersUnpaid = ref([])
const ordersHistory = ref([])
const visible = ref(false)
const orderDetail = ref([])

const statusOptions = [
  { label: '🔴待處理', value: '待處理' },
  { label: '🟡處理中', value: '處理中' },
  { label: '🟢已完成', value: '已完成' },
  { label: '❌已取消', value: '已取消' },
]

const fetchOrders = async () => {
  const resUnpaid = await api.getUnpaidMainOrders()
  ordersUnpaid.value = resUnpaid.data

  const resHistory = await api.getHistoryMainOrders()
  ordersHistory.value = resHistory.data
}

const viewOrder = async (code) => {
  const resDetail = await api.getMainOrderDetails(code)
  orderDetail.value = resDetail.data.map((order) => ({ ...order, tempStatus: order.orderStatus }))
  visible.value = true
}

const saveOrder = async (order) => {
  if (order.tempStatus === order.orderStatus) return

  const updatedStatus = order.tempStatus

  if (order.tempStatus === '已取消') {
    await api.cancelOrderByStaff(order.id)
    order.orderStatus = updatedStatus
    ElMessage.success('取消成功！')
    fetchOrders()
    return
  }
  await api.updateOrder({ id: order.id, orderStatus: updatedStatus })

  order.orderStatus = updatedStatus

  ElMessage.success('狀態更新成功！')

  fetchOrders()
}

onMounted(fetchOrders)
</script>

<style scoped>
.container {
  max-width: 1200px;
  margin: 0 auto;
  padding: 24px 16px;
}

.header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 24px;
}

.title {
  font-size: 20px;
  font-weight: bold;
}

.header-actions {
  display: flex;
  align-items: center;
  gap: 16px;
}

.order-table-container {
  overflow-x: auto;
  /* 移除白色卡片樣式 */
  background-color: transparent;
  padding: 0;
  border-radius: 0;
  box-shadow: none;
}

.el-table th {
  background-color: #f5f7fa;
  color: #333;
  font-weight: 600;
}

.el-table td {
  font-size: 14px;
}

.el-table .el-button {
  padding: 2px 8px;
  font-size: 12px;
}

::v-deep(.el-tabs__item) {
  color: white; /* 未選 tab 顏色 */
  background-color: #8db3ff; /* 未選 tab 背景顏色，可自己調 */
  border-radius: 6px; /* 圓角，看起來像按鈕 */
  margin-right: 4px; /* tab 間距 */
  font-weight: 500;
}

::v-deep(.el-tabs__item.is-active) {
  color: #ffffff; /* 選中 tab 文字色 */
  background-color: #409eff; /* 選中 tab 背景色 */
  font-weight: 500;
}

/* Drawer */
.el-drawer__body {
  padding: 24px;
  background-color: #f9f9f9;
}

.order-detail-header {
  display: flex;
  justify-content: space-between; /* 左右分開 */
  align-items: center;
  padding: 8px 0;
  border-bottom: 1px solid #e0e6ed;
  font-size: 16px;
  font-weight: bold;
}

.header-left {
  color: #333;
}

.order-time {
  font-weight: normal;
  color: #999;
  font-size: 14px;
  margin-left: 8px;
}

.header-right {
  display: flex;
  align-items: center;
  gap: 8px; /* select 與按鈕間距 */
}

.header-right .el-select {
  min-width: 120px; /* 固定 select 寬度 */
}

.header-right .el-button {
  padding: 4px 12px;
}

.order-detail-item {
  display: flex;
  justify-content: space-between;
  padding: 8px 0;
  border-bottom: 1px dashed #ccc;
}

.order-detail-item:last-child {
  border-bottom: none;
}

.order-detail-total {
  margin-top: 16px;
  font-size: 16px;
  text-align: right;
  font-weight: bold;
}

/* Tabs */
.el-tabs__header {
  background-color: #f5f7fa;
  border-radius: 8px;
  padding: 4px 8px;
}

.el-tabs__item {
  font-weight: 500;
  color: #333;
}

.el-tabs__item.is-active {
  color: #409eff;
  font-weight: 600;
}
</style>
