export const API_ROUTES = {
  MENU_LIST: (category, page) => `/menu/getMenus?category=${category}&page=${page}`,
  TABLE_OPEN: (tableNumber) => `/table/openTable/${tableNumber}`,
  TABLE_CHECK: '/table/checkTable',
  TABLE_STATUS: '/table/getTableStatus',
  ADD_ORDER: '/order/addOrder',
  GET_TABLE_ORDER: '/order/getTableOrder',
  DELETE_ORDER: (orderId) => `/order/deleteOrder/${orderId}`,
}
