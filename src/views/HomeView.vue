<template>
  <div class="page home-page">
    <!-- 移动端顶部搜索栏（PC 端由 NavBar 承担，媒体查询隐藏） -->
    <header class="m-header">
      <div class="logo">易购商城</div>
      <div class="search" @click="goSearch">
        <el-icon><Search /></el-icon>
        <span>搜索商品</span>
      </div>
    </header>

    <div class="container">
      <!-- 轮播图 -->
      <el-skeleton :loading="loading" animated class="banner-skeleton">
        <template #template>
          <el-skeleton-item variant="image" class="skeleton-banner" />
        </template>
        <el-carousel class="banner" :height="bannerHeight">
          <el-carousel-item v-for="b in banners" :key="b.id">
            <img :src="b.img" :alt="b.title" />
            <span class="banner-title">{{ b.title }}</span>
          </el-carousel-item>
        </el-carousel>
      </el-skeleton>

      <!-- 分类快捷入口 -->
      <section class="category-section">
        <div
          v-for="c in categories"
          :key="c.id"
          class="cate-item"
          @click="goCategory(c.id)"
        >
          <div class="cate-icon">
            <i :class="c.icon"></i>
          </div>
          <span>{{ c.name }}</span>
        </div>
      </section>

      <!-- 推荐商品：响应式栅格（Element Plus 24 栅格 + 媒体查询） -->
      <section class="goods-section">
        <h2 class="section-title">
          <span class="bar"></span>
          为你推荐
        </h2>
        <el-row :gutter="12" type="flex" align="stretch">
          <el-col
            v-for="g in recommends"
            :key="g.id"
            :xs="12"
            :sm="12"
            :md="8"
            :lg="6"
            :xl="6"
          >
            <GoodsCard :goods="g" />
          </el-col>
        </el-row>
        <el-empty v-if="!loading && !recommends.length" description="暂无商品" />
      </section>

      <!-- 限时秒杀 -->
      <section class="goods-section">
        <h2 class="section-title">
          <span class="bar"></span>
          限时秒杀
          <span class="sub-tag">每日 10:00 开抢</span>
        </h2>
        <div class="seckill-list">
          <div
            v-for="g in seckillList"
            :key="g.id"
            class="seckill-item"
            @click="goDetail(g.id)"
          >
            <div class="seckill-img">
              <img :src="g.img" :alt="g.title" />
            </div>
            <p class="seckill-title">{{ g.title }}</p>
            <p class="seckill-price">
              <i>¥</i>{{ seckillPrice(g) }}
              <del>¥{{ g.price }}</del>
            </p>
          </div>
        </div>
      </section>

      <!-- 品牌专区 -->
      <section class="goods-section">
        <h2 class="section-title">
          <span class="bar"></span>
          品牌专区
        </h2>
        <div class="brand-grid">
          <div
            v-for="(b, i) in brands"
            :key="i"
            class="brand-item"
            @click="goCategory(b.categoryId)"
          >
            <div class="brand-img" :style="{ background: b.bg }">
              <i :class="b.icon"></i>
            </div>
            <p>{{ b.name }}</p>
          </div>
        </div>
      </section>

      <!-- 新品上市 -->
      <section class="goods-section">
        <h2 class="section-title">
          <span class="bar"></span>
          新品上市
        </h2>
        <el-row :gutter="12" type="flex" align="stretch">
          <el-col
            v-for="g in newArrivals"
            :key="g.id"
            :xs="12"
            :sm="12"
            :md="8"
            :lg="6"
            :xl="6"
          >
            <GoodsCard :goods="g" />
          </el-col>
        </el-row>
      </section>
    </div>

    <!-- 返回顶部按钮 -->
    <transition name="fade">
      <button v-show="showBackTop" class="back-top" @click="scrollToTop">
        <el-icon :size="22"><Top /></el-icon>
      </button>
    </transition>
  </div>
</template>

<script setup>
import { ref, computed, onMounted, onUnmounted } from 'vue'
import { useRouter } from 'vue-router'
import { Search, Top } from '@element-plus/icons-vue'
import { getHomeData, getGoodsList } from '@/api'
import GoodsCard from '@/components/GoodsCard.vue'

const router = useRouter()
const loading = ref(true)
const banners = ref([])
const categories = ref([])
const recommends = ref([])
const allGoods = ref([])

