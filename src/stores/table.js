import { defineStore } from 'pinia'

export const useTableStore = defineStore('table', {
  state: () => ({
    tableNumber: null,
  }),
  actions: {
    setTableNumber(num) {
      this.tableNumber = num
    },
  },
})
