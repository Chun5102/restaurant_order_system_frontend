<!-- src/views/Login.vue -->
<template>
  <div class="login-container">
    <el-card class="login-card">
      <h2 class="title">員工登入</h2>

      <el-form :model="form" :rules="rules" ref="loginForm" label-width="80px">
        <el-form-item label="帳號" prop="username">
          <el-input v-model="form.username" placeholder="請輸入帳號或Email" clearable />
        </el-form-item>

        <el-form-item label="密碼" prop="password">
          <el-input
            v-model="form.password"
            type="password"
            show-password
            placeholder="請輸入密碼"
            clearable
            @keyup.enter="handleLogin"
          />
        </el-form-item>

        <el-form-item>
          <el-checkbox v-model="form.rememberMe">記住我</el-checkbox>
        </el-form-item>

        <el-form-item>
          <el-button type="primary" @click="handleLogin" style="width: 100%"> 登入 </el-button>
        </el-form-item>

        <div class="login-links">
          <el-link type="primary" @click="handleForgotPassword">忘記密碼？</el-link>
        </div>
      </el-form>
    </el-card>
  </div>
</template>

<script setup>
import { useNavigation } from '@/composables/useNavigation'
import api from '@/service/api'
import { setStaffFromToken } from '@/service/setStaffFromToken'
import { useStaffDataStore } from '@/stores/staffData'
import { ElMessage } from 'element-plus'
import { onMounted, ref } from 'vue'

const { goTo } = useNavigation()

const staffData = useStaffDataStore()

const loginForm = ref()

const form = ref({
  username: 'test',
  password: '1234',
  rememberMe: false,
})

// 改進的驗證規則
const rules = {
  username: [
    { required: true, message: '請輸入帳號', trigger: 'blur' },
    {
      pattern: /^[a-zA-Z0-9]{3,20}$/,
      message: '帳號只能有英文與數字',
      trigger: 'blur',
    },
  ],
  password: [
    { required: true, message: '請輸入密碼', trigger: 'blur' },
    {
      pattern: /^[a-zA-Z0-9]{3,20}$/,
      message: '密碼只能有英文與數字',
      trigger: 'blur',
    },
  ],
}

// 載入記住的帳號
onMounted(() => {
  const rememberedUsername = localStorage.getItem('rememberedUsername')
  if (rememberedUsername) {
    form.value.username = rememberedUsername
    form.value.rememberMe = true
  }
})

const handleLogin = async () => {
  if (!loginForm.value) return

  const valid = await loginForm.value.validate()
  if (!valid) return

  const loginData = {
    username: form.value.username,
    password: form.value.password,
    rememberMe: form.value.rememberMe,
    isLogin: true,
  }

  const res = await api.login(loginData)
  const token = res.data

  setStaffFromToken(token)
  localStorage.setItem('accessToken', token)

  ElMessage.success('登入成功！')

  if (staffData.role === 'kitchen') goTo('KitchenOrderBoard')
  else if (staffData.role === 'runner') goTo('RunnerOrderBoard')
  else goTo('Dashboard')
}

const handleForgotPassword = () => {
  ElMessage.info('忘記密碼功能開發中...')
  // router.push('/forgot-password')
}
</script>

<style scoped>
.login-container {
  display: flex;
  justify-content: center;
  align-items: center;

  min-height: 100vh;
  width: 100%;

  /* 🎨 跟 TopBar 同一色系（暖橘漸層） */
  background: linear-gradient(180deg, #fff4ef 0%, #ffe3d9 100%);

  padding: 20px;
  box-sizing: border-box;
}

.login-card {
  width: 100%;
  max-width: 400px;
  padding: 32px;

  border-radius: 1rem;

  /* 白卡片 */
  background: #ffffff;

  /* 跟 TopBar 同風格陰影 */
  box-shadow: 0 6px 16px rgba(0, 0, 0, 0.08);
}

.title {
  text-align: center;
  margin-bottom: 24px;

  font-size: 24px;
  font-weight: bold;

  /* 🎨 主色直接用橘（不要再用漸層字） */
  color: #ffa686;
}

.login-links {
  display: flex;
  justify-content: space-between;
  margin-top: 16px;
}

.el-form-item {
  margin-bottom: 18px;
}

/* Input */
.el-input :deep(.el-input__inner) {
  height: 42px;
  border-radius: 8px;
}

/* focus 改橘色 */
.el-input :deep(.el-input__inner:focus) {
  border-color: #ffa686;
}

/* 按鈕 */
.el-button {
  height: 42px;
  border-radius: 8px;
  font-size: 14px;
}

/* 🎨 主按鈕橘色（跟 TopBar 同） */
.el-button--primary {
  background-color: #ffa686;
  border-color: #ffa686;
}

.el-button--primary:hover {
  background-color: #ff8f6b;
  border-color: #ff8f6b;
}
</style>
