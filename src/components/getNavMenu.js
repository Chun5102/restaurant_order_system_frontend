import { Dish, Food, Location, Odometer, Setting, Tickets, User } from '@element-plus/icons-vue'

/**
 * 根據使用者角色動態產生導覽選單
 * @param {string} userRole - 使用者的角色，例如 'ADMIN', 'USER'
 * @returns {Array} - 組裝好的選單陣列
 */
export function getNavMenu(userRole) {
  const categories = [
    {
      name: 'management',
      label: '管理相關',
      icon: Odometer,
      clickable: false,
      subs: [
        { name: 'tables', label: '桌子管理', icon: Location },
        { name: 'menus', label: '菜單管理', icon: Food },
        { name: 'orders', label: '訂單管理', icon: Tickets },
        { name: 'employees', label: '員工管理', icon: User },
      ],
    },
    {
      name: 'front',
      label: '外場',
      icon: Dish,
      clickable: false,
      subs: [{ name: 'orders', label: '訂單處理', icon: Tickets }],
    },
    {
      name: 'settings',
      label: '設定相關',
      icon: Setting,
      clickable: false,
      subs: [{ name: 'setting', label: '設定', icon: Setting }],
    },
  ]

  if (userRole !== 'admin') {
    return categories.filter((category) => category.name !== 'management')
  }

  if (userRole === 'front') {
    return categories.filter((category) => category.name === 'front')
  }

  return categories
}
