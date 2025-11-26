<script setup>
import { ElButton, ElDialog, ElInputNumber, ElSwitch } from 'element-plus'
import { ref } from 'vue'

const menuItems = ref([
  { id: 1, name: '拿鐵', price: 120, img: 'https://via.placeholder.com/100?text=拿鐵' },
  { id: 2, name: '美式咖啡', price: 100, img: 'https://via.placeholder.com/100?text=美式' },
  { id: 3, name: '卡布奇諾', price: 130, img: 'https://via.placeholder.com/100?text=卡布奇諾' },
  { id: 4, name: '摩卡', price: 140, img: 'https://via.placeholder.com/100?text=摩卡' },
  { id: 5, name: '焦糖瑪奇朵', price: 150, img: 'https://via.placeholder.com/100?text=焦糖' },
])

const dialogVisible = ref(false)
const selectedItem = ref(null)
const selectedQty = ref(1)
const isCardView = ref(true)

const openDialog = (item) => {
  selectedItem.value = item
  selectedQty.value = 1
  dialogVisible.value = true
}

const addToCart = () => {
  console.log(`加入購物車：${selectedItem.value.name} x ${selectedQty.value}`)
  dialogVisible.value = false
}
</script>

<template>
  <div class="menu-page">
    <div class="header">
      <h2 class="page-title">菜單</h2>
      <el-switch v-model="isCardView" active-text="卡片模式" inactive-text="列表模式" />
    </div>

    <!-- 卡片模式 -->
    <div v-if="isCardView" class="menu-grid">
      <div class="menu-card" v-for="item in menuItems" :key="item.id" @click="openDialog(item)">
        <img class="menu-img" :src="item.img" alt="menu image" />
        <p class="item-name">{{ item.name }}</p>
        <p class="item-price">{{ item.price }} 元</p>
      </div>
    </div>

    <!-- 列表模式 -->
    <div v-else class="menu-list">
      <div
        class="menu-list-item"
        v-for="item in menuItems"
        :key="item.id"
        @click="openDialog(item)"
      >
        <img class="list-img" :src="item.img" alt="menu image" />
        <div class="list-info">
          <p class="item-name">{{ item.name }}</p>
          <p class="item-price">{{ item.price }} 元</p>
        </div>
      </div>
    </div>

    <!-- 彈窗 -->
    <el-dialog v-model="dialogVisible" :title="selectedItem?.name" width="400px" center>
      <div class="dialog-content">
        <img class="dialog-img" :src="selectedItem?.img" alt="menu image" />
        <p class="dialog-price">{{ selectedItem?.price }} 元</p>
        <el-input-number v-model="selectedQty" :min="1" :max="10" />
      </div>
      <template #footer>
        <el-button @click="dialogVisible = false">取消</el-button>
        <el-button type="primary" @click="addToCart">加入購物車</el-button>
      </template>
    </el-dialog>
  </div>
</template>

<style scoped>
/* html/body 不要白色背景 */
html,
body {
  margin: 0;
  padding: 0;
  width: 100%;
  height: 100%;
  background: none;
}

/* 全螢幕背景放在 menu-page，強制覆蓋 */
.menu-page {
  min-height: 100vh;
  width: 100vw;
  background: linear-gradient(to bottom, #fff1e5, #ffe5d9) !important;
  display: flex;
  flex-direction: column;
  align-items: center;
  padding-top: env(safe-area-inset-top);
  padding-bottom: env(safe-area-inset-bottom);
  padding-left: env(safe-area-inset-left);
  padding-right: env(safe-area-inset-right);
  box-sizing: border-box;
}

/* header */
.header {
  width: 100%;
  max-width: 40rem;
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 1.5rem;
}

/* 卡片模式 */
.menu-grid {
  display: grid;
  grid-template-columns: repeat(2, 1fr);
  gap: 1rem;
  width: 100%;
  max-width: 40rem;
}

.menu-card {
  background-color: #fff;
  border-radius: 1.5rem;
  padding: 1rem;
  box-shadow: 0 10px 25px rgba(0, 0, 0, 0.15);
  display: flex;
  flex-direction: column;
  align-items: center;
  cursor: pointer;
  transition:
    transform 0.2s,
    box-shadow 0.2s;
}

.menu-card:hover {
  transform: translateY(-5px);
  box-shadow: 0 12px 28px rgba(0, 0, 0, 0.2);
}

.menu-img {
  width: 80px;
  height: 80px;
  border-radius: 1rem;
  margin-bottom: 0.5rem;
  object-fit: cover;
}

/* 列表模式 */
.menu-list {
  display: flex;
  flex-direction: column;
  gap: 1rem;
  width: 100%;
  max-width: 40rem;
}

.menu-list-item {
  display: flex;
  align-items: center;
  background-color: #fff;
  border-radius: 1.5rem;
  padding: 0.5rem 1rem;
  box-shadow: 0 8px 20px rgba(0, 0, 0, 0.15);
  cursor: pointer;
  transition:
    transform 0.2s,
    box-shadow 0.2s;
}

.menu-list-item:hover {
  transform: translateY(-3px);
  box-shadow: 0 10px 25px rgba(0, 0, 0, 0.2);
}

.list-img {
  width: 60px;
  height: 60px;
  border-radius: 1rem;
  object-fit: cover;
  margin-right: 1rem;
}

.list-info {
  display: flex;
  flex-direction: column;
}

.item-name {
  font-size: 1.2rem;
  font-weight: bold;
  color: #333;
}

.item-price {
  font-size: 1rem;
  color: #555;
}

/* 彈窗內容 */
.dialog-content {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 1rem;
}

.dialog-img {
  width: 150px;
  height: 150px;
  border-radius: 1rem;
  object-fit: cover;
}

.dialog-price {
  font-size: 1.2rem;
  font-weight: bold;
  color: #333;
}
</style>
