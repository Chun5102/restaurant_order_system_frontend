<template>
  <div>正在跳轉...</div>
</template>

<script setup>
import { useNavigation } from '@/composables/useNavigation'
import api from '@/service/api'
import { onMounted } from 'vue'
import { useRoute } from 'vue-router'

const route = useRoute()
const { replaceTo } = useNavigation()

onMounted(async () => {
  try {
    const res = await api.openTable(route.params.qrCode)

    localStorage.setItem('tableToken', res.data)
    replaceTo('Home')
  } catch (error) {
    localStorage.removeItem('tableToken')
    replaceTo('Home')
  }
})
</script>

<style scoped></style>