// 根据视口宽度动态计算轮播高度（JS 侧适配）
const bannerHeight = computed(() => (window.innerWidth >= 992 ? '360px' : '3.2rem'))

const goSearch = () => router.push('/category')
const goCategory = (id) => router.push({ path: '/category', query: { categoryId: id } })
const goDetail = (id) => router.push(`/goods/${id}`)

// 限时秒杀：取价格最低的 6 个商品，打 8 折
const seckillList = computed(() =>
  [...allGoods.value].sort((a, b) => a.price - b.price).slice(0, 6)
)
const seckillPrice = (g) => (g.price * 0.8).toFixed(2)

// 品牌专区：从分类取前 8 个
const brands = computed(() =>
  categories.value.slice(0, 8).map((c) => ({
    name: c.name,
    categoryId: c.id,
    icon: c.icon,
    bg: `linear-gradient(135deg, hsl(${c.id * 40}, 80%, 92%), hsl(${c.id * 40 + 30}, 80%, 85%))`
  }))
)

// 新品上市：带"新品"标签的商品
const newArrivals = computed(() => allGoods.value.filter((g) => g.tags?.includes('新品')))

// 返回顶部
const showBackTop = ref(false)
const onScroll = () => {
  showBackTop.value = window.scrollY > 400
}
const scrollToTop = () => window.scrollTo({ top: 0, behavior: 'smooth' })

onMounted(async () => {
  window.addEventListener('scroll', onScroll, { passive: true })
  try {
    const data = await getHomeData()
    banners.value = data.banners
    categories.value = data.categories
    recommends.value = data.recommends
    // 拉取全量商品用于秒杀、新品模块
    const res = await getGoodsList({ pageSize: 100 })
    allGoods.value = res.list
  } finally {
    loading.value = false
  }
})

onUnmounted(() => {
  window.removeEventListener('scroll', onScroll)
})
</script>

