<template>
  <div class="page category-page">
    <!-- 搜索栏 -->
    <div class="search-header container">
      <el-input
        v-model="keyword"
        placeholder="搜索商品名称"
        :prefix-icon="Search"
        clearable
        @keyup.enter="onSearch"
        @clear="onSearch"
      >
        <template #append>
          <el-button @click="onSearch">搜索</el-button>
        </template>
      </el-input>
    </div>

    <div class="main container">
      <!-- 左侧分类（移动端转为顶部横向滚动，媒体查询实现） -->
      <aside class="side-menu">
        <div
          v-for="c in [{ id: 0, name: '全部' }, ...categories]"
          :key="c.id"
          class="menu-item"
          :class="{ active: activeCategory === c.id }"
          @click="changeCategory(c.id)"
        >
          {{ c.name }}
        </div>
      </aside>

      <!-- 商品区 -->
      <section class="goods-area">
        <div v-if="loading" class="loading-box">
          <el-icon class="is-loading" :size="28"><Loading /></el-icon>
          <span>加载中...</span>
        </div>
        <template v-else>
          <div v-if="goods.length" class="goods-grid">
            <GoodsCard v-for="g in goods" :key="g.id" :goods="g" />
          </div>
          <el-empty v-else description="没有找到相关商品" />

          <div v-if="goods.length && goods.length < total" class="load-more">
            <el-button round :loading="loadingMore" @click="loadMore">
              加载更多
            </el-button>
          </div>
          <p v-else-if="goods.length" class="no-more">没有更多了</p>
        </template>
      </section>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted, watch } from 'vue'
import { useRoute } from 'vue-router'
import { Search, Loading } from '@element-plus/icons-vue'
import { getGoodsList, getHomeData } from '@/api'
import GoodsCard from '@/components/GoodsCard.vue'

const route = useRoute()

const keyword = ref(route.query.keyword || '')
const activeCategory = ref(Number(route.query.categoryId) || 0)
const categories = ref([])
const goods = ref([])
const total = ref(0)
const page = ref(1)
const pageSize = 10
const loading = ref(true)
const loadingMore = ref(false)

// 拉取商品（ajax）
async function fetchGoods(reset = false) {
  if (reset) {
    page.value = 1
    goods.value = []
    loading.value = true
  }
  const data = await getGoodsList({
    categoryId: activeCategory.value,
    keyword: keyword.value,
    page: page.value,
    pageSize
  })
  goods.value = reset ? data.list : [...goods.value, ...data.list]
  total.value = data.total
  loading.value = false
  loadingMore.value = false
}

const changeCategory = (id) => {
  activeCategory.value = id
  fetchGoods(true)
}

const onSearch = () => fetchGoods(true)

const loadMore = () => {
  loadingMore.value = true
  page.value++
  fetchGoods()
}

// 监听路由 query 变化（首页跳转带参）
watch(
  () => route.query,
  (q) => {
    keyword.value = q.keyword || ''
    activeCategory.value = Number(q.categoryId) || 0
    fetchGoods(true)
  }
)

onMounted(async () => {
  // 分类数据复用首页接口中的 categories
  const home = await getHomeData()
  categories.value = home.categories
  fetchGoods(true)
})
</script>

<style lang="less" scoped>
.category-page {
  .search-header {
    padding-top: 0.2rem;

    @media @pc {
      display: none; // PC 端搜索在 NavBar
    }
  }

  .main {
    display: flex;
    gap: 0.2rem;
    margin-top: 0.2rem;
  }

  .side-menu {
    flex-shrink: 0;
    width: 1.8rem;
    background: #fff;
    border-radius: 0.12rem;
    align-self: flex-start;
    position: sticky;
    top: 0.2rem;

    // 移动端：转为顶部横向滚动条
    @media @mobile {
      position: sticky;
      top: 0;
      z-index: 50;
      width: 100%;
      display: flex;
      overflow-x: auto;
      white-space: nowrap;
      border-radius: 0;
      // 隐藏滚动条
      scrollbar-width: none;
      &::-webkit-scrollbar {
        display: none;
      }
    }

    @media @pc {
      top: 84px;
      width: 160px;
      border-radius: 8px;
    }

    .menu-item {
      padding: 0.26rem 0.2rem;
      font-size: 0.26rem;
      color: @text-main;
      cursor: pointer;
      border-left: 0.06rem solid transparent;
      transition: all 0.3s;

      @media @mobile {
        border-left: none;
        border-bottom: 0.05rem solid transparent;
      }

      &.active {
        color: @primary-color;
        font-weight: bold;
        border-color: @primary-color;
        background: #fff5f0;

        @media @mobile {
          background: #fff;
        }
      }
    }
  }

  .main {
    @media @mobile {
      flex-direction: column;
      gap: 0;
      margin-top: 0;
    }
  }

  .goods-area {
    flex: 1;
    min-height: 60vh;
    padding-top: 0.2rem;

    @media @pc {
      padding-top: 0;
    }

    .loading-box {
      display: flex;
      flex-direction: column;
      align-items: center;
      gap: 0.2rem;
      padding: 1rem 0;
      color: @text-sub;
    }

    .goods-grid {
      display: grid;
      // 响应式列数：手机 2 列，平板 3 列，PC 4 列
      grid-template-columns: repeat(2, 1fr);
      gap: 0.16rem;

      @media @tablet {
        grid-template-columns: repeat(3, 1fr);
      }

      @media @pc {
        grid-template-columns: repeat(4, 1fr);
        gap: 16px;
      }
    }

    .load-more {
      display: flex;
      justify-content: center;
      padding: 0.3rem 0;
    }

    .no-more {
      padding: 0.3rem;
      text-align: center;
      color: @text-sub;
      font-size: 0.24rem;
    }
  }
}
</style>
