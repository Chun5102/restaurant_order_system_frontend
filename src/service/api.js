import { API_ROUTES } from './apiRoutes'
import apiService from './apiService'

const api = {
  //取得菜單資料
  getMenus: () => apiService.get(API_ROUTES.MENU_LIST),
}

export default api
