<template>
  <NavBar />
  <main class="app-main">
    <router-view v-slot="{ Component }">
      <!-- CSS3/Vue 过渡动画：页面切换淡入 -->
      <transition name="fade" mode="out-in">
        <component :is="Component" />
      </transition>
    </router-view>
  </main>
  <TabBar />
</template>

<script setup>
import NavBar from '@/components/NavBar.vue'
import TabBar from '@/components/TabBar.vue'
</script>

<style lang="less">
// 页面切换过渡
.fade-enter-active,
.fade-leave-active {
  transition: opacity 0.2s ease;
}

.fade-enter-from,
.fade-leave-to {
  opacity: 0;
}

.app-main {
  min-height: 100vh;
}
</style>
