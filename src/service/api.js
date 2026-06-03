import { API_ROUTES } from './apiRoutes'
import apiService from './apiService'

const tableToken = { needTableToken: true }

const api = {
  //新增菜單
  addMenu: (data) => apiService.post(API_ROUTES.MENU_ADD, data),
  //更新菜單
  updateMenu: (menuId, data) => apiService.put(API_ROUTES.MENU_UPDATE(menuId), data),
  //刪除菜單
  deleteMenu: (menuId) => apiService.put(API_ROUTES.MENU_DELETE(menuId)),
  //取得菜單資料(id)
  getMenuById: (menuId) => apiService.get(API_ROUTES.MENU_GET_BY_ID(menuId)),
  //取得菜單資料
  getMenus: (category, page) => apiService.get(API_ROUTES.MENU_LIST(category, page)),
  //取得管理菜單資料
  getManageMenus: (category, page) => {
    let url = `${API_ROUTES.MENU_MANAGEMENT_LIST}?page=${page}`

    if (category !== null) {
      url += `&category=${category}`
    }

    return apiService.get(url)
  },

  //開啟桌子
  openTable: (qrCode) => apiService.put(API_ROUTES.TABLE_OPEN(qrCode)),
  //檢查桌子資料
  checkTable: () => apiService.get(API_ROUTES.TABLE_CHECK, tableToken),
  //新增桌子
  addTable: () => apiService.post(API_ROUTES.TABLE_ADD),
  //更新桌子資料
  updateTable: (tableId, data) => apiService.put(API_ROUTES.TABLE_UPDATE(tableId), data),
  //更新桌子狀態
  updateTableStatus: (tableId, status) =>
    apiService.put(API_ROUTES.TABLE_UPDATE_STATUS(tableId, status)),
  //取得所有桌子資料
  getTables: () => apiService.get(API_ROUTES.TABLE_LIST),
  //取得桌子資料
  getTableById: (tableId) => apiService.get(API_ROUTES.TABLE_GET_BY_ID(tableId)),
  //取得桌子狀態資料
  getTableStatus: () => apiService.get(API_ROUTES.TABLE_STATUS, tableToken),

  //新增訂單
  addOrder: (data) => apiService.post(API_ROUTES.ADD_ORDER, data, tableToken),
  //更新訂單
  updateOrder: (data) => apiService.put(API_ROUTES.UPDATE_ORDER, data),
  //取得桌子訂單
  getTableOrder: () => apiService.get(API_ROUTES.GET_TABLE_ORDER, tableToken),
  //取得未付款主訂單
  getUnpaidMainOrders: () => apiService.get(API_ROUTES.GET_UNPAID_MAIN_ORDERS),
  //取得歷史主訂單
  getHistoryMainOrders: () => apiService.get(API_ROUTES.GET_HISTORY_MAIN_ORDERS),
  //取得主訂單的所有訂單
  getMainOrderDetails: (code) => apiService.get(API_ROUTES.GET_MAIN_ORDER_DETAILS(code)),
  //取得未付款訂單列表
  getUnpaidOrders: () => apiService.get(API_ROUTES.GET_UNPAID_ORDERS),
  //取得廚房訂單
  getKitchenOrders: () => apiService.get(API_ROUTES.GET_KITCHEN_ORDERS),
  //取得送餐訂單
  getRunnerOrders: () => apiService.get(API_ROUTES.GET_RUNNER_ORDERS),
  //取消訂單(顧客端)
  cancelOrderByCustomer: (orderId) =>
    apiService.put(API_ROUTES.CANCEL_ORDER_BY_CUSTOMER(orderId), {}, tableToken),
  //取消訂單(員工端)
  cancelOrderByStaff: (orderId) => apiService.put(API_ROUTES.CANCEL_ORDER_BY_STAFF(orderId)),
  //訂單結帳
  payOrder: (code, data) => apiService.put(API_ROUTES.PAY_ORDER(code), data),

  //員工登入
  login: (data) => apiService.post(API_ROUTES.LOGIN, data),

  //員工登出
  logout: () => apiService.post(API_ROUTES.LOGOUT),

  //新增員工
  addStaff: (data) => apiService.post(API_ROUTES.ADD_STAFF, data),
  //更新員工資料
  updateStaff: (data) => apiService.put(API_ROUTES.UPDATE_STAFF, data),

  //更新員工狀態
  toggleStaffActive: (staffId) => apiService.put(API_ROUTES.TOGGLE_STAFF_ACTIVE(staffId)),

  //取得所有員工資料
  getAllStaff: () => apiService.get(API_ROUTES.GET_ALL_STAFF),

  //取得員工資料(id)
  getStaffById: (staffId) => apiService.get(API_ROUTES.GET_STAFF_BY_ID(staffId)),
}

export default api
