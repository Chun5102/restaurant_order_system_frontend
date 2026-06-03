<template>
  <header>
    <TopBar
      :title="`後臺管理(員工: ${name} / ${role})`"
      :actions="actions = [{ icon: UserFilled, label: '登出', onClick: logout }]"
    />
  </header>
  <main>
    <div class="layout">
      <CategorySidebar :categories="navMenu" />

      <div class="content">
        <Breadcrumb :categories="navMenu" />
        <router-view />
      </div>
    </div>
  </main>
</template>

<script setup>
import Breadcrumb from '@/components/Breadcrumb.vue'
import CategorySidebar from '@/components/CategorySidebar.vue'
import { getNavMenu } from '@/components/getNavMenu'
import TopBar from '@/components/TopBar.vue'
import { useNavigation } from '@/composables/useNavigation'
import { useStaffDataStore } from '@/stores/staffData'
import { UserFilled } from '@element-plus/icons-vue'
import { ElMessage } from 'element-plus'
import { computed } from 'vue'

import api from '@/service/api'

const { goTo } = useNavigation()

const staffData = useStaffDataStore()
const name = staffData.name
const role = staffData.role

const navMenu = computed(() => getNavMenu(staffData.role))

const logout = async () => {
  try {
    await api.logout()
  } finally {
    localStorage.removeItem('accessToken')
    staffData.clearStaffData()

    ElMessage.success('登出成功！')

    goTo('Login')
  }
}
</script>

<style scoped>
.layout {
  display: flex;
  min-height: 100vh;
  background-color: #f5f7fa; /* 整體背景 */
}
/* 主內容區 */
.content {
  flex: 1;
  padding: 32px;
  background-color: #f5f7fa;
  overflow: auto;
}
</style>
