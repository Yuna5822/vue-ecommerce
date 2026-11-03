<template>
  <!-- 移动端底部 TabBar（媒体查询控制显隐） -->
  <nav class="tab-bar">
    <router-link
      v-for="tab in tabs"
      :key="tab.path"
      :to="tab.path"
      class="tab-item"
      :class="{ active: isActive(tab.path) }"
    >
      <div class="icon-wrap">
        <el-icon :size="22"><component :is="tab.icon" /></el-icon>
        <span v-if="tab.path === '/cart' && cartCount > 0" class="badge">
          {{ cartCount > 99 ? '99+' : cartCount }}
        </span>
      </div>
      <span class="label">{{ tab.label }}</span>
    </router-link>
  </nav>
</template>

<script setup>
import { useRoute } from 'vue-router'
import { HomeFilled, Menu, ShoppingCart, User } from '@element-plus/icons-vue'
import { cartCount } from '@/store/cart'

const route = useRoute()

const tabs = [
  { path: '/', label: '首页', icon: HomeFilled },
  { path: '/category', label: '分类', icon: Menu },
  { path: '/cart', label: '购物车', icon: ShoppingCart },
  { path: '/profile', label: '我的', icon: User }
]

const isActive = (path) =>
  path === '/' ? route.path === '/' : route.path.startsWith(path)
</script>

<style lang="less" scoped>
.tab-bar {
  position: fixed;
  bottom: 0;
  left: 0;
  right: 0;
  z-index: 100;
  display: flex;
  height: 1.1rem;
  background: #fff;
  border-top: 1px solid @border-color;
  // 适配 iPhone 底部安全区（CSS3 env()）
  padding-bottom: env(safe-area-inset-bottom);

  // PC 端隐藏底部导航
  @media @pc {
    display: none;
  }

  .tab-item {
    flex: 1;
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    gap: 0.04rem;
    color: @text-sub;
    transition: color 0.3s;

    &.active {
      color: @primary-color;
    }

    .icon-wrap {
      position: relative;

      .badge {
        position: absolute;
        top: -0.08rem;
        right: -0.24rem;
        min-width: 0.32rem;
        height: 0.32rem;
        line-height: 0.32rem;
        padding: 0 0.06rem;
        border-radius: 0.16rem;
        background: @price-color;
        color: #fff;
        font-size: 0.2rem;
        text-align: center;
      }
    }

    .label {
      font-size: 0.2rem;
    }
  }
}
</style>
