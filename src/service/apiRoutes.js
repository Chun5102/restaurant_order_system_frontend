export const API_ROUTES = {
  // Menu
  MENU_ADD: '/menu/addMenu',
  MENU_UPDATE: (id) => `/menu/updateMenu/${id}`,
  MENU_DELETE: (id) => `/menu/deleteMenu/${id}`,
  MENU_GET_BY_ID: (id) => `/menu/getMenu/${id}`,
  MENU_LIST: (category, page) => `/menu/getMenus?category=${category}&page=${page}`,
  MENU_MANAGEMENT_LIST: '/menu/getManageMenus',

  // Table
  TABLE_OPEN: (qrCode) => `/table/openTable/${qrCode}`,
  TABLE_CHECK: '/table/checkTable',
  TABLE_ADD: '/table/addTable',
  TABLE_UPDATE: (tableId) => `/table/updateTable/${tableId}`,
  TABLE_UPDATE_STATUS: (tableId, status) => `/table/updateTableStatus/${tableId}?status=${status}`,
  TABLE_LIST: '/table/getAllTable',
  TABLE_GET_BY_ID: (tableId) => `/table/getTableById/${tableId}`,
  TABLE_STATUS: '/table/getTableStatus',

  // Order
  ADD_ORDER: '/order/addOrder',
  UPDATE_ORDER: '/order/updateOrder',
  DELETE_ORDER: (orderId) => `/order/deleteOrder/${orderId}`,
  CANCEL_ORDER_BY_CUSTOMER: (orderId) => `/order/cancelOrderByCustomer/${orderId}`,
  CANCEL_ORDER_BY_STAFF: (orderId) => `/order/cancelOrderByStaff/${orderId}`,
  PAY_ORDER: (code) => `/order/payOrder?code=${code}`,
  GET_TABLE_ORDER: '/order/getTableOrder',
  GET_UNPAID_MAIN_ORDERS: '/order/getUnpaidMainOrders',
  GET_HISTORY_MAIN_ORDERS: '/order/getHistoryMainOrders',
  GET_MAIN_ORDER_DETAILS: (code) => `/order/getOrdersByMainOrderCode?code=${code}`,
  GET_UNPAID_ORDERS: '/order/getUnpaidOrders',
  GET_KITCHEN_ORDERS: '/order/getKitchenOrders',
  GET_RUNNER_ORDERS: '/order/getRunnerOrders',

  //Staff
  LOGIN: '/staff/login',
  LOGOUT: '/staff/logout',
  ADD_STAFF: '/staff/addStaff',
  UPDATE_STAFF: '/staff/updateStaff',
  TOGGLE_STAFF_ACTIVE: (id) => `/staff/toggleStaffActive/${id}`,
  GET_ALL_STAFF: '/staff/getAllStaff',
  GET_STAFF_BY_ID: (id) => `/staff/getStaffById/${id}`,
}
