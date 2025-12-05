<template>
  <div class="menu-page">
    <TopBar
      :title="`菜單(桌號:${tableData.id})`"
      :actions="
        actions = [
          { icon: Back, label: '返回', onClick: goBack },
          { icon: isCardView ? Grid : List, label: '切換模式', onClick: toggleView },
          {
            icon: ShoppingCart,
            badge: cartStore.totalQuantity,
            label: '購物車',
            onClick: openCart,
          },
        ]
      "
    />
    <CartDialog
      v-model:visible="cartVisible"
      @removeItem="removeItem"
      @checkout="checkout"
      @clearCart="clearCart"
    />
    <MenuDialog v-model:visible="menuVisible" :item="selectedItem" @addToCart="addToCart" />

    <!-- 分類 tabs -->
    <el-tabs v-model="category" @tab-change="onCategoryChange" class="tabs">
      <el-tab-pane label="主食" :name="0" />
      <el-tab-pane label="飲料" :name="1" />
    </el-tabs>

    <!-- Skeleton -->
    <template v-if="isLoading">
      <!-- 卡片骨架 -->
      <CardView v-if="isCardView">
        <div class="menu-card" v-for="i in 6" :key="i">
          <el-skeleton animated :rows="5" />
        </div>
      </CardView>
      <!-- 列表骨架 -->
      <ListView v-else>
        <div class="menu-list-item" v-for="i in 6" :key="i">
          <el-skeleton class="fade-skeleton" animated :rows="1" />
        </div>
      </ListView>
    </template>

    <!-- 真實資料 -->
    <template v-else>
      <!-- 卡片模式 -->
      <CardView v-if="isCardView">
        <div class="menu-card" v-for="item in menuItems" :key="item.id" @click="openDialog(item)">
          <img class="menu-img" :src="item.imageBase64" alt="menu image" />
          <p class="item-name">{{ item.name }}</p>
          <p class="item-price">{{ item.price }} 元</p>
        </div>
      </CardView>

      <!-- 列表模式 -->
      <ListView v-else>
        <div
          class="menu-list-item"
          v-for="item in menuItems"
          :key="item.id"
          @click="openDialog(item)"
        >
          <img class="list-img" :src="item.imageBase64" alt="menu image" />
          <div class="list-info">
            <p class="item-name">{{ item.name }}</p>
            <p class="item-price">{{ item.price }} 元</p>
          </div>
        </div>
      </ListView>

      <!-- 頁碼 -->
      <div class="pagination-container">
        <el-pagination
          background
          layout="prev, pager, next"
          :current-page="currentPage"
          :page-size="pageSize"
          :total="totalItems"
          @current-change="handlePageChange"
        />
      </div>
    </template>
  </div>
</template>

<script setup>
import CardView from '@/components/CardView.vue'
import ListView from '@/components/ListView.vue'
import { useNavigation } from '@/composables/useNavigation'
import api from '@/service/api'
import { useCartStore } from '@/stores/car'
import { Back, Grid, List, ShoppingCart } from '@element-plus/icons-vue'
import { ElMessage, ElPagination } from 'element-plus'
import { onMounted, ref } from 'vue'
import TopBar from '../../components/TopBar.vue'
import CartDialog from './CartDialog.vue'
import MenuDialog from './MenuDialog.vue'

// 資料
const tableData = JSON.parse(localStorage.getItem('tableData'))
const menuItems = ref([])
const cachedPages = ref({})
const cartStore = useCartStore()
// 方法
const { goto } = useNavigation()
// 開關
const menuVisible = ref(false)
const isLoading = ref(true)
const isCardView = ref(true)
const cartVisible = ref(false)
// 選擇菜單
const selectedItem = ref(null)
const selectedQty = ref(1)
// 頁碼資料
const category = ref(0)
const currentPage = ref(1)
const totalItems = ref(0)
const pageSize = ref(6)

// 獲取菜單
const fetchMenu = async (category, page) => {
  const key = `${category}-${page}`
  if (cachedPages.value[key]) {
    menuItems.value = cachedPages.value[key].content
    currentPage.value = page
    totalItems.value = cachedPages.value[key].totalElements
    pageSize.value = cachedPages.value[key].size
    return
  }
  isLoading.value = true
  const res = await api.getMenus(category, page)
  if (res.responseCode === '200') {
    menuItems.value = res.data.content
    currentPage.value = res.data.number + 1
    totalItems.value = res.data.totalElements
    pageSize.value = res.data.size
    cachedPages.value[key] = res.data
  }
  isLoading.value = false
}

// 開啟菜單彈窗
const openDialog = (item) => {
  selectedItem.value = item
  selectedQty.value = 1
  menuVisible.value = true
}

// 購物車功能
const addToCart = ({ selectedItem, selectedQty }) => {
  const existingItem = cartStore.cart.find((item) => item.id === selectedItem.id)
  if (existingItem) {
    existingItem.quantity += selectedQty
    ElMessage.success(`${existingItem.name} 數量已更新為 ${existingItem.quantity}`)
  } else {
    cartStore.addMenu(selectedItem, selectedQty)
    ElMessage.success(`${selectedItem.name} 已加入購物車`)
  }
  menuVisible.value = false
}

const removeItem = (menu) => {
  cartStore.removeMenu(menu.id)
  ElMessage.success(`${menu.name} 已從購物車移除`)
}

const clearCart = () => {
  cartStore.clearCart()
  ElMessage.success('購物車已清空')
}

const checkout = async () => {
  if (cartStore.cartEmpty) {
    ElMessage.warning('購物車是空的')
    return
  }
  const order = {
    tableId: tableData.id,
    morderItem: cartStore.cart.map((item) => ({
      menuId: item.id,
      menuName: item.name,
      quantity: item.quantity,
    })),
  }

  const res = await api.addOrder(order)
  if (res.responseCode === '200') {
    ElMessage.success('訂單已建立')
    cartStore.clearCart()
    cartVisible.value = false
  }
}

// 頁碼
const handlePageChange = (page) => {
  currentPage.value = page
  fetchMenu(category.value, page)
}
const onCategoryChange = (val) => {
  category.value = val
  fetchMenu(category.value, 1)
}

// Topbar按鈕功能
const goBack = () => {
  goto('Home', { tableNumber: tableData.qrCode })
}
const toggleView = () => {
  isCardView.value = !isCardView.value
}
const openCart = () => {
  cartVisible.value = true
}

// 載入執行
onMounted(() => {
  const res = fetchMenu(category.value, 1)
})
</script>

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

/* Tabs 美化 */
.tabs {
  width: 100%;
  max-width: 40rem;
  background: rgba(255, 255, 255, 0.7);
  border-radius: 1rem;
  padding: 0.2rem 0.6rem;
  box-shadow: 0 6px 16px rgba(0, 0, 0, 0.1);
  backdrop-filter: blur(10px);
}

/* 固定分頁在底部 */
.pagination-container {
  width: 100%;
  max-width: 40rem;
  margin: 1rem auto 2rem auto; /* 頁面下方留白 */
  display: flex;
  justify-content: center;
}

/* 如果要保留 menu-page 的樣式 */
.menu-page {
  display: flex;
  flex-direction: column;
  align-items: center;
  min-height: 100vh;
  width: 100vw;
  background: linear-gradient(to bottom, #fff1e5, #ffe5d9) !important;
  padding-top: env(safe-area-inset-top);
  padding-bottom: env(safe-area-inset-bottom);
  padding-left: env(safe-area-inset-left);
  padding-right: env(safe-area-inset-right);
  box-sizing: border-box;
}
</style>
