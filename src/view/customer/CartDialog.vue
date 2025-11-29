<script setup>
import { ElButton, ElDialog } from 'element-plus'
import { defineEmits, defineProps, ref, watch } from 'vue'

const props = defineProps({
  visible: Boolean,
  cartItems: {
    type: Array,
    default: () => [],
  },
})

const emit = defineEmits(['update:visible', 'removeItem', 'checkout'])

const localVisible = ref(props.visible)

// 同步父層傳入的 visible
watch(
  () => props.visible,
  (val) => {
    localVisible.value = val
  },
)

// localVisible 改變時，通知父層
watch(localVisible, (val) => {
  emit('update:visible', val)
})

const close = () => {
  localVisible.value = false
}
</script>

<template>
  <el-dialog v-model="localVisible" @close="close" title="購物車" width="400px">
    <div v-if="cartItems.length === 0" style="text-align: center; color: #888; margin: 1rem 0">
      購物車是空的
    </div>
    <div
      v-for="item in cartItems"
      :key="item.id"
      style="display: flex; justify-content: space-between; margin-bottom: 8px"
    >
      <span>{{ item.name }} x {{ item.qty }} - {{ item.price * item.qty }} 元</span>
      <el-button type="text" @click="emit('removeItem', item.id)">刪除</el-button>
    </div>
    <div style="text-align: right; margin-top: 1rem">
      <el-button type="primary" @click="emit('checkout')">結帳</el-button>
    </div>
  </el-dialog>
</template>
