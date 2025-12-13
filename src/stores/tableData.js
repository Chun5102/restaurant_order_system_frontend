import jwt_decode from 'jwt-decode'
import { defineStore } from 'pinia'

export const useTableDataStore = defineStore('tableData', {
  state: () => ({
    tableId: null,
    isOpened: false,
    orderCount: 0,
  }),
  actions: {
    setTableData(token, status) {
      try {
        const payload = jwt_decode(token)
        this.tableId = payload.tableId
        this.isOpened = status.opened
        this.orderCount = status.orderCount
      } catch (error) {
        this.tableId = null
        this.isOpened = false
        this.orderCount = 0
      }
    },
    setTableId(token) {
      try {
        const payload = jwt_decode(token)
        this.tableId = payload.tableId
      } catch (error) {
        this.tableId = null
      }
    },
    clearTableData() {
      this.tableId = null
      this.isOpened = false
      this.orderCount = 0
    },
  },
})
