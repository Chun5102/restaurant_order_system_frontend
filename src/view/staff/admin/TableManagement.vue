<template>
  <div class="container">
    <div class="header">
      <h2 class="title">桌子管理</h2>
      <div class="header-actions">
        <el-button @click="addTable()" type="primary"> + 新增桌子 </el-button>

        <el-select v-model="selectedStatus" placeholder="選擇分類" clearable class="select-status">
          <el-option label="全部" value="" />
          <el-option v-for="status in states" :key="status" :label="status" :value="status" />
        </el-select>
      </div>
    </div>

    <div class="menu-table-container">
      <el-table :data="filteredtables" style="width: 100%" stripe border>
        <el-table-column prop="number" label="桌號" width="100" align="center" sortable>
          <template #default="{ row }">
            <span class="table-text">{{ row.id }}</span>
          </template>
        </el-table-column>

        <el-table-column label="二維碼" width="120" align="center">
          <template #default="{ row }">
            <img :src="row.qrImg" style="width: 80px; height: 80px" />
          </template>
        </el-table-column>

        <el-table-column prop="states" label="狀態" width="100">
          <template #default="{ row }">
            <span :class="row.status === '空閒' ? 'states-available' : 'states-delete'">
              {{ row.status }}
            </span>
          </template>
        </el-table-column>

        <el-table-column prop="openedAt" label="開桌時間" width="194" sortable>
          <template #default="{ row }">
            {{ row.openedAt }}
          </template>
        </el-table-column>

        <el-table-column prop="qrCode" label="編號" width="200">
          <template #default="{ row }"> ${{ row.qrCode }} </template>
        </el-table-column>

        <el-table-column label="操作" width="180" fixed="right">
          <template #default="{ row }">
            <el-button size="small" type="primary" @click="editTable(row.id)"> 編輯 </el-button>
            <el-button size="small" type="danger" @click="toggleTableStatus(row.id, row.status)">
              {{ row.status === '停用' ? '啟用' : '停用' }}
            </el-button>
          </template>
        </el-table-column>
      </el-table>
    </div>
  </div>
</template>

<script setup>
import { useNavigation } from '@/composables/useNavigation'
import api from '@/service/api'
import { ElMessage, ElMessageBox } from 'element-plus'
import QRCode from 'qrcode'
import { computed, onMounted, ref } from 'vue'

const { goTo } = useNavigation()

const tables = ref([])
const states = ref([])
const selectedStatus = ref('')

const baseUrl = import.meta.env.VITE_WEB_BASE_URL

const filteredtables = computed(() => {
  if (selectedStatus.value === 0) {
    return tables.value.filter((p) => p.status === selectedStatus.value)
  }
  return selectedStatus.value
    ? tables.value.filter((p) => p.status === selectedStatus.value)
    : tables.value
})

const addTable = async () => {
  await api.addTable()
  await getTables()
}

const editTable = (tableId) => {
  goTo('EditTable', { id: tableId })
}

const toggleTableStatus = (tableId, status) => {
  status = status === '停用' ? '空閒' : '停用'
  updateTableStatus(tableId, status)
}

const updateTableStatus = async (tableId, status) => {
  const msg = status === '停用' ? '確定要停用這張桌子嗎？' : '確定要啟用這張桌子嗎？'

  await ElMessageBox.confirm(msg, '警告', {
    confirmButtonText: '確定',
    cancelButtonText: '取消',
    type: 'warning',
  })

  const res = await api.updateTableStatus(tableId, status)
  if (res.responseCode === '200') {
    ElMessage.success('桌子停用成功！')

    //更新該筆資料
    const index = tables.value.findIndex((t) => t.id === tableId)
    if (index !== -1) {
      tables.value[index].status = res.data.status
    }
    states.value = [...new Set(tables.value.map((m) => m.status))]
  }
}

const getTables = async () => {
  const res = await api.getTables()
  const data = res.data

  await Promise.all(
    data.map(async (table) => {
      try {
        table.qrImg = await QRCode.toDataURL(`${baseUrl}/qr/${table.qrCode}`)
      } catch (e) {
        table.qrImg = ''
      }
    }),
  )

  tables.value = data
  states.value = [...new Set(tables.value.map((m) => m.status))]
}

onMounted(getTables)
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

.select-status {
  margin-left: 16px;
  width: 160px;
}

.menu-table-container {
  overflow-x: auto;
}

.table-text {
  font-size: 30px;
}

.img-rounded {
  border-radius: 8px;
}

.stock-wrapper {
  display: flex;
  flex-direction: column;
  align-items: center;
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
