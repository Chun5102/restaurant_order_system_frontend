import { useRouter } from 'vue-router'

export function useNavigation() {
  const router = useRouter()

  const goto = (name, params = {}, query = {}) => {
    router.push({
      name,
      params,
      query,
    })
  }
  return {
    goto,
  }
}
