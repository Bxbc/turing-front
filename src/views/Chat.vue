<template>
  <div class="chat-container">
    <div class="role-select">
      <el-select v-model="selectedRole" placeholder="选择角色">
        <el-option
          v-for="role in roles"
          :key="role.code"
          :label="role.name"
          :value="role.code"
        />
      </el-select>
    </div>

    <div class="chat-box" ref="chatBox">
      <div v-for="(msg, index) in messages" :key="index" class="message">
        <div :class="['message-content', msg.type]">
          <div v-if="msg.type === 'assistant' && msg.content === ''" class="loading-animation">
            <div class="loading-dots">
              <span></span>
              <span></span>
              <span></span>
            </div>
            <span class="loading-text">AI正在思考...</span>
          </div>
          <template v-else>
            {{ msg.content }}
            <el-tooltip
              v-if="msg.type === 'assistant' && msg.thinkContent"
              :content="msg.thinkContent"
              placement="top"
              effect="light"
              popper-class="think-tooltip"
            >
              <el-icon class="think-icon">
                <QuestionFilled />
              </el-icon>
            </el-tooltip>
          </template>
        </div>
      </div>
    </div>

    <div class="input-area">
      <el-input
        v-model="inputMessage"
        type="textarea"
        :rows="3"
        placeholder="请输入问题... (回车发送，Shift+回车换行)"
        @keydown="handleKeydown"
      />
      <div class="button-group">
        <el-button type="primary" @click="sendMessage">发送</el-button>
        <el-button @click="clearMessages">清空对话</el-button>
      </div>
    </div>
  </div>
</template>

<script>
import { ref, onMounted } from 'vue'
import { QuestionFilled } from '@element-plus/icons-vue'
import { getRoleList, streamChat } from '../api'

export default {
  name: 'Chat',
  components: {
    QuestionFilled
  },
  setup() {
    const roles = ref([])
    const selectedRole = ref('')
    const messages = ref([])
    const inputMessage = ref('')
    const chatBox = ref(null)

    // 从localStorage加载对话历史
    const loadMessages = () => {
      try {
        const savedMessages = localStorage.getItem('chat_messages')
        if (savedMessages) {
          messages.value = JSON.parse(savedMessages)
        }
      } catch (error) {
        console.error('加载对话历史失败:', error)
      }
    }

    // 保存对话历史到localStorage
    const saveMessages = () => {
      try {
        localStorage.setItem('chat_messages', JSON.stringify(messages.value))
      } catch (error) {
        console.error('保存对话历史失败:', error)
      }
    }

    const loadRoles = async () => {
      try {
        const res = await getRoleList()
        if (res && res.success && Array.isArray(res.data)) {
          roles.value = res.data
          if (roles.value.length > 0) {
            selectedRole.value = roles.value[0].code
          }
        } else {
          // 使用默认角色列表
          roles.value = [
            { code: 'digital_avatar', name: '数字分身' },
            { code: 'default', name: '默认角色' }
          ]
          selectedRole.value = 'digital_avatar'
        }
      } catch (error) {
        console.error('加载角色列表失败:', error)
        // 使用默认角色列表
        roles.value = [
          { code: 'digital_avatar', name: '数字分身' },
          { code: 'default', name: '默认角色' }
        ]
        selectedRole.value = 'digital_avatar'
      }
    }

    const scrollToBottom = () => {
      if (chatBox.value) {
        setTimeout(() => {
          chatBox.value.scrollTop = chatBox.value.scrollHeight
        }, 100)
      }
    }

    const sendMessage = async () => {
      if (!inputMessage.value.trim()) return

      const question = inputMessage.value
      messages.value.push({
        type: 'user',
        content: question
      })
      saveMessages() // 保存用户消息
      inputMessage.value = ''
      scrollToBottom()

      // 添加等待动效的AI消息
      const loadingMessageIndex = messages.value.length
      messages.value.push({
        type: 'assistant',
        content: '', // 空内容触发loading动画
        thinkContent: ''
      })
      scrollToBottom()

      try {
        console.log('发送对话请求...')
        const res = await streamChat(question, selectedRole.value)
        console.log('收到对话响应:', res)

        if (res && res.success && res.data) {
          const { content, thinkContent } = parseThinkContent(res.data)
          // 更新loading消息为实际内容
          messages.value[loadingMessageIndex] = {
            type: 'assistant',
            content,
            thinkContent
          }
        } else {
          // 更新loading消息为错误信息
          messages.value[loadingMessageIndex] = {
            type: 'assistant',
            content: res?.errorMsg || '抱歉，我现在无法回答您的问题。请稍后再试。',
            thinkContent: ''
          }
        }
        saveMessages() // 保存AI回复
        scrollToBottom()
      } catch (error) {
        console.error('发送消息失败:', error)
        // 更新loading消息为错误信息
        messages.value[loadingMessageIndex] = {
          type: 'assistant',
          content: '网络连接失败，请检查后端服务是否正常运行。',
          thinkContent: ''
        }
        saveMessages() // 保存错误信息
        scrollToBottom()
      }
    }

    const clearMessages = () => {
      messages.value = []
      localStorage.removeItem('chat_messages') // 清空localStorage中的对话历史
    }

    const handleKeydown = (event) => {
      if (event.key === 'Enter') {
        if (event.shiftKey) {
          // Shift+Enter: 换行，不做任何处理，让默认行为发生

        } else {
          // 单独Enter: 发送消息
          event.preventDefault()
          sendMessage()
        }
      }
    }

    const parseThinkContent = (content) => {
      const thinkRegex = /<think>([\s\S]*?)<\/think>/g
      let thinkContent = ''
      let cleanContent = content

      // 提取所有think标签内容
      const matches = content.matchAll(thinkRegex)
      for (const match of matches) {
        thinkContent += match[1] + '\n'
      }

      // 移除think标签及其内容
      cleanContent = content.replace(thinkRegex, '').trim()

      return {
        content: cleanContent,
        thinkContent: thinkContent.trim()
      }
    }

    onMounted(() => {
      loadRoles()
      loadMessages() // 加载对话历史
    })

    return {
      roles,
      selectedRole,
      messages,
      inputMessage,
      chatBox,
      sendMessage,
      clearMessages,
      handleKeydown,
      parseThinkContent
    }
  }
}
</script>

