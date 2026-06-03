<template>
  <div class="max-w-2xl mx-auto mt-10 p-6 border rounded bg-white shadow">
    <h2 class="text-2xl font-bold mb-4">編輯菜單</h2>

    <el-form :model="form" label-width="100px" :rules="rules" ref="formRef">
      <el-form-item label="菜單名稱" prop="name">
        <el-input v-model="form.name" placeholder="請輸入菜單名稱" />
      </el-form-item>

      <el-form-item label="分類" prop="category">
        <el-select v-model="form.category" placeholder="請選擇分類">
          <el-option label="主食" value="0" />
          <el-option label="飲料" value="1" />
        </el-select>
        <!-- <InputSelect
          v-model="form.category"
          :options="categoryOptions"
          :placeholder="'請選擇分類'"
        /> -->
      </el-form-item>

      <el-form-item label="價格" prop="price">
        <el-input-number v-model="form.price" :min="0" :step="10" />
      </el-form-item>

      <el-form-item label="庫存" prop="stock">
        <el-input-number v-model="form.stock" :min="0" :step="1" />
      </el-form-item>
      <el-form-item label="狀態" prop="status">
        <el-select v-model="form.status" placeholder="請選擇狀態">
          <el-option label="已刪除" value="0" />
          <el-option label="停售" value="1" />
          <el-option label="銷售中" value="2" />
        </el-select>
      </el-form-item>
      <el-form-item label="描述">
        <el-input
          v-model="form.description"
          type="textarea"
          :rows="3"
          placeholder="簡要描述菜單..."
        />
      </el-form-item>

      <el-form-item label="上傳圖片" prop="imageBase64">
        <input type="file" accept="image/*" @change="handleFileChange" />
        <div v-if="imagePreview" class="mt-2">
          <img :src="imagePreview" class="h-32 rounded border" />
          <el-button type="text" @click="removeImage" style="padding: 0">刪除圖片</el-button>
        </div>
      </el-form-item>

      <el-form-item>
        <el-button type="primary" @click="submitForm">更新菜單</el-button>
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
const menuId = ref(null) // 新增一個 ref 來儲存 id

const { goTo } = useNavigation()
const form = reactive({
  name: '',
  category: '',
  price: 100,
  stock: 10,
  status: '',
  description: '',
  imageBase64: '', // 改成 Base64 字串
})

// const categoryOptions = ref([])

const imagePreview = ref(null)

const rules = {
  name: [{ required: true, message: '請輸入商品名稱', trigger: 'blur' }],
  category: [{ required: true, message: '請選擇分類', trigger: 'change' }],
  price: [{ required: true, message: '請輸入價格', trigger: 'blur' }],
  imageBase64: [{ required: true, message: '請上傳圖片', trigger: 'change' }],
}

// 新增一個圖片縮放的方法
function resizeImage(img, fileType, targetWidth, targetHeight) {
  const canvas = document.createElement('canvas')
  const ctx = canvas.getContext('2d')

  // 設定 Canvas 的固定尺寸
  canvas.width = targetWidth
  canvas.height = targetHeight

  let width = img.width
  let height = img.height

  // 計算縮放比例，以確保圖片能完整顯示在目標尺寸內
  const scale = Math.min(targetWidth / width, targetHeight / height)
  const newWidth = width * scale
  const newHeight = height * scale

  // 計算繪製的起始位置，讓圖片置中
  const xOffset = (targetWidth - newWidth) / 2
  const yOffset = (targetHeight - newHeight) / 2

  // 繪製圖片到 Canvas，不足的部分會是透明（留白）
  ctx.drawImage(img, xOffset, yOffset, newWidth, newHeight)

  return canvas.toDataURL(fileType)
}

/**
 * 處理檔案選擇變化
 * @param {InputEvent} event - Input 事件
 * @description 讀取檔案， resize 圖片，將結果 set 到 form.imageBase64
 */
function handleFileChange(event) {
  const file = event.target.files[0]
  if (!file) return

  const reader = new FileReader()
  reader.readAsDataURL(file)
  reader.onload = () => {
    const img = new Image()
    img.src = reader.result
    img.onload = () => {
      const MAX_WIDTH = 200 // 你希望的圖片最大寬度
      const MAX_HEIGHT = 150 // 你希望的圖片最大高度
      // 呼叫縮圖方法，並將結果賦值給 form
      const resizedImage = resizeImage(img, file.type, MAX_WIDTH, MAX_HEIGHT)
      form.imageBase64 = resizedImage
      form.imageType = file.type // 儲存圖片類型
      imagePreview.value = resizedImage
    }
  }
}

function removeImage() {
  form.imageBase64 = ''
  imagePreview.value = null
  // 清空 input[type=file] 欄位(可用 ref 或下方方法)
  document.querySelector('input[type="file"]').value = ''
}

function resetForm() {
  form.name = ''
  form.category = ''
  form.price = null
  form.stock = null
  form.status = '銷售中'
  form.description = ''
  form.imageBase64 = ''
  imagePreview.value = null
  formRef.value.resetFields()
}

function submitForm() {
  formRef.value.validate(async (valid) => {
    if (!valid) return

    if (form.status === '已刪除') {
      form.status = 0
    } else if (form.status === '停售') {
      form.status = 1
    } else {
      form.status = 2
    }

    await api.updateMenu(menuId.value, form)
    ElMessage.success('菜單更新成功！')
    goTo('Menus')

    document.querySelector('input[type="file"]').value = ''
  })
}

function back() {
  goTo('Menus')
}

onMounted(async () => {
  menuId.value = route.params?.id
  const res = await api.getMenuById(menuId.value)
  if (res.responseCode === '200') {
    const menu = res.data
    // 載入資料到表單
    Object.assign(form, menu)
    if (form.status === 0) {
      form.status = '已刪除'
    } else if (form.status === 1) {
      form.status = '停售'
    } else {
      form.status = '銷售中'
    }

    imagePreview.value = menu.imageBase64
  }
})
</script>
