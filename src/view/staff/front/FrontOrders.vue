<template>
  <div class="front-orders">
    <h2 class="title">外場訂單列表</h2>

    <div class="order-cards">
      <div class="order-card" v-for="order in orders" :key="order.id">
        <!-- 🔹 Header -->
        <div class="order-header">
          <span class="batch-number">桌號 {{ order.tableId }}</span>

          <!-- 主訂單狀態 -->
          <span class="status" :class="statusClass(order.mainOrderStatus)">
            {{ order.mainOrderStatus }}
          </span>

          <div>
            <!-- 結帳 -->
            <button v-if="canPay(order)" class="pay-btn" @click="openPay(order)">結帳</button>
          </div>
        </div>

        <!-- 🔹 訂單內容 -->
        <div class="order-items">
          <template v-for="(batch, batchIndex) in order.batches" :key="batch.id">
            <!-- 批次標記 -->
            <div class="batch-line">
              第{{ batchIndex + 1 }}批
              <span v-if="batchIndex > 0" class="tag-new">加點</span>

              <span class="status small" :class="statusClass(batch.orderStatus)">
                {{ batch.orderStatus }}
              </span>

              <!-- 取消 -->
              <button
                v-if="batch.orderStatus !== '已取消' && batch.orderStatus !== '已完成'"
                class="cancel-btn"
                @click="confirmCancel(batch.id)"
              >
                取消
              </button>
            </div>

            <!-- 餐點 -->
            <div v-for="item in batch.orderItems" :key="item.menuName + item.subtotal">
              {{ item.menuName }} x{{ item.quantity }} - ${{ item.subtotal }}
            </div>
          </template>

          <div class="subtotal">總金額: ${{ order.totalPrice }}</div>
        </div>
      </div>
    </div>

    <!-- 取消 Dialog -->
    <el-dialog v-model="showDialog" title="取消訂單確認" width="400px">
      <span>確定要取消此訂單嗎？</span>
      <template #footer>
        <el-button @click="showDialog = false">算了</el-button>
        <el-button type="danger" @click="cancelOrder">取消訂單</el-button>
      </template>
    </el-dialog>

    <!-- POS 結帳 -->
    <el-dialog v-model="showPayDialog" title="結帳" width="420px">
      <div class="pay-container">
        <div class="pay-info">
          <div>桌號：{{ selectedOrder?.tableId }}</div>
          <div>應付：${{ selectedOrder?.totalPrice }}</div>
        </div>

        <el-select v-model="paymentMethod" placeholder="選擇付款方式">
          <el-option label="現金" value="現金" />
          <el-option label="信用卡" value="信用卡" />
          <el-option label="Line Pay" value="Line Pay" />
        </el-select>

        <div v-if="paymentMethod === '現金'">
          <el-input v-model.number="paidAmount" type="number" placeholder="輸入收款金額" />

          <div class="quick-buttons">
            <button @click="setAmount(100)">100</button>
            <button @click="setAmount(500)">500</button>
            <button @click="setAmount(1000)">1000</button>
            <button @click="autoFill">整數</button>
          </div>

          <div class="change">
            找零：
            <span :class="{ danger: change < 0 }">
              {{ change < 0 ? '金額不足' : change }}
            </span>
          </div>
        </div>
      </div>

      <template #footer>
        <el-button @click="showPayDialog = false">取消</el-button>
        <el-button type="success" :disabled="!canSubmit" @click="payOrder(selectedOrder.code)">
          確認收款
        </el-button>
      </template>
    </el-dialog>
  </div>
</template>

<script setup>
import api from '@/service/api'
import { computed, onMounted, reactive, ref } from 'vue'

const orders = reactive([])

// Dialog 控制
const showDialog = ref(false)
const currentOrderId = ref(null)

const showPayDialog = ref(false)
const currentPayOrderId = ref(null)

const selectedOrder = ref(null)

const paymentMethod = ref('CASH')
const paidAmount = ref(0)

/* 取得訂單 */
const fetchOrders = async () => {
  const res = await api.getUnpaidOrders()
  orders.splice(0, orders.length, ...res.data)
}

/* ✅ 是否可結帳 */
const canPay = (order) => {
  const status = order.mainOrderStatus
  return status !== '已完成' && status !== '已取消'
}

const setAmount = (v) => (paidAmount.value = v)

const autoFill = () => {
  paidAmount.value = selectedOrder.value.totalPrice
}

const canSubmit = computed(() => {
  if (!selectedOrder.value) return false
  if (paymentMethod.value !== '現金') return true
  return paidAmount.value >= selectedOrder.value.totalPrice
})

