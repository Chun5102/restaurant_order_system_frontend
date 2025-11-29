<script setup>
import api from '@/service/api'
import { ElButton, ElDialog, ElInputNumber } from 'element-plus'
import { computed, onMounted, ref } from 'vue'
import CartDialog from './CartDialog.vue'
import TopBar from './TopBar.vue'

const menuItems = ref([])

const dialogVisible = ref(false)
const selectedItem = ref(null)
const selectedQty = ref(1)
const isCardView = ref(true)
const currentCategory = ref('all')
const cartVisible = ref(false)
const cartItems = ref([])

const filteredMenu = computed(() => {
  if (currentCategory.value === 'all') return menuItems.value
  return menuItems.value.filter((i) => i.category === currentCategory.value)
})

const openDialog = (item) => {
  selectedItem.value = item
  selectedQty.value = 1
  dialogVisible.value = true
}

const addToCart = () => {
  console.log(`加入購物車：${selectedItem.value.name} x ${selectedQty.value}`)
  dialogVisible.value = false
}

onMounted(async () => {
  try {
    const res = await api.getMenus()
    if (res.data.responseCode === '200') {
      menuItems.value = res.data.data
    }
  } catch (err) {
    console.error('載入商品失敗:', err)
  }
})
</script>

<template>
  <div class="menu-page">
    <TopBar
      @updateCategory="currentCategory = $event"
      @updateView="isCardView = $event"
      @openCart="cartVisible = true"
    />
    <CartDialog
      v-model:visible="cartVisible"
      :cart-items="cartItems"
      @removeItem="
        (id) => {
          cartItems = cartItems.filter((item) => item.id !== id)
        }
      "
      @checkout="
        () => {
          console.log('結帳', cartItems)
          cartItems = []
          cartVisible = false
        }
      "
    />
    <div v-for="item in filteredMenu" :key="item.id"></div>
    <!-- 卡片模式 -->
    <div v-if="isCardView" class="menu-grid">
      <div class="menu-card" v-for="item in filteredMenu" :key="item.id" @click="openDialog(item)">
        <img class="menu-img" :src="item.imageBase64" loading="lazy" alt="menu image" />
        <p class="item-name">{{ item.name }}</p>
        <p class="item-price">{{ item.price }} 元</p>
      </div>
    </div>

    <!-- 列表模式 -->
    <div v-else class="menu-list">
      <div
        class="menu-list-item"
        v-for="item in filteredMenu"
        :key="item.id"
        @click="openDialog(item)"
      >
        <img class="list-img" :src="item.imageBase64" loading="lazy" alt="menu image" />
        <div class="list-info">
          <p class="item-name">{{ item.name }}</p>
          <p class="item-price">{{ item.price }} 元</p>
        </div>
      </div>
    </div>

    <!-- 彈窗 -->
    <el-dialog v-model="dialogVisible" :title="selectedItem?.name" width="400px" center>
      <div class="dialog-content">
        <img class="dialog-img" :src="selectedItem?.imageBase64" loading="lazy" alt="menu image" />
        <p>{{ selectedItem?.description }}</p>
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
  width: 135px;
  height: 85px;
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
  width: 150px;
  height: 100px;
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
  width: 350px;
  height: 240px;
  border-radius: 1rem;
  object-fit: cover;
}

.dialog-price {
  font-size: 1.2rem;
  font-weight: bold;
  color: #333;
}
</style>
