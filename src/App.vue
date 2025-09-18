<template>
  <div id="app">
    <el-container>
      <el-header>
        <el-menu mode="horizontal" router default-active="/chat">
          <el-menu-item index="/chat">对话</el-menu-item>
          <el-menu-item index="/knowledge">知识管理</el-menu-item>
        </el-menu>
      </el-header>
      <el-main>
        <router-view v-slot="{ Component, route }">
          <transition name="fade">
            <component :is="Component" :key="route.path" />
          </transition>
        </router-view>
      </el-main>
    </el-container>
  </div>
</template>

<script>
export default {
  name: 'App',
  errorCaptured(err, vm, info) {
    console.error('App组件捕获到错误:', err)
    console.error('错误信息:', info)
    return false
  }
}
</script>

<style>
.el-header {
  padding: 0;
}

.fade-enter-active,
.fade-leave-active {
  transition: opacity 0.3s ease;
}

.fade-enter-from,
.fade-leave-to {
  opacity: 0;
}
</style>
