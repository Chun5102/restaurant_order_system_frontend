import { defineStore } from 'pinia'

export const useCartStore = defineStore('cart', {
  state: () => ({
    cart: [],
  }),
  getters: {
    cartEmpty(state) {
      return state.cart.length > 0 ? false : true
    },
    totalQuantity(state) {
      return state.cart.reduce((total, item) => total + item.quantity, 0)
    },
    totalPrice(state) {
      return state.cart.reduce((total, item) => total + item.price * item.quantity, 0)
    },
  },
  actions: {
    addMenu(menu, quantity) {
      this.cart.push({ ...menu, quantity: quantity })
    },
    removeMenu(menuId) {
      this.cart = this.cart.filter((item) => item.id !== menuId)
    },
    clearCart() {
      this.cart = []
    },
  },
})
