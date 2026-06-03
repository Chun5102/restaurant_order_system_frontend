import { defineStore } from 'pinia'

export const useStaffDataStore = defineStore('staffData', {
  state: () => ({
    name: null,
    role: null,
  }),
  actions: {
    setStaffData(name, role) {
      this.name = name
      this.role = role
    },
    clearStaffData() {
      this.name = null
      this.role = null
    },
  },
})
