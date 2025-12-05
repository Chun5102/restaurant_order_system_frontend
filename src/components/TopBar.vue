<!-- <TopBar
    title="菜單(桌號:1)"
    :actions="[
      { icon: isCardView ? Grid : List, onClick: toggleView },
      { icon: ShoppingCart, badge: cartStore.totalQuantity, onClick: openCart }
    ]"
  /> -->
<template>
  <div class="topbar-container">
    <!-- 第一層：標題 + 右側功能按鈕 -->
    <div class="topbar">
      <!-- 標題 -->
      <h2 class="title">{{ title }}</h2>

      <div class="actions">
        <div class="action-item" v-for="(btn, index) in actions" :key="index">
          <!-- 功能按鈕 -->
          <button class="icon-btn" @click="btn.onClick">
            <component :is="btn.icon" class="icon" />
            <span v-if="btn.badge" class="btn-badge">{{ btn.badge }}</span>
          </button>
          <span class="icon-label">{{ btn.label }}</span>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { defineProps } from 'vue'
const props = defineProps({
  title: { type: String, required: true },
  actions: { type: Array, default: () => [] },
  // 每個 action 格式: { icon: Component, badge?: Number, onClick: Function }
})
</script>

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
  gap: 0.8rem; /* 按鈕間隔 */
}

.action-item {
  display: flex;
  flex-direction: column; /* 垂直排列 icon 和 label */
  align-items: center;
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

.icon-label {
  font-size: 0.7rem;
  font-weight: 500;
  margin-top: 2px;
  text-align: center;
}

/* cart badge */
.btn-badge {
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