const change = computed(() => {
  return (paidAmount.value || 0) - (selectedOrder.value?.totalPrice || 0)
})

/* 結帳 */
const openPay = (order) => {
  selectedOrder.value = order
  paymentMethod.value = '現金'
  showPayDialog.value = true
}

/* 取消 */
const confirmCancel = (orderId) => {
  currentOrderId.value = orderId
  showDialog.value = true
}

const cancelOrder = async () => {
  if (!currentOrderId.value) return
  await api.cancelOrderByStaff(currentOrderId.value)
  await fetchOrders()
  showDialog.value = false
}

/* 結帳 */
const payOrder = async (code) => {
  if (!code) return
  await api.payOrder(code, {
    paymentMethod: paymentMethod.value,
    paidAmount: paidAmount.value,
    changeAmount: change.value,
  })
  await fetchOrders()
  showPayDialog.value = false
}

/* 狀態樣式 */
const statusClass = (status) => {
  switch (status) {
    case '待處理':
    case '已建立':
      return 'status-pending'
    case '處理中':
      return 'status-processing'
    case '已完成':
      return 'status-completed'
    case '已取消':
      return 'status-cancelled'
    default:
      return ''
  }
}

onMounted(fetchOrders)
</script>

<style scoped>
/* ===== 標題 ===== */
.title {
  font-size: 20px;
  font-weight: bold;
}

/* ===== 外層 ===== */
.front-orders {
  display: flex;
  flex-direction: column;
  gap: 1rem;
}

/* ===== 卡片排列 ===== */
.order-cards {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(220px, 1fr));
  gap: 1rem;
}

/* ===== 卡片本體 ===== */
.order-card {
  background: #fff;
  border-radius: 1rem;
  padding: 1rem;
  box-shadow: 0 6px 16px rgba(0, 0, 0, 0.08);
  border-left: 5px solid transparent;
  transition: 0.2s;
}

/* 👉 狀態色條（超重要：一眼辨識） */
.order-card.status-pending {
  border-left-color: #f39c12;
}

.order-card.status-processing {
  border-left-color: #f1c40f;
}

.order-card.status-completed {
  border-left-color: #2ecc71;
}

.order-card.status-cancelled {
  border-left-color: #e74c3c;
}

/* ===== Header ===== */
.order-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 0.5rem;
}

.batch-number {
  font-weight: bold;
}

/* ===== 狀態（資訊型，不搶按鈕） ===== */
.status {
  padding: 0.2em 0.6em;
  border-radius: 999px;
  font-size: 0.8rem;
  font-weight: 500;
}

/* 柔和色（避免跟按鈕衝突） */
.status-pending {
  background: #fff3cd;
  color: #856404;
}

.status-processing {
  background: #fff8e1;
  color: #8a6d3b;
}

.status-completed {
  background: #d4edda;
  color: #155724;
}

.status-cancelled {
  background: #f8d7da;
  color: #721c24;
}

/* 批次用小一點 */
.status.small {
  font-size: 0.7rem;
  padding: 0.1em 0.4em;
}

/* ===== 按鈕（操作型，高辨識） ===== */
.cancel-btn {
  background: #e74c3c;
  color: white;
  border: none;
  padding: 0.25em 0.4em;
  border-radius: 0.5em;
  font-weight: 600;
  cursor: pointer;
  transition: 0.2s;
}

.cancel-btn:hover {
  background: #c0392b;
}

.pay-btn {
  background: #2ecc71;
  color: white;
  border: none;
  padding: 0.35em 0.7em;
  border-radius: 0.5em;
  font-weight: 600;
  cursor: pointer;
  margin-left: 0.3em;
  transition: 0.2s;
}

.pay-btn:hover {
  background: #27ae60;
}

/* 禁用狀態（避免誤點） */
button:disabled {
  background: #ccc !important;
  cursor: not-allowed;
}

/* ===== 訂單內容 ===== */
.order-items {
  display: flex;
  flex-direction: column;
  gap: 0.2rem;
}

/* ===== 批次（低侵入，不破壞原UI） ===== */
.batch-line {
  font-size: 0.85rem;
  color: #666;
  margin-top: 0.3rem;
  margin-bottom: 0.1rem;
  display: flex;
  justify-content: space-between;
  align-items: center;
}

/* 加點標籤 */
.tag-new {
  background: #007bff;
  color: #fff;
  font-size: 0.7rem;
  padding: 0 4px;
  border-radius: 4px;
  margin-left: 4px;
}

/* ===== 金額 ===== */
.subtotal {
  font-weight: bold;
  text-align: right;
  margin-top: 0.5rem;
}

.danger {
  color: red;
  font-weight: bold;
}
</style>
