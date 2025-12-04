<template>
  <el-dialog v-model="localVisible" :title="item?.name" @close="close" width="400px" center>
    <div class="dialog-content">
      <img class="dialog-img" :src="item?.imageBase64" loading="lazy" alt="menu image" />
      <p>{{ item?.description }}</p>
      <p class="dialog-price">{{ item?.price }} 元</p>
      <el-input-number v-model="selectedQty" :min="1" :max="10" />
    </div>
    <template #footer>
      <el-button @click="localVisible = false">取消</el-button>
      <el-button type="primary" @click="addToCart">加入購物車</el-button>
    </template>
  </el-dialog>
</template>

<script setup>
import { ElDialog } from 'element-plus'
import { ref, watch } from 'vue'

const props = defineProps({
  visible: Boolean,
  item: Object,
})
const emit = defineEmits(['update:visible', 'addToCart'])

const localVisible = ref(props.visible)
const selectedQty = ref(1)

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

// 每次開新商品 → 重設數量
watch(
  () => props.item,
  () => {
    selectedQty.value = 1
  },
)

const close = () => {
  localVisible.value = false
}

const addToCart = () => {
  emit('addToCart', {
    selectedItem: props.item,
    selectedQty: selectedQty.value,
  })

  close()
}
</script>

<style scoped>
/* 彈窗內容 */
.dialog-content {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 1rem;
}

.dialog-img {
  width: 350px;
  height: 240px;
  border-radius: 1rem;
  object-fit: cover;
}

.dialog-price {
  font-size: 1.2rem;
  font-weight: bold;
  color: #333;
}
</style>
