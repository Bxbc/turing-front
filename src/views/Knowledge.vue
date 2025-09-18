<template>
  <div class="knowledge-container">
    <el-card class="input-card">
      <template #header>
        <div class="card-header">
          <span>知识输入</span>
        </div>
      </template>

      <div class="knowledge-input-area">
        <el-input
          v-model="knowledgeInput"
          type="textarea"
          :rows="6"
          placeholder="请输入要存储的知识内容..."
        />
        <div class="input-buttons">
          <el-button type="primary" @click="submitKnowledge" :loading="inputLoading">
            提交知识
          </el-button>
          <el-button @click="clearInput">清空</el-button>
        </div>
      </div>
    </el-card>

    <el-card class="upload-card">
      <template #header>
        <div class="card-header">
          <span>上传知识文档</span>
        </div>
      </template>

      <div class="upload-info">
        <h4>支持的文件类型：</h4>
        <el-tag
          v-for="type in fileTypes"
          :key="typeof type === 'object' ? type.code : type"
          class="file-type-tag"
        >
          {{ typeof type === 'object' ? type.name : type.toUpperCase() }}
        </el-tag>
      </div>

      <el-upload
        class="upload-area"
        drag
        :accept="acceptTypes"
        :auto-upload="false"
        :on-change="handleFileChange"
      >
        <el-icon class="el-icon--upload"><upload-filled /></el-icon>
        <div class="el-upload__text">
          将文件拖到此处，或<em>点击上传</em>
        </div>
      </el-upload>

      <div v-if="selectedFile" class="selected-file">
        <div class="file-info">
          <span>已选择文件：{{ selectedFile.name }}</span>
          <el-button type="primary" @click="uploadFile">上传</el-button>
        </div>
      </div>
    </el-card>
  </div>
</template>

<script>
import { ref, computed, onMounted } from 'vue'
import { ElMessage } from 'element-plus'
import { UploadFilled } from '@element-plus/icons-vue'
import { getFileTypes, uploadFile as uploadAPI, inputKnowledge } from '../api'

export default {
  name: 'Knowledge',
  components: {
    UploadFilled
  },
  setup() {
    const fileTypes = ref([])
    const selectedFile = ref(null)
    const knowledgeInput = ref('')
    const inputLoading = ref(false)

    const acceptTypes = computed(() => {
      if (Array.isArray(fileTypes.value)) {
        if (fileTypes.value.length > 0 && typeof fileTypes.value[0] === 'object') {
          // 新格式：[{code: 'pdf', name: 'PDF'}]
          return fileTypes.value.map(type => `.${type.code}`).join(',')
        } else {
          // 旧格式：['pdf', 'md', 'txt']
          return fileTypes.value.map(type => `.${type}`).join(',')
        }
      }
      return '.pdf,.md,.txt'
    })

    const loadFileTypes = async () => {
      try {
        const res = await getFileTypes()
        if (res && res.success && Array.isArray(res.data)) {
          fileTypes.value = res.data
        } else {
          // 使用默认文件类型
          fileTypes.value = [
            { code: 'pdf', name: 'PDF' },
            { code: 'md', name: 'Markdown' },
            { code: 'txt', name: 'Text' }
          ]
        }
      } catch (error) {
        console.error('加载文件类型失败:', error)
        // 使用默认文件类型
        fileTypes.value = [
          { code: 'pdf', name: 'PDF' },
          { code: 'md', name: 'Markdown' },
          { code: 'txt', name: 'Text' }
        ]
      }
    }

    const handleFileChange = (file) => {
      selectedFile.value = file.raw
    }

    const uploadFile = async () => {
      if (!selectedFile.value) return

      try {
        const res = await uploadAPI(selectedFile.value)
        if (res && res.success) {
          ElMessage.success('上传成功')
          selectedFile.value = null
        } else {
          ElMessage.error(res?.errorMsg || '上传失败')
        }
      } catch (error) {
        console.error('上传文件失败:', error)
        ElMessage.error('网络连接失败，请检查后端服务是否正常运行')
      }
    }

    const submitKnowledge = async () => {
      if (!knowledgeInput.value.trim()) {
        ElMessage.warning('请输入知识内容')
        return
      }

      inputLoading.value = true
      try {
        const res = await inputKnowledge(knowledgeInput.value)
        if (res && res.success) {
          ElMessage.success('知识提交成功')
          knowledgeInput.value = ''
        } else {
          ElMessage.error(res?.errorMsg || '知识提交失败')
        }
      } catch (error) {
        console.error('提交知识失败:', error)
        ElMessage.error('网络连接失败，请检查后端服务是否正常运行')
      } finally {
        inputLoading.value = false
      }
    }

    const clearInput = () => {
      knowledgeInput.value = ''
    }

    onMounted(() => {
      loadFileTypes()
    })

    return {
      fileTypes,
      selectedFile,
      knowledgeInput,
      inputLoading,
      acceptTypes,
      handleFileChange,
      uploadFile,
      submitKnowledge,
      clearInput
    }
  }
}
</script>

<style scoped>
.knowledge-container {
  padding: 20px;
}

.input-card,
.upload-card {
  max-width: 800px;
  margin: 0 auto 20px auto;
}

.knowledge-input-area {
  margin-bottom: 20px;
}

.input-buttons {
  margin-top: 15px;
  display: flex;
  gap: 10px;
  justify-content: flex-end;
}

.card-header {
  font-weight: bold;
}

.upload-info {
  margin-bottom: 20px;
}

.file-type-tag {
  margin-right: 10px;
}

.upload-area {
  width: 100%;
}

.selected-file {
  margin-top: 20px;
}

.file-info {
  display: flex;
  justify-content: space-between;
  align-items: center;
}
</style>
