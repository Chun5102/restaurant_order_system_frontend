<template>
  <div class="max-w-2xl mx-auto mt-10 p-6 border rounded bg-white shadow">
    <h2 class="text-2xl font-bold mb-4">編輯桌子</h2>

    <el-form :model="form" label-width="100px" :rules="rules" ref="formRef">
      <el-form-item label="桌號" prop="id">
        <span>{{ form.id }}</span>
      </el-form-item>

      <el-form-item label="狀態" prop="status">
        <el-select v-model="form.status" placeholder="請選擇狀態">
          <el-option label="空閒" value="空閒" />
          <el-option label="使用中" value="使用中" />
          <el-option label="點餐" value="點餐" />
          <el-option label="停用" value="停用" />
        </el-select>
      </el-form-item>

      <el-form-item label="開桌時間">
        <span>{{ form.openedAt }}</span>
        <el-button link type="danger" @click="clearOpenedAt">清除</el-button>
      </el-form-item>

      <el-form-item label="桌子編號" prop="qrCode">
        <span>{{ form.qrCode }}</span>
      </el-form-item>

      <el-form-item>
        <el-button type="primary" @click="submitForm">更新桌子</el-button>
        <el-button @click="resetForm" type="default">重設</el-button>
        <el-button type="success" @click="back">返回</el-button>
      </el-form-item>
    </el-form>
  </div>
</template>

<script setup>
import { useNavigation } from '@/composables/useNavigation'
import api from '@/service/api'
import { ElMessage } from 'element-plus'
import { onMounted, reactive, ref } from 'vue'
import { useRoute } from 'vue-router'

const route = useRoute()
const formRef = ref()
const tableId = ref(null) // 新增一個 ref 來儲存 id
const enableClearOpenedAt = ref(false)

const { goTo } = useNavigation()
const form = reactive({
  id: '',
  status: '',
  openedAt: '',
  qrCode: '',
})

const rules = {
  status: [{ required: true, message: '請選擇狀態', trigger: 'change' }],
}

function clearOpenedAt() {
  form.openedAt = null
  enableClearOpenedAt.value = true
}

function resetForm() {
  form.status = '空閒'
  form.openedAt = null
  // formRef.value.resetFields()
}

function submitForm() {
  formRef.value.validate(async (valid) => {
    if (!valid) return

    await api.updateTable(tableId.value, {
      status: form.status,
      clearOpenedAt: enableClearOpenedAt.value,
    })
    ElMessage.success('桌子更新成功！')
    goTo('Tables')
  })
}

function back() {
  goTo('Tables')
}

onMounted(async () => {
  tableId.value = route.params?.id
  const res = await api.getTableById(tableId.value)
  if (res.responseCode === '200') {
    const tables = res.data
    // 載入資料到表單
    Object.assign(form, tables)
  }
})
</script>
