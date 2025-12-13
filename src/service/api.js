import { API_ROUTES } from './apiRoutes'
import apiService from './apiService'

const tableToken = { needTableToken: true }

const api = {
  //取得菜單資料
  getMenus: (category, page) => apiService.get(API_ROUTES.MENU_LIST(category, page)),
  //開啟桌子
  openTable: (qrCode) => apiService.post(API_ROUTES.TABLE_OPEN(qrCode)),
  //檢查桌子資料
  checkTable: () => apiService.get(API_ROUTES.TABLE_CHECK, tableToken),
  //取得桌子狀態資料
  getTableStatus: () => apiService.get(API_ROUTES.TABLE_STATUS, tableToken),
  //新增訂單
  addOrder: (order) => apiService.post(API_ROUTES.ADD_ORDER, order, tableToken),
  //取得桌子訂單
  getTableOrder: () => apiService.get(API_ROUTES.GET_TABLE_ORDER, tableToken),
  //取消訂單
  cancelOrder: (orderid) => apiService.post(API_ROUTES.DELETE_ORDER(orderid), {}, tableToken),
}

export default api
