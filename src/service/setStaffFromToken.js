import { ElMessage } from 'element-plus'
import jwt_decode from 'jwt-decode'
import { useStaffDataStore } from '../stores/staffData'

export const setStaffFromToken = (token) => {
  try {
    const payload = jwt_decode(token)
    const staffDataStore = useStaffDataStore()
    staffDataStore.setStaffData(payload.name, payload.role)
  } catch (error) {
    ElMessage.error('驗證失敗！')
  }
}
