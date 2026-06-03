import { useRouter } from 'vue-router'

export function useNavigation() {
  const router = useRouter()

  const goHome = () => {
    router.push({ name: 'Home' })
  }

  const goTo = (name, params = {}, query = {}) => {
    router.push({
      name,
      params,
      query,
    })
  }

  const replaceTo = (name, params = {}, query = {}) => {
    router.replace({ name, params, query })
  }

  return {
    goHome,
    goTo,
    replaceTo,
  }
}
