<script setup>
import { useNavigation } from '@/composables/useNavigation'
import { useTableStore } from '@/stores/table'
import { useRoute } from 'vue-router'

const route = useRoute()
const { goto } = useNavigation()
const tableStore = useTableStore()
const goMenu = () => {
  tableStore.setTableNumber(route.params.tableNumber)
  goto('Menu')
}
</script>

<template>
  <div class="home">
    <!-- Logo / 店名 -->
    <div class="logo-container">
      <div class="logo">☕</div>
      <h1>歡迎光臨</h1>
    </div>

    <!-- 桌號卡片 -->
    <div class="table-card">
      <p>桌號</p>
      <p class="table-number">{{ route.params.tableNumber }}</p>
    </div>

    <!-- 開始點餐按鈕 -->
    <button class="start-btn" @click="goMenu">開始點餐</button>
  </div>
</template>

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

/* 按鈕 */
.start-btn {
  width: 100%;
  max-width: 20rem;
  padding: 1rem;
  margin-bottom: 3rem;
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
</style>
