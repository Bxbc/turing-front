import axios from 'axios'

const api = axios.create({
  baseURL: 'http://127.0.0.1:8080',
  timeout: 30000,
  // 确保请求在Network面板中可见
  withCredentials: false,
  headers: {
    'Content-Type': 'application/json'
  }
})

// 请求拦截器 - 用于调试
api.interceptors.request.use(
  config => {
    console.log('发送请求:', config.method?.toUpperCase(), config.url, config.data)
    return config
  },
  error => {
    console.error('请求拦截器错误:', error)
    return Promise.reject(error)
  }
)

// 响应拦截器
api.interceptors.response.use(
  response => {
    console.log('收到响应:', response.status, response.data)
    return response.data || { success: false, errorMsg: '响应数据异常' }
  },
  error => {
    console.error('API请求错误:', error)
    console.log('错误详情:', {
      url: error.config?.url,
      method: error.config?.method,
      status: error.response?.status,
      data: error.response?.data
    })
    // 返回统一的错误格式，而不是抛出异常
    return Promise.resolve({
      success: false,
      errorMsg: error.message || '网络请求失败',
      data: null
    })
  }
)

// 获取角色列表
export const getRoleList = () => {
  return api.get('/role/list')
}

// 对话接口 - 使用非流式接口
export const streamChat = (questionContent, roleCode = 'digital_avatar') => {
  console.log('发送对话请求:', { roleCode, questionContent })

  return api.post('/ollama/chat', {
    roleCode,
    questionContent
  })
}

// 获取支持的文档类型
export const getFileTypes = () => {
  return api.get('/knowledge/file/type/available')
}

// 上传知识文档
export const uploadFile = (file) => {
  const formData = new FormData()
  formData.append('file', file)
  return api.post('/knowledge/file/upload', formData, {
    headers: {
      'Content-Type': 'multipart/form-data'
    }
  })
}

// 知识输入接口
export const inputKnowledge = (content) => {
  console.log('发送知识输入请求:', content)
  return api.post('/knowledge/input', content, {
    headers: {
      'Content-Type': 'text/plain'
    }
  })
}

export default api
