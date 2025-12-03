export const API_ROUTES = {
  MENU_LIST: (category, page) => `/menu/getMenus?category=${category}&page=${page}`,
  TABLE_OPEN: (tableNumber) => `/table/openTable/${tableNumber}`,
  ADD_ORDER: '/order/addOrder',
}
