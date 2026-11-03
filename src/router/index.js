import { createRouter, createWebHashHistory } from 'vue-router'

// 路由懒加载（ES6 动态 import），提升首屏速度
const routes = [
  {
    path: '/',
    name: 'home',
    component: () => import('@/views/HomeView.vue'),
    meta: { title: '首页' }
  },
  {
    path: '/category',
    name: 'category',
    component: () => import('@/views/CategoryView.vue'),
    meta: { title: '分类' }
  },
  {
    path: '/goods/:id',
    name: 'goods-detail',
    component: () => import('@/views/DetailView.vue'),
    meta: { title: '商品详情' }
  },
  {
    path: '/cart',
    name: 'cart',
    component: () => import('@/views/CartView.vue'),
    meta: { title: '购物车' }
  },
  {
    path: '/profile',
    name: 'profile',
    component: () => import('@/views/ProfileView.vue'),
    meta: { title: '我的' }
  },
  {
    path: '/:pathMatch(.*)*',
    redirect: '/'
  }
]

const router = createRouter({
  history: createWebHashHistory(),
  routes,
  scrollBehavior: () => ({ top: 0 })
})

// 全局后置钩子：动态设置页面标题
router.afterEach((to) => {
  document.title = to.meta.title ? `${to.meta.title} - 易购商城` : '易购商城'
})

export default router
