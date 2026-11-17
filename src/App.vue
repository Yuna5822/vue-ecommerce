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
import { onMounted } from 'vue'
import NavBar from '@/components/NavBar.vue'
import TabBar from '@/components/TabBar.vue'
import { fetchCart } from '@/store/cart'

onMounted(() => {
  // 已登录则从后端拉取购物车
  if (localStorage.getItem('token')) fetchCart()
})
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
