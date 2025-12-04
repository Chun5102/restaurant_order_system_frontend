import { ElLoading } from 'element-plus'

let loadingInstance = null

export function startLoading(text = '載入中...') {
  if (!loadingInstance) {
    loadingInstance = ElLoading.service({
      lock: true,
      text,
      background: 'rgba(0, 0, 0, 0.3)',
    })
  }
}

export function stopLoading() {
  if (loadingInstance) {
    loadingInstance.close()
    loadingInstance = null
  }
}
