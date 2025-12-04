<template>
  <el-dialog v-model="localVisible" @close="close" title="購物車" width="400px">
    <div v-if="cartStore.cartEmpty" style="text-align: center; color: #888; margin: 1rem 0">
      購物車是空的
    </div>
    <div v-else style="display: flex; justify-content: space-between; margin-bottom: 8px">
      <el-table :data="cart" style="width: 100%">
        <el-table-column label="餐點" width="80">
          <template #default="scope">
            <el-image
              :src="scope.row.imageBase64"
              style="width: 50px; height: 50px; border-radius: 4px"
              fit="cover"
            />
          </template>
        </el-table-column>
        <el-table-column label="名稱" min-width="80" max-width="150">
          <template #default="scope">
            <span>{{ scope.row.name }}</span>
          </template>
        </el-table-column>
        <el-table-column label="價格" width="80">
          <template #default="scope">
            <span class="font-semibold">${{ scope.row.price }}</span>
          </template>
        </el-table-column>
        <el-table-column label="數量" width="150">
          <template #default="scope">
            <el-input-number v-model="scope.row.quantity" :min="1" size="small" />
          </template>
        </el-table-column>
        <el-table-column label="小計" width="80">
          <template #default="scope">
            <span class="font-semibold">${{ scope.row.price * scope.row.quantity }}</span>
          </template>
        </el-table-column>
        <el-table-column label="操作" width="60">
          <template #default="scope">
            <el-button
              type="danger"
              :icon="Delete"
              circle
              plain
              size="small"
              @click="$emit('removeItem', { id: scope.row.id, name: scope.row.name })"
            />
          </template>
        </el-table-column>
      </el-table>
    </div>
    <div style="text-align: right; margin-top: 1rem">
      <div class="cart-summary">
        <p class="label">總計:</p>
        <p class="price">${{ cartStore.totalPrice }}</p>
      </div>
      <el-button type="danger" @click="show = true" :disabled="cartStore.cartEmpty">清空</el-button>
      <el-button type="primary" @click="emit('checkout')" :disabled="cartStore.cartEmpty"
        >結帳</el-button
      >
    </div>
    <AlertBox
      v-model:visible="show"
      title="清空確認"
      message="確定要清空購物車嗎？"
      :buttons="[
        { text: '取消', color: 'secondary', onClick: () => (show = false) },
        { text: '確認清空', color: 'danger', onClick: () => emit('clearCart') },
      ]"
      size="small"
      :autoClose="false"
    />
  </el-dialog>
</template>

<script setup>
import AlertBox from '@/components/AlertBox.vue'
import { useCartStore } from '@/stores/car'
import { Delete } from '@element-plus/icons-vue'
import { ElButton, ElDialog, ElInputNumber } from 'element-plus'
import { computed, defineEmits, defineProps, ref, watch } from 'vue'

const props = defineProps({
  visible: Boolean,
})

const emit = defineEmits(['update:visible', 'removeItem', 'checkout', 'clearCart'])
const cartStore = useCartStore()
const cart = computed(() => cartStore.cart)
const localVisible = ref(props.visible)
const show = ref(false)

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

<style scoped>
.cart-summary {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 1rem; /* mb-4 */
}

.cart-summary .label {
  font-size: 1.25rem; /* text-xl */
  font-weight: bold; /* font-bold */
}

.cart-summary .price {
  font-size: 1.5rem; /* text-5xl */
  font-weight: bold; /* font-bold */
  color: #dc2626; /* text-red-600 */
}
</style>
