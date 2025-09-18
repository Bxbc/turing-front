import { createRouter, createWebHistory } from 'vue-router'

const routes = [
  {
    path: '/',
    redirect: '/chat'
  },
  {
    path: '/chat',
    name: 'Chat',
    component: () => import('../views/Chat.vue')
  },
  {
    path: '/knowledge',
    name: 'Knowledge',
    component: () => import('../views/Knowledge.vue')
  }
]

const router = createRouter({
  history: createWebHistory(),
  routes
})

// 路由错误处理
router.onError((error) => {
  console.error('路由错误:', error)
})

// 路由守卫
router.beforeEach((to, from, next) => {
  try {
    console.log('路由跳转:', from.path, '->', to.path)
    next()
  } catch (error) {
    console.error('路由守卫错误:', error)
    next('/chat')
  }
})

export default router
