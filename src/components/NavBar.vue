<template>
  <!-- PC 端顶部导航（媒体查询控制显隐） -->
  <header class="nav-bar">
    <div class="nav-inner container">
      <router-link to="/" class="logo">
        <span class="logo-icon"><i class="iconfont icon-shangpin_guanli_wanggou_sel"></i></span>
        <span class="logo-text">易购商城</span>
      </router-link>

      <div class="search-box">
        <el-input
          v-model="keyword"
          placeholder="搜索商品"
          :prefix-icon="Search"
          clearable
          @keyup.enter="onSearch"
        >
          <template #append>
            <el-button type="primary" @click="onSearch">搜索</el-button>
          </template>
        </el-input>
      </div>

      <nav class="nav-links">
        <router-link to="/" class="link" exact-active-class="active">首页</router-link>
        <router-link to="/category" class="link" active-class="active">分类</router-link>
        <router-link to="/cart" class="link cart-link" active-class="active">
          购物车
          <el-badge v-if="cartCount > 0" :value="cartCount" :max="99" />
        </router-link>
        <router-link to="/profile" class="link" active-class="active">我的</router-link>
      </nav>
    </div>
  </header>
</template>

<script setup>
import { ref } from 'vue'
import { useRouter } from 'vue-router'
import { Search } from '@element-plus/icons-vue'
import { cartCount } from '@/store/cart'

const router = useRouter()
const keyword = ref('')

const onSearch = () => {
  router.push({ path: '/category', query: keyword.value ? { keyword: keyword.value } : {} })
}
</script>

<style lang="less" scoped>
.nav-bar {
  // 移动端隐藏顶部导航，由底部 TabBar 替代
  display: none;

  @media @pc {
    display: block;
    position: sticky;
    top: 0;
    z-index: 100;
    background: #fff;
    box-shadow: 0 2px 8px rgba(0, 0, 0, 0.06);
  }

  .nav-inner {
    display: flex;
    align-items: center;
    gap: 40px;
    height: 64px;
  }

  .logo {
    display: flex;
    align-items: center;
    gap: 8px;
    font-size: 22px;
    font-weight: bold;
    color: @primary-color;

    .logo-icon {
      display: flex;
      align-items: center;
      justify-content: center;
      width: 36px;
      height: 36px;
      border-radius: 8px;
      background: linear-gradient(135deg, #ff69b4, #ff1493);
      color: #fff;

      i.iconfont {
        font-size: 22px;
      }
    }
  }

  .search-box {
    flex: 1;
    max-width: 480px;

    :deep(.el-input-group__append) {
      background: @primary-color;
      color: #fff;
      border-color: @primary-color;
    }
  }

  .nav-links {
    display: flex;
    gap: 32px;
    margin-left: auto;

    .link {
      font-size: 15px;
      color: @text-main;
      transition: color 0.3s;

      &:hover,
      &.active {
        color: @primary-color;
      }
    }

    .cart-link {
      position: relative;
    }
  }
}
</style>
