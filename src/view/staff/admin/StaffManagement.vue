<template>
  <div class="container">
    <div class="header">
      <h2 class="title">員工管理</h2>
      <div class="header-actions">
        <el-button @click="goTo('AddStaff')" type="primary"> + 新增員工 </el-button>

        <el-select v-model="selectedRole" placeholder="選擇角色" clearable class="select-role">
          <el-option label="全部" value="" />
          <el-option
            v-for="category in categories"
            :key="category"
            :label="category"
            :value="category"
          />
        </el-select>
      </div>
    </div>

    <div class="menu-table-container">
      <el-table :data="filteredstaff" style="width: 100%" stripe border>
        <el-table-column prop="name" label="員工名稱" />

        <el-table-column prop="role" label="角色" />

        <el-table-column prop="username" label="帳號" />

        <el-table-column prop="isActive" label="狀態">
          <template #default="{ row }">
            <span :class="row.isActive ? 'states-available' : 'states-delete'">
              {{ row.isActive ? '啟用中' : '已停用' }}
            </span>
          </template>
        </el-table-column>

        <el-table-column label="操作" width="220" fixed="right">
          <template #default="{ row }">
            <el-button size="small" type="primary" @click="editStaff(row.id)"> 編輯 </el-button>

            <el-button size="small" type="danger" @click="toggleStaffActive(row.id)">
              {{ row.isActive ? '停用' : '啟用' }}
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
import { computed, onMounted, ref } from 'vue'

const { goTo } = useNavigation()

const staff = ref([])
const categories = ref([])
const selectedRole = ref('')

const filteredstaff = computed(() => {
  return selectedRole.value ? staff.value.filter((s) => s.role === selectedRole.value) : staff.value
})

const editStaff = (staffId) => {
  goTo('EditStaff', { id: staffId })
}

const toggleStaffActive = async (staffId) => {
  const isActive = staff.value.find((s) => s.id === staffId).isActive

  await ElMessageBox.confirm(`確定要${isActive ? '停用' : '啟用'}這員工嗎？`, '警告', {
    confirmButtonText: '確定',
    cancelButtonText: '取消',
    type: 'warning',
  })

  const res = await api.toggleStaffActive(staffId)
  if (res.responseCode === '200') {
    ElMessage.success(`員工${isActive ? '停用' : '啟用'}成功！`)

    //更新該筆資料
    const index = staff.value.findIndex((s) => s.id === staffId)
    if (index !== -1) {
      staff.value[index].isActive = !isActive
    }
    categories.value = [...new Set(staff.value.map((s) => s.role))]
  }
}

onMounted(async () => {
  const res = await api.getAllStaff()
  staff.value = res.data
  categories.value = [...new Set(staff.value.map((s) => s.role))]
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

.select-role {
  margin-left: 16px;
  width: 160px;
}

.menu-table-container {
  overflow-x: auto;
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
