<template>
  <div class="container">
    <div class="header">
      <h2 class="title">菜單管理</h2>
      <div class="header-actions">
        <el-button @click="goTo('AddMenu')" type="primary"> + 新增菜單 </el-button>

        <el-select
          v-model="selectedCategory"
          placeholder="選擇分類"
          clearable
          class="select-category"
        >
          <el-option label="全部" :value="null" />
          <el-option
            v-for="category in categories"
            :key="category.value"
            :label="category.label"
            :value="category.value"
          />
        </el-select>
      </div>
    </div>

    <div class="menu-table-container">
      <el-table :data="menus" style="width: 100%" stripe border>
        <el-table-column label="圖片" width="100" align="center">
          <template #default="{ row }">
            <el-image
              :src="row.imageBase64"
              fit="cover"
              style="width: 60px; height: 60px"
              class="img-rounded"
              lazy
            >
              <template #error>
                <div class="image-slot">
                  <el-icon>
                    <Picture />
                  </el-icon>
                </div>
              </template>
            </el-image>
          </template>
        </el-table-column>

        <el-table-column prop="name" label="菜單名稱" sortable show-overflow-tooltip />

        <el-table-column prop="category" label="分類" width="120">
          <template #default="{ row }">
            {{ row.category === 0 ? '主食' : '飲料' }}
          </template>
        </el-table-column>

        <el-table-column prop="price" label="售價" width="100" sortable>
          <template #default="{ row }"> ${{ row.price }} </template>
        </el-table-column>

        <el-table-column prop="stock" label="庫存" width="100" sortable>
          <template #default="{ row }">
            <div class="stock-wrapper">
              <span class="stock-text">{{ row.stock }}</span>
              <p v-if="row.stock <= 5" class="stock-warning">庫存緊張</p>
            </div>
          </template>
        </el-table-column>

        <el-table-column prop="states" label="狀態" width="100" sortable>
          <template #default="{ row }">
            <span :class="row.status === 0 ? 'states-delete' : 'states-available'">
              {{ row.status === 2 ? '銷售中' : '已刪除' }}
            </span>
          </template>
        </el-table-column>

        <el-table-column label="操作" width="180" fixed="right">
          <template #default="{ row }">
            <div v-if="row.status === 2">
              <el-button size="small" type="primary" @click="editMenu(row.id)"> 編輯 </el-button>
              <el-button size="small" type="danger" @click="deleteMenu(row.id)"> 刪除 </el-button>
            </div>
          </template>
        </el-table-column>
      </el-table>
    </div>

    <div class="pagination-wrapper">
      <el-pagination
        v-model:current-page="currentPage"
        :total="total"
        layout="prev, pager, next"
        background
        @current-change="(page) => fetchMenus(selectedCategory, page)"
      />
    </div>
  </div>
</template>

<script setup>
import { useNavigation } from '@/composables/useNavigation'
import api from '@/service/api'
import { Picture } from '@element-plus/icons-vue'
import { ElMessage, ElMessageBox } from 'element-plus'
import { onMounted, ref, watch } from 'vue'

const { goTo } = useNavigation()

const cachedPages = ref({})
const currentPage = ref(1)
const menus = ref([])
const total = ref(0)

const pageSize = ref(10)

const categories = [
  { label: '主食', value: 0 },
  { label: '飲料', value: 1 },
]
const selectedCategory = ref(null)

const fetchMenus = async (category, page) => {
  const key = `${category}-${page}`

  if (cachedPages.value[key]) {
    menus.value = cachedPages.value[key].content
    currentPage.value = page
    total.value = cachedPages.value[key].totalElements
    pageSize.value = cachedPages.value[key].size
    return
  }
  const res = await api.getManageMenus(category, page)
  menus.value = res.data.content
  total.value = res.data.totalElements
  currentPage.value = page
  pageSize.value = res.data.size
  cachedPages.value[key] = res.data
}

watch(selectedCategory, () => {
  fetchMenus(selectedCategory.value, 1)
})

const editMenu = (menuId) => {
  goTo('EditMenu', { id: menuId })
}

const deleteMenu = async (menuId) => {
  await ElMessageBox.confirm('確定要刪除這菜單嗎？此操作無法復原。', '警告', {
    confirmButtonText: '確定',
    cancelButtonText: '取消',
    type: 'warning',
  })

  const res = await api.deleteMenu(menuId)
  if (res.responseCode === '200') {
    ElMessage.success('商品刪除成功！')

    //更新該筆資料
    const index = menus.value.findIndex((p) => p.id === menuId)
    if (index !== -1) {
      menus.value[index].status = 0

      // menus.value.splice(index.status, 1)
    }
    categories.value = [...new Set(menus.value.map((m) => m.category))]
  }
}

onMounted(async () => {
  fetchMenus(selectedCategory.value, 1)
})
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
}

.select-category {
  margin-left: 16px;
  width: 160px;
}

.menu-table-container {
  overflow-x: auto;
}

.img-rounded {
  border-radius: 8px;
}

.stock-wrapper {
  display: flex;
  flex-direction: column;
  align-items: center;
}

.stock-text {
  font-size: 14px;
}

.stock-warning {
  font-size: 12px;
  color: red;
  margin-top: 4px;
}

.states-available {
  color: rgb(2, 190, 2);
}

.states-delete {
  color: red;
}

/* 深層選擇器修改 Element Plus 元件樣式 */
::v-deep(.el-input-number.el-input-number--small) {
  width: 90px;
}

::v-deep(.el-input-number.el-input-number--small .el-input__inner) {
  height: 24px;
  line-height: 24px;
  font-size: 12px;
}

::v-deep(.el-input-number.el-input-number--small .el-input-number__decrease),
::v-deep(.el-input-number.el-input-number--small .el-input-number__increase) {
  height: 24px;
  width: 24px;
}
</style>
