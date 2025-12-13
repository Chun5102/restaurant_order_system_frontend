import api from '@/service/api'
export function useTableStorage() {
  const checkTableExpiry = async () => {
    try {
      await api.checkTable()
      return true
    } catch (error) {
      localStorage.removeItem('tableToken')
      return false
    }
  }

  return {
    checkTableExpiry,
  }
}
