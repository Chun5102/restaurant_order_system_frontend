<template>
  <div class="order-page">
    <!-- TopBar -->
    <TopBar
      :title="`訂單資訊 (桌號:${tableDataStore.tableId})`"
      :actions="[
        { icon: Back, label: '返回', onClick: goBack },
        { icon: isCardView ? Grid : List, label: '切換模式', onClick: toggleView },
      ]"
    />

    <!-- 主訂單資訊 -->
    <div class="order-summary">
      <p>訂單編號: {{ tableOrder.code }}</p>
      <p>桌號: {{ tableOrder.tableId }}</p>
      <p>總金額: ${{ tableOrder.totalPrice }}</p>
      <p>付款狀態: {{ tableOrder.paymentStatus }}</p>
    </div>

    <!-- 訂單列表 -->
    <template v-if="isCardView">
      <CardView>
        <div class="order-card" v-for="(order, index) in tableOrder.orders" :key="order.id">
          <div class="batch-header">
            <span class="batch-number">{{ index + 1 }}</span>
            <span class="status">{{ order.orderStatus }}</span>
            <div v-if="order.orderStatus === '待處理'">
              <button class="cancel-btn" @click="((show = true), (orderId = order.id))">
                取消
              </button>
            </div>
          </div>
          <div class="batch-items">
            <div class="batch-item" v-for="item in order.orderItems" :key="index">
              {{ item.menuName }} x{{ item.quantity }}
            </div>
            <div class="subtotal">小計: ${{ order.totalPrice }}</div>
          </div>
        </div>
      </CardView>
    </template>

    <template v-else>
      <ListView>
        <div class="order-list-item" v-for="(order, index) in tableOrder.orders" :key="order.id">
          <div class="list-left">
            <span class="batch-number">{{ index + 1 }}</span>
            <span class="status">{{ order.orderStatus }}</span>
          </div>
          <div class="list-right">
            <div
              class="batch-item"
              v-for="(item, itemIndex) in order.orderItems"
              :key="order.id + '-' + itemIndex"
            >
              {{ item.menuName }} x{{ item.quantity }}
            </div>
            <div class="subtotal">小計: ${{ order.totalPrice }}</div>

            <div v-if="order.orderStatus === '待處理'">
              <button class="cancel-btn" @click="((show = true), (orderId = order.id))">
                取消
              </button>
            </div>
          </div>
        </div>
      </ListView>
    </template>
    <AlertBox
      v-model:visible="show"
      title="取消訂單確認"
      message="確定要取消訂單嗎？"
      :buttons="[
        { text: '算了', color: 'secondary', onClick: () => (show = false) },
        { text: '取消訂單', color: 'danger', onClick: () => cancelBatch(orderId) },
      ]"
      size="small"
      :autoClose="false"
    />
  </div>
</template>

<script setup>
import AlertBox from '@/components/AlertBox.vue'
import CardView from '@/components/CardView.vue'
import ListView from '@/components/ListView.vue'
import TopBar from '@/components/TopBar.vue'
import { useNavigation } from '@/composables/useNavigation'
import api from '@/service/api'
import { useTableDataStore } from '@/stores/tableData'
import { Back, Grid, List } from '@element-plus/icons-vue'
import { onMounted, reactive, ref } from 'vue'

const tableDataStore = useTableDataStore()
const { goHome } = useNavigation()

const tableOrder = reactive({
  code: '',
  tableId: null,
  totalPrice: 0,
  paymentStatus: '',
  orders: [],
})

const orderId = ref(null)
const isCardView = ref(true)
const show = ref(false)

const toggleView = () => {
  isCardView.value = !isCardView.value
}

const goBack = () => {
  goHome()
}

const cancelBatch = async (orderId) => {
  const res = await api.cancelOrderByCustomer(orderId)
  tableOrder.totalPrice = res.data.totalPrice
  tableOrder.orders = res.data.orders.map((order) => ({
    ...order,
    expanded: false,
    itemsDetail: [],
  }))
}

onMounted(async () => {
  tableDataStore.setTableId(localStorage.getItem('tableToken'))
  const res = await api.getTableOrder()

  tableOrder.code = res.data.code
  tableOrder.tableId = res.data.tableId
  tableOrder.totalPrice = res.data.totalPrice
  tableOrder.paymentStatus = res.data.paymentStatus
  tableOrder.orders = res.data.orders.map((order) => ({
    ...order,
    expanded: false,
    itemsDetail: [],
  }))
})
</script>

<style scoped>
.order-page {
  min-height: 100vh;
  width: 100%;
  background: linear-gradient(to bottom, #fff1e5, #ffe5d9);
  display: flex;
  flex-direction: column;
  align-items: center;
  padding: 1rem;
  box-sizing: border-box;
}

/* 主訂單資訊卡片 */
.order-summary {
  background-color: #fff;
  border-radius: 1.5rem;
  padding: 1rem;
  width: 95%;
  max-width: 40rem;
  box-shadow: 0 10px 25px rgba(0, 0, 0, 0.15);
  margin-bottom: 1rem;
  font-size: clamp(1rem, 1.2vw, 1.2rem); /* 隨螢幕縮放 */
  line-height: 1.4;
  white-space: nowrap;
}

/* 卡片模式 */
.order-card {
  background-color: #fff;
  border-radius: 1.5rem;
  padding: clamp(0.5rem, 1vw, 1rem); /* 隨螢幕縮放 */
  box-shadow: 0 10px 25px rgba(0, 0, 0, 0.15);
  margin-bottom: 1rem;
}

/* 批次標題 */
.batch-header {
  display: flex;
  justify-content: space-between;
  position: relative;
  display: flex;
  align-items: center;
  margin-bottom: 0.5rem;
}

/* 批次號 */
.batch-number {
  font-weight: bold;
  padding: 0.3em 0.6em;
  border-radius: 0.5em;
  background-color: #ffd699;
  font-size: clamp(1rem, 2vw, 2rem); /* 隨螢幕縮放 */
}

/* 訂單狀態 */
.status {
  position: absolute;
  left: 50%;
  transform: translateX(-50%);
  padding: 0.3em 0.6em;
  border-radius: 0.5em;
  background-color: #ffd699;
  text-align: center;
  font-size: clamp(0.8rem, 1vw, 1rem);
}

/* 取消按鈕 */
.cancel-btn {
  background-color: #ff4d4f;
  color: #fff;
  border: none;
  padding: 0.3em 0.6em;
  border-radius: 0.5em;
  cursor: pointer;
  font-size: clamp(0.8rem, 1vw, 1rem); /* 隨螢幕縮放 */
  margin-left: auto;
}

/* 列表模式 */
.order-list-item {
  display: flex;
  flex-direction: column; /* 手機預設上下堆疊 */
  justify-content: space-between;
  align-items: flex-start;
  background-color: #fff;
  border-radius: 1.5rem;
  padding: 1rem;
  box-shadow: 0 10px 25px rgba(0, 0, 0, 0.15);
  width: 95%;
  max-width: 40rem;
  margin-bottom: 1rem;
}

.list-left {
  flex: 1;
}

.list-right {
  flex: 2;
  margin-top: 0.5rem;
}

/* 平板、桌面寬度自動調整水平排列 */
@media screen and (min-width: 768px) {
  .order-list-item {
    flex-direction: row;
    align-items: center;
  }
  .list-right {
    margin-top: 0;
  }
}
</style>
