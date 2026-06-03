<template>
  <div class="max-w-2xl mx-auto mt-10 p-6 border rounded bg-white shadow">
    <h2 class="text-2xl font-bold mb-4">新增員工</h2>

    <el-form :model="form" label-width="100px" :rules="rules" ref="formRef">
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

      <el-form-item label="帳號" prop="username">
        <el-input v-model="form.username" placeholder="請輸入帳號" clearable />
      </el-form-item>

      <el-form-item label="密碼" prop="password">
        <el-input v-model="form.password" placeholder="請輸入密碼" clearable />
      </el-form-item>

      <el-form-item>
        <el-button type="primary" @click="submitForm">新增員工</el-button>
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
import { reactive, ref } from 'vue'
const formRef = ref()

const { goTo } = useNavigation()
const form = reactive({
  name: '',
  role: '',
  username: '',
  password: '',
})

const rules = {
  name: [{ required: true, message: '請輸入員工名稱', trigger: 'blur' }],
  role: [{ required: true, message: '請選擇角色', trigger: 'change' }],
  username: [
    { required: true, message: '請輸入帳號', trigger: 'blur' },
    {
      pattern: /^[a-zA-Z0-9]{4,20}$/,
      message: '帳號只能有英文與數字,字數範圍為4-20',
      trigger: 'blur',
    },
  ],
  password: [
    { required: true, message: '請輸入密碼', trigger: 'blur' },
    {
      pattern: /^(?=.*[A-Za-z])(?=.*\d)[A-Za-z\d]{8,32}$/,
      message: '密碼只能有英文與數字,且需包含英文與數字,字數範圍為8-32',
      trigger: 'blur',
    },
  ],
}

function resetForm() {
  form.name = ''
  form.role = ''
  form.username = ''
  form.password = ''
}

function submitForm() {
  formRef.value.validate(async (valid) => {
    if (!valid) return

    const res = await api.addStaff(form)

    ElMessage.success(res.data)
    resetForm()
  })
}

function back() {
  goTo('Employees')
}
</script>
