<template>
  <div class="page profile-page">
    <!-- 用户信息头部 -->
    <div class="user-header">
      <el-avatar :size="64" class="avatar">
        <el-icon :size="32"><User /></el-icon>
      </el-avatar>
      <div class="user-info">
        <h2 v-if="user">{{ user.nickname }}</h2>
        <h2 v-else>您好，游客</h2>
        <p>{{ user ? '欢迎回来' : '登录后享受更多优惠' }}</p>
      </div>
      <el-button v-if="!user" round size="small" @click="loginVisible = true">立即登录</el-button>
      <el-button v-else round size="small" @click="onLogout">退出</el-button>
    </div>

    <div class="container">
      <!-- 我的订单 -->
      <section class="panel">
        <div class="panel-header">
          <h3>我的订单</h3>
          <span class="more">查看全部 <el-icon><ArrowRight /></el-icon></span>
        </div>
        <div class="order-grid">
          <div v-for="o in orderMenus" :key="o.label" class="order-item" @click="onTodo">
            <el-icon :size="28"><component :is="o.icon" /></el-icon>
            <span>{{ o.label }}</span>
          </div>
        </div>
      </section>

      <!-- 我的服务 -->
      <section class="panel">
        <div class="panel-header">
          <h3>我的服务</h3>
        </div>
        <div class="service-grid">
          <div v-for="s in serviceMenus" :key="s.label" class="service-item" @click="onTodo">
            <el-icon :size="24" :color="s.color"><component :is="s.icon" /></el-icon>
            <span>{{ s.label }}</span>
          </div>
        </div>
      </section>

      <!-- 设置列表 -->
      <section class="panel">
        <el-cell-group>
          <div
            v-for="m in settingMenus"
            :key="m"
            class="setting-item"
            @click="onTodo"
          >
            <span>{{ m }}</span>
            <el-icon><ArrowRight /></el-icon>
          </div>
        </el-cell-group>
      </section>
    </div>

    <!-- 登录弹窗 -->
    <el-dialog v-model="loginVisible" title="登录" width="360px" center>
      <el-form :model="form" label-width="70px" @keyup.enter="onSubmit">
        <el-form-item label="账号">
          <el-input v-model="form.username" placeholder="请输入账号" />
        </el-form-item>
        <el-form-item label="密码">
          <el-input v-model="form.password" type="password" placeholder="请输入密码" show-password />
        </el-form-item>
        <el-form-item>
          <el-button type="primary" style="width:100%" :loading="loading" @click="onSubmit">登录</el-button>
        </el-form-item>
        <p class="tip">测试账号：test / 123456</p>
      </el-form>
    </el-dialog>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import { ElMessage } from 'element-plus'
import {
  User,
  ArrowRight,
  Wallet,
  Box,
  Van,
  ChatDotRound,
  Star,
  Location,
  Headset,
  Ticket
} from '@element-plus/icons-vue'
import { login, getUserInfo } from '@/api'
import { fetchCart } from '@/store/cart'

const user = ref(null)
const loginVisible = ref(false)
const loading = ref(false)
const form = ref({ username: '', password: '' })

onMounted(() => {
  if (localStorage.getItem('token')) loadUser()
})

async function loadUser() {
  try {
    user.value = await getUserInfo()
    await fetchCart()
  } catch (e) {
    localStorage.removeItem('token')
  }
}

async function onSubmit() {
  if (!form.value.username || !form.value.password) {
    return ElMessage.warning('请输入账号和密码')
  }
  loading.value = true
  try {
    const res = await login(form.value)
    localStorage.setItem('token', res.token)
    user.value = res.user
    loginVisible.value = false
    ElMessage.success('登录成功')
    await fetchCart()
  } catch (e) {
    // 错误已由响应拦截器提示
  } finally {
    loading.value = false
  }
}

function onLogout() {
  localStorage.removeItem('token')
  user.value = null
  ElMessage.success('已退出登录')
}

const orderMenus = [
  { label: '待付款', icon: Wallet },
  { label: '待发货', icon: Box },
  { label: '待收货', icon: Van },
  { label: '评价', icon: ChatDotRound }
]

const serviceMenus = [
  { label: '优惠券', icon: Ticket, color: '#ff69b4' },
  { label: '收藏', icon: Star, color: '#ff1493' },
  { label: '收货地址', icon: Location, color: '#409eff' },
  { label: '官方客服', icon: Headset, color: '#67c23a' }
]

const settingMenus = ['账号与安全', '消息通知', '通用设置', '关于易购商城']

const onTodo = () => ElMessage.info('演示功能，敬请期待')
</script>

<style lang="less" scoped>
.profile-page {
  .user-header {
    display: flex;
    align-items: center;
    gap: 0.24rem;
    padding: 0.5rem 0.3rem 0.9rem;
    background: linear-gradient(135deg, #ff69b4, #ff1493);
    color: #fff;

    @media @pc {
      padding: 60px 40px 100px;
    }

    .avatar {
      background: rgba(255, 255, 255, 0.25);
      flex-shrink: 0;
    }

    .user-info {
      flex: 1;

      h2 {
        font-size: 0.4rem;
        margin-bottom: 0.08rem;
      }

      p {
        font-size: 0.24rem;
        opacity: 0.85;
      }
    }

    :deep(.el-button) {
      background: rgba(255, 255, 255, 0.2);
      border-color: rgba(255, 255, 255, 0.4);
      color: #fff;
    }
  }

  .container {
    margin-top: -0.6rem; // 卡片上压头部，经典电商布局
    position: relative;
    z-index: 1;
  }

  .panel {
    margin-bottom: 0.2rem;
    padding: 0.24rem;
    background: #fff;
    border-radius: 0.16rem;

    @media @pc {
      border-radius: 8px;
      padding: 24px;
    }

    .panel-header {
      display: flex;
      align-items: center;
      justify-content: space-between;
      margin-bottom: 0.24rem;

      h3 {
        font-size: 0.3rem;
      }

      .more {
        display: flex;
        align-items: center;
        color: @text-sub;
        font-size: 0.24rem;
        cursor: pointer;
      }
    }
  }

  .order-grid,
  .service-grid {
    display: grid;
    grid-template-columns: repeat(4, 1fr);

    .order-item,
    .service-item {
      display: flex;
      flex-direction: column;
      align-items: center;
      gap: 0.1rem;
      padding: 0.16rem 0;
      font-size: 0.24rem;
      cursor: pointer;
      color: @text-main;
      transition: color 0.3s;

      &:hover {
        color: @primary-color;
      }
    }
  }

  .setting-item {
    display: flex;
    align-items: center;
    justify-content: space-between;
    padding: 0.28rem 0.08rem;
    font-size: 0.28rem;
    cursor: pointer;
    border-bottom: 1px solid @border-color;

    &:last-child {
      border-bottom: none;
    }

    .el-icon {
      color: @text-sub;
    }
  }
}

.tip {
  text-align: center;
  font-size: 0.24rem;
  color: @text-sub;
  margin-top: -0.16rem;
}
</style>
