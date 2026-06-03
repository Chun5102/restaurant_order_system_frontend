<template>
  <div class="home">
    <!-- Logo / 店名 -->
    <div class="logo-container">
      <div class="logo">🍽️</div>
      <h1>歡迎光臨</h1>
    </div>

    <!-- 桌號卡片 -->
    <div class="table-card">
      <p>桌號</p>
      <p v-if="tableDataStore.tableId !== null" class="table-number">
        {{ tableDataStore.tableId }}
      </p>
      <p v-else class="table-string">未知桌號</p>
    </div>
    <p v-if="tableDataStore.tableId === null" class="warning">請重新掃QR Code</p>

    <!-- 開始點餐按鈕 -->
    <button v-if="!tableDataStore.isOpened" class="start-btn" @click="goMenu">開始點餐</button>
    <template v-else>
      <button class="start-btn" @click="goMenu">繼續點餐</button>
      <button class="start-btn" @click="goOrders">
        訂單記錄
        <span class="cart-badge">{{ tableDataStore.orderCount }}</span>
      </button>
    </template>
  </div>
</template>

<script setup>
import { useNavigation } from '@/composables/useNavigation'
import api from '@/service/api'
import { useTableDataStore } from '@/stores/tableData'
import { onMounted } from 'vue'

const { goTo } = useNavigation()
const tableDataStore = useTableDataStore()

const goMenu = () => {
  goTo('Menu')
}

const goOrders = () => {
  goTo('Order')
}
onMounted(async () => {
  try {
    const res = await api.getTableStatus()
    tableDataStore.setTableData(localStorage.getItem('tableToken'), res.data)
  } catch (error) {
    localStorage.removeItem('tableToken')
  }
})
</script>

<style scoped>
/* 全螢幕漸層背景 */
.home {
  min-height: 100vh;
  display: flex;
  flex-direction: column;
  /* justify-content: space-between; */
  align-items: center;
  padding: 0;
  margin: 0;
  background: linear-gradient(to bottom, #fff1e5, #ffe5d9);
  position: relative;
  overflow: hidden;
  width: 100%;
  height: 100%;
}

/* Logo + 店名 */
.logo-container {
  text-align: center;
  margin-top: 3rem;
}

.logo {
  font-size: 4rem;
  /* animation: bounce 2s infinite; */
}

h1 {
  font-size: 2rem;
  color: #ff6b35;
  margin-top: 0.5rem;
}

p {
  font-size: 1rem;
  color: #555;
  margin-top: 0.25rem;
}

/* 桌號卡片 */
.table-card {
  background-color: #fff;
  border-radius: 2rem;
  padding: 2.5rem 2rem;
  box-shadow: 0 10px 25px rgba(0, 0, 0, 0.15);
  text-align: center;
  /* animation: float 3s ease-in-out infinite; */

  /* 固定桌號格子大小 */
  width: 5rem; /* 固定寬度 */
  height: 5rem; /* 固定高度 */
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  margin-bottom: 3rem;
}

.table-card p {
  margin: 0.5rem 0;
  color: #555;
}

.table-number {
  font-size: 4rem;
  font-weight: bold;
  color: #333;
}

.table-string {
  font-size: 2rem;
  font-weight: bold;
  color: #333;
}

/* 按鈕 */
.start-btn {
  position: relative;
  width: 100%;
  max-width: 20rem;
  padding: 1rem;
  margin-bottom: 1rem;
  font-size: 1.5rem;
  font-weight: bold;
  color: #fff;
  background: linear-gradient(90deg, #ff6b35, #ff8a5c);
  border: none;
  border-radius: 1.5rem;
  box-shadow: 0 8px 20px rgba(255, 107, 53, 0.5);
  cursor: pointer;
  transition:
    transform 0.2s,
    box-shadow 0.2s;
}

.start-btn:active {
  transform: scale(0.95);
  box-shadow: 0 4px 10px rgba(255, 107, 53, 0.5);
}
.warning {
  font-size: 25px;
  color: red;
  margin-top: 4px;
}
/* 浮動動畫 */
@keyframes float {
  0%,
  100% {
    transform: translateY(0px);
  }
  50% {
    transform: translateY(-10px);
  }
}

/* Logo bounce */
@keyframes bounce {
  0%,
  100% {
    transform: translateY(0);
  }
  50% {
    transform: translateY(-15px);
  }
}
.cart-badge {
  position: absolute;
  top: -5px;
  right: -5px;
  width: 30px; /* 固定寬度 */
  height: 30px; /* 固定高度 */
  background: #e63946;
  color: #fff;
  font-size: 1.5rem;
  text-align: center; /* 文字置中 */
  line-height: 30px; /* 文字垂直置中 */
  border-radius: 50%; /* 保持圓形 */
  font-weight: bold;
  box-shadow: 0 0 4px rgba(0, 0, 0, 0.2);
}
</style>
