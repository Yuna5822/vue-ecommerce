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
        <el-row :gutter="12">
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
    </div>
  </div>
</template>

<script setup>
import { ref, computed, onMounted } from 'vue'
import { useRouter } from 'vue-router'
import { Search } from '@element-plus/icons-vue'
import { getHomeData } from '@/api'
import GoodsCard from '@/components/GoodsCard.vue'

const router = useRouter()
const loading = ref(true)
const banners = ref([])
const categories = ref([])
const recommends = ref([])

// 根据视口宽度动态计算轮播高度（JS 侧适配）
const bannerHeight = computed(() => (window.innerWidth >= 992 ? '360px' : '3.2rem'))

const goSearch = () => router.push('/category')
const goCategory = (id) => router.push({ path: '/category', query: { categoryId: id } })

onMounted(async () => {
  try {
    // ajax 请求首页数据
    const data = await getHomeData()
    banners.value = data.banners
    categories.value = data.categories
    recommends.value = data.recommends
  } finally {
    loading.value = false
  }
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
    }
  }
}
</style>
