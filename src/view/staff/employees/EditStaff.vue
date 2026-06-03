<template>
  <div class="max-w-2xl mx-auto mt-10 p-6 border rounded bg-white shadow">
    <h2 class="text-2xl font-bold mb-4">編輯員工</h2>

    <el-form :model="form" label-width="100px" :rules="rules" ref="formRef">
      <el-form-item label="帳號" prop="username">
        <span>{{ form.username }}</span>
      </el-form-item>

      <el-form-item label="員工名稱" prop="name">
        <el-input v-model="form.name" placeholder="請輸入員工名稱" />
      </el-form-item>

      <el-form-item label="角色" prop="role">
        <el-select v-model="form.role" placeholder="請選擇角色">
          <el-option label="admin" value="admin" />
          <el-option label="kitchen" value="kitchen" />
          <el-option label="runner" value="runner" />
          <el-option label="front" value="front" />
        </el-select>
      </el-form-item>

      <el-form-item label="密碼" prop="password">
        <template v-if="form.resetPassword">
          <el-input v-model="form.password" placeholder="請輸入密碼" clearable showpassword />
        </template>
        <el-button
          link
          :type="form.resetPassword ? 'danger' : 'primary'"
          @click="form.resetPassword = !form.resetPassword"
          >{{ form.resetPassword ? '取消修改' : '修改密碼' }}</el-button
        >
      </el-form-item>

      <el-form-item>
        <el-button type="primary" @click="submitForm">更新員工</el-button>
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

const formRef = ref()

const { goTo } = useNavigation()
const route = useRoute()

const staffId = ref(null)
const form = reactive({
  name: '',
  role: '',
  username: '',
  password: '',
  resetPassword: false,
})

const rules = {
  name: [{ required: true, message: '請輸入員工名稱', trigger: 'blur' }],
  role: [{ required: true, message: '請選擇角色', trigger: 'change' }],
  password: [
    { required: form.resetPassword, message: '請輸入密碼', trigger: 'blur' },
    {
      pattern: /^(?=.*[A-Za-z])(?=.*\d)[A-Za-z\d]{8,32}$/,
      message: '密碼只能有英文與數字,且需包含英文與數字,字數範圍為8-32',
      trigger: 'blur',
    },
  ],
}

function submitForm() {
  formRef.value.validate(async (valid) => {
    if (!valid) return

    await api.updateStaff(form)
    ElMessage.success('員工更新成功！')
    goTo('Employees')
  })
}

function back() {
  goTo('Employees')
}

onMounted(async () => {
  staffId.value = route.params?.id
  const res = await api.getStaffById(staffId.value)
  if (res.responseCode === '200') {
    const staff = res.data

    Object.assign(form, staff)
  }
})
</script>
