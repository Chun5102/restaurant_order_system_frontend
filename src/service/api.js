import { API_ROUTES } from './apiRoutes'
import apiService from './apiService'

const api = {
  //取得菜單資料
  getMenus: (category, page) => apiService.get(API_ROUTES.MENU_LIST(category, page)),
  //開啟桌子
  openTable: (tableNumber) => apiService.put(API_ROUTES.TABLE_OPEN(tableNumber)),
  //新增訂單
  addOrder: (order) => apiService.post(API_ROUTES.ADD_ORDER, order),
}

export default api