<style lang="less" scoped>
.home-page {
  .m-header {
    position: sticky;
    top: 0;
    z-index: 90;
    display: flex;
    align-items: center;
    gap: 0.2rem;
    padding: 0.16rem 0.24rem;
    background: linear-gradient(135deg, #ff69b4, #ff1493);

    // PC 端隐藏移动端搜索栏
    @media @pc {
      display: none;
    }

    .logo {
      color: #fff;
      font-size: 0.36rem;
      font-weight: bold;
    }

    .search {
      flex: 1;
      display: flex;
      align-items: center;
      gap: 0.1rem;
      height: 0.64rem;
      padding: 0 0.24rem;
      border-radius: 0.32rem;
      background: #fff;
      color: @text-sub;
      font-size: 0.26rem;
    }
  }

  .banner-skeleton {
    margin-top: 0.2rem;

    .skeleton-banner {
      width: 100%;
      height: 3.2rem;
      border-radius: 0.16rem;

      @media @pc {
        height: 360px;
      }
    }
  }

  .banner {
    margin-top: 0.2rem;
    border-radius: 0.16rem;
    overflow: hidden;

    img {
      width: 100%;
      height: 100%;
      object-fit: cover;
    }

    .banner-title {
      position: absolute;
      left: 0.3rem;
      bottom: 0.3rem;
      padding: 0.06rem 0.2rem;
      border-radius: 0.24rem;
      background: rgba(0, 0, 0, 0.45);
      color: #fff;
      font-size: 0.28rem;
    }
  }

  .category-section {
    display: grid;
    // CSS3 Grid：移动端 4 列，PC 8 列（媒体查询）
    grid-template-columns: repeat(4, 1fr);
    gap: 0.2rem 0;
    margin-top: 0.2rem;
    padding: 0.24rem 0;
    background: #fff;
    border-radius: 0.16rem;

    @media @pc {
      grid-template-columns: repeat(8, 1fr);
      border-radius: 8px;
      padding: 24px 0;
    }

    .cate-item {
      display: flex;
      flex-direction: column;
      align-items: center;
      gap: 0.1rem;
      cursor: pointer;
      font-size: 0.24rem;

      .cate-icon {
        width: 1.1rem;
        height: 1.1rem;
        border-radius: 50%;
        background: #fff5f0;
        display: flex;
        align-items: center;
        justify-content: center;
        color: @primary-color;
        line-height: 1;
        transition: transform 0.3s;

        i.iconfont {
          font-size: 0.8rem;
        }

        @media @pc {
          width: 60px;
          height: 60px;
          i.iconfont {
            font-size: 44px;
          }
        }
      }

      &:hover .cate-icon {
        transform: scale(1.1);
      }
    }
  }

  .goods-section {
    margin-top: 0.2rem;

    .section-title {
      display: flex;
      align-items: center;
      gap: 0.12rem;
      padding: 0.16rem 0.04rem;
      font-size: 0.34rem;

      .bar {
        width: 0.08rem;
        height: 0.32rem;
        border-radius: 0.04rem;
        background: linear-gradient(180deg, #ff69b4, #ff1493);
      }
    }

    .el-col {
      margin-bottom: 0.2rem;
      display: flex; // 让内部 GoodsCard 的 height:100% 生效
    }

    .section-title {
      .sub-tag {
        margin-left: 0.16rem;
        padding: 0.04rem 0.12rem;
        border-radius: 0.08rem;
        background: linear-gradient(135deg, #ff69b4, #ff1493);
        color: #fff;
        font-size: 0.2rem;
        font-weight: normal;
      }
    }
  }

  // 限时秒杀
  .seckill-list {
    display: grid;
    grid-template-columns: repeat(3, 1fr);
    gap: 0.16rem;

    @media @pc {
      grid-template-columns: repeat(6, 1fr);
      gap: 16px;
    }

    .seckill-item {
      background: #fff;
      border-radius: 0.12rem;
      overflow: hidden;
      cursor: pointer;
      transition: transform 0.3s;

      &:hover {
        transform: translateY(-3px);
      }

      .seckill-img {
        position: relative;
        width: 100%;
        padding-top: 100%;
        background: #fafafa;
        overflow: hidden;

        img {
          position: absolute;
          top: 0;
          left: 0;
          width: 100%;
          height: 100%;
          object-fit: cover;
        }
      }

      .seckill-title {
        padding: 0.1rem 0.12rem 0;
        font-size: 0.22rem;
        line-height: 1.3;
        height: 2.6em;
        overflow: hidden;
        color: @text-main;
      }

      .seckill-price {
        padding: 0.06rem 0.12rem 0.12rem;

        i {
          font-style: normal;
          font-size: 0.2rem;
          color: @price-color;
        }

        font-size: 0.3rem;
        font-weight: bold;
        color: @price-color;

        del {
          margin-left: 0.06rem;
          font-size: 0.18rem;
          color: @text-sub;
          font-weight: normal;
        }
      }
    }
  }

  // 品牌专区
  .brand-grid {
    display: grid;
    grid-template-columns: repeat(4, 1fr);
    gap: 0.16rem;

    @media @pc {
      grid-template-columns: repeat(8, 1fr);
      gap: 16px;
    }

    .brand-item {
      text-align: center;
      cursor: pointer;

      .brand-img {
        width: 100%;
        padding-top: 100%;
        border-radius: 0.16rem;
        position: relative;
        display: flex;
        align-items: center;
        justify-content: center;
        transition: transform 0.3s;

        i.iconfont {
          position: absolute;
          top: 50%;
          left: 50%;
          transform: translate(-50%, -50%);
          font-size: 0.7rem;
          color: #fff;
          text-shadow: 0 2px 4px rgba(0, 0, 0, 0.15);
        }

        @media @pc {
          i.iconfont {
            font-size: 44px;
          }
        }
      }

      &:hover .brand-img {
        transform: scale(1.05);
      }

      p {
        margin-top: 0.1rem;
        font-size: 0.24rem;
        color: @text-main;
      }
    }
  }

  // 返回顶部按钮
  .back-top {
    position: fixed;
    right: 0.3rem;
    bottom: 1.4rem;
    width: 0.8rem;
    height: 0.8rem;
    border-radius: 50%;
    border: none;
    background: linear-gradient(135deg, #ff69b4, #ff1493);
    color: #fff;
    box-shadow: 0 4px 12px rgba(255, 20, 147, 0.4);
    cursor: pointer;
    z-index: 99;
    display: flex;
    align-items: center;
    justify-content: center;
    transition: transform 0.3s;

    &:hover {
      transform: scale(1.1);
    }

    @media @pc {
      right: 40px;
      bottom: 60px;
      width: 48px;
      height: 48px;
    }
  }

  .fade-enter-active,
  .fade-leave-active {
    transition: opacity 0.3s;
  }
  .fade-enter-from,
  .fade-leave-to {
    opacity: 0;
  }
}
</style>
