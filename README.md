# AI问答系统前端

基于Vue 3 + Element Plus开发的AI问答系统前端界面。

## 功能特性

### 问答对话页面
- 🤖 支持多种AI角色选择
- 💬 实时流式对话体验
- 🎨 美观的聊天界面设计
- ⌨️ 支持Ctrl+Enter快捷键发送
- 🗑️ 一键清空对话历史

### 知识管理页面
- 📄 支持PDF、Markdown、Text文档上传
- 🎯 拖拽上传，操作便捷
- 📋 实时显示支持的文档类型
- ✅ 文件格式和大小验证
- 📊 上传进度和状态反馈

## 技术栈

- **Vue 3** - 渐进式JavaScript框架
- **Vue Router 4** - 官方路由管理器
- **Element Plus** - 基于Vue 3的组件库
- **Axios** - HTTP客户端
- **Vue CLI** - 官方脚手架工具

## 项目结构

```
src/
├── api/                 # API接口封装
│   └── index.js        # 统一接口管理
├── router/             # 路由配置
│   └── index.js        # 路由定义
├── views/              # 页面组件
│   ├── Chat.vue        # 问答对话页面
│   └── Knowledge.vue   # 知识管理页面
├── App.vue             # 根组件
└── main.js             # 入口文件
```

## 安装和运行

### 环境要求
- Node.js >= 14.0.0
- npm >= 6.0.0

### 安装依赖
```bash
npm install
```

### 开发环境运行
```bash
npm run serve
```
访问 http://localhost:3000

### 生产环境构建
```bash
npm run build
```

## API接口

### 角色管理
- `GET /role/list` - 获取可用角色列表

### 对话服务
- `POST /ollama/streamChat?roleCode={roleCode}` - 流式对话接口

### 知识管理
- `GET /knowledge/file/type/available` - 获取支持的文档类型
- `POST /knowledge/file/upload` - 上传知识文档

## 使用说明

### 问答对话
1. 在顶部导航栏选择"问答对话"
2. 从下拉菜单选择AI角色
3. 在输入框中输入问题
4. 点击"发送"按钮或按Ctrl+Enter发送
5. 使用"清空对话"按钮清除历史记录

### 知识管理
1. 在顶部导航栏选择"知识管理"
2. 点击"上传文档"按钮或直接拖拽文件到上传区域
3. 选择要上传的文档（支持PDF、MD、TXT格式）
4. 点击"开始上传"按钮
5. 查看上传状态和结果

## 配置说明

### 后端服务地址
在 `src/api/index.js` 中修改 `baseURL` 配置：
```javascript
const api = axios.create({
  baseURL: 'http://127.0.0.1:8080', // 修改为你的后端服务地址
  timeout: 30000
})
```

### 端口配置
在 `vue.config.js` 中修改开发服务器端口：
```javascript
module.exports = defineConfig({
  devServer: {
    port: 3000, // 修改为你需要的端口
    open: true
  }
})
```

## 浏览器支持

- Chrome >= 87
- Firefox >= 78
- Safari >= 14
- Edge >= 88

## 开发规范

### 代码风格
- 使用ESLint进行代码检查
- 遵循Vue 3 Composition API规范
- 组件命名使用PascalCase
- 文件命名使用kebab-case

### 提交规范
- feat: 新功能
- fix: 修复问题
- docs: 文档更新
- style: 代码格式调整
- refactor: 代码重构
- test: 测试相关
- chore: 构建过程或辅助工具的变动

## 许可证

MIT License
