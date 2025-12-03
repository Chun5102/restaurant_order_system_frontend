<script setup>
import { useCartStore } from '@/stores/car'
import { Grid, List, ShoppingCart } from '@element-plus/icons-vue'
import { ref } from 'vue'

const emit = defineEmits(['updateView', 'openCart'])

const cartStore = useCartStore()
const tableData = JSON.parse(localStorage.getItem('tableData'))
const isCardView = ref(true)
const category = ref('all')
const toggleView = () => {
  isCardView.value = !isCardView.value
  emit('updateView', isCardView.value)
}

const openCart = () => {
  emit('openCart')
}
</script>

<template>
  <div class="topbar-container">
    <!-- 第一層：標題 + 右側功能按鈕 -->
    <div class="topbar">
      <h2 class="title">菜單(桌號:{{ tableData.id }})</h2>

      <div class="actions">
        <!-- 視圖切換 -->
        <button class="icon-btn" @click="toggleView">
          <component :is="isCardView ? Grid : List" class="icon" />
        </button>

        <!-- 購物車 -->
        <button class="icon-btn cart-btn" @click="openCart">
          <ShoppingCart class="icon" />
          <span class="cart-badge">{{ cartStore.totalQuantity }}</span>
        </button>
      </div>
    </div>
  </div>
</template>

<style scoped>
.topbar-container {
  width: 100%;
  max-width: 40rem;
  display: flex;
  flex-direction: column;
  gap: 0.6rem;
}

/* 上方主 bar */
.topbar {
  width: 100%;
  display: flex;
  justify-content: space-between;
  align-items: center;

  padding: 0.8rem 1rem;
  background: rgba(255, 255, 255, 0.7);
  border-radius: 1rem;
  box-shadow: 0 8px 20px rgba(0, 0, 0, 0.12);
  backdrop-filter: blur(10px);
}

.title {
  margin: 0;
  font-size: 1.4rem;
  font-weight: bold;
  color: #444;
}

.actions {
  display: flex;
  align-items: center;
  gap: 0.8rem;
}

/* icon button */
.icon-btn {
  width: 40px;
  height: 40px;
  border-radius: 50%;
  border: none;
  background: #fff;
  cursor: pointer;

  display: flex;
  justify-content: center;
  align-items: center;

  box-shadow: 0 5px 12px rgba(0, 0, 0, 0.15);
  transition: 0.2s;
  position: relative;
}

.icon-btn:hover {
  transform: translateY(-2px);
  box-shadow: 0 8px 18px rgba(0, 0, 0, 0.2);
}

.icon {
  width: 22px;
  height: 22px;
  color: #444;
}

/* cart badge */
.cart-badge {
  position: absolute;
  top: -5px;
  right: -5px;
  background: #e63946;
  color: #fff;
  font-size: 0.7rem;
  border-radius: 50%;
  padding: 2px 5px;
  box-shadow: 0 0 4px rgba(0, 0, 0, 0.2);
}
</style>
