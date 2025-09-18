import { createApp } from 'vue'
import App from './App.vue'
import ElementPlus from 'element-plus'
import 'element-plus/dist/index.css'
import router from './router'

// 全局错误处理
window.addEventListener('error', (event) => {
  console.error('全局错误:', event.error)
  event.preventDefault()
})

window.addEventListener('unhandledrejection', (event) => {
  console.error('未处理的Promise拒绝:', event.reason)
  event.preventDefault()
})

const app = createApp(App)

// Vue应用错误处理
app.config.errorHandler = (err, vm, info) => {
  console.error('Vue应用错误:', err)
  console.error('错误信息:', info)
}

// 配置Element Plus
app.use(ElementPlus)
app.use(router)
app.mount('#app')