<style scoped>
.chat-container {
  height: calc(100vh - 120px);
  display: flex;
  flex-direction: column;
  gap: 20px;
  padding: 20px;
}

.role-select {
  width: 200px;
}

.chat-box {
  flex: 1;
  overflow-y: auto;
  border: 1px solid #dcdfe6;
  border-radius: 4px;
  padding: 20px;
}

.message {
  margin-bottom: 15px;
  display: flex;
  clear: both;
}

.message-content {
  padding: 10px 15px;
  border-radius: 8px;
  max-width: 80%;
  word-wrap: break-word;
  position: relative;
}

.message-content.user {
  background-color: #ecf5ff;
  margin-left: auto;
  margin-right: 0;
}

.message-content.assistant {
  background-color: #f4f4f5;
  margin-left: 0;
  margin-right: auto;
}

.think-icon {
  position: absolute;
  top: -8px;
  right: -8px;
  font-size: 14px;
  color: #909399;
  cursor: pointer;
  background: white;
  border-radius: 50%;
  padding: 2px;
  box-shadow: 0 1px 3px rgba(0,0,0,0.2);
}

.think-icon:hover {
  color: #409eff;
}

.loading-animation {
  display: flex;
  align-items: center;
  gap: 8px;
}

.loading-dots {
  display: flex;
  gap: 4px;
}

.loading-dots span {
  width: 6px;
  height: 6px;
  border-radius: 50%;
  background-color: #409eff;
  animation: loading-bounce 1.4s ease-in-out infinite both;
}

.loading-dots span:nth-child(1) {
  animation-delay: -0.32s;
}

.loading-dots span:nth-child(2) {
  animation-delay: -0.16s;
}

.loading-text {
  color: #666;
  font-size: 12px;
}

@keyframes loading-bounce {
  0%, 80%, 100% {
    transform: scale(0.8);
    opacity: 0.5;
  }
  40% {
    transform: scale(1);
    opacity: 1;
  }
}

.input-area {
  margin-top: auto;
}

.button-group {
  margin-top: 10px;
  display: flex;
  gap: 10px;
  justify-content: flex-end;
}
</style>
