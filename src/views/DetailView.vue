<template>
  <div class="page detail-page">
    <div class="container" v-loading="loading">
      <template v-if="goods">
        <div class="detail-card">
          <!-- 商品图 -->
          <div class="gallery">
            <img :src="goods.img" :alt="goods.title" />
          </div>

          <!-- 商品信息 -->
          <div class="info">
            <h1 class="title">{{ goods.title }}</h1>

            <div class="price-row">
              <span class="price"><i>¥</i>{{ goods.price }}</span>
              <del v-if="goods.originalPrice" class="origin">¥{{ goods.originalPrice }}</del>
              <span class="sales">已售 {{ goods.sales }}</span>
            </div>

            <div class="row">
              <span class="label">规格</span>
              <el-radio-group v-model="selectedSku">
                <el-radio-button v-for="s in goods.skus" :key="s" :value="s">
                  {{ s }}
                </el-radio-button>
              </el-radio-group>
            </div>

            <div class="row">
              <span class="label">数量</span>
              <el-input-number v-model="count" :min="1" :max="99" />
            </div>

            <div class="row desc-row">
              <span class="label">服务</span>
              <p class="desc">{{ goods.description }}</p>
            </div>

            <div class="actions">
              <el-button size="large" round @click="handleAddCart">
                加入购物车
              </el-button>
              <el-button size="large" round type="danger" @click="handleBuyNow">
                立即购买
              </el-button>
            </div>
          </div>
        </div>
      </template>
    </div>

    <!-- 移动端底部吸底操作栏 -->
    <div v-if="goods" class="m-action-bar">
      <router-link to="/cart" class="cart-entry">
        <el-icon :size="22"><ShoppingCart /></el-icon>
        <span v-if="cartCount > 0" class="badge">{{ cartCount }}</span>
        <span class="txt">购物车</span>
      </router-link>
      <el-button class="btn-cart" round @click="handleAddCart">加入购物车</el-button>
      <el-button class="btn-buy" round @click="handleBuyNow">立即购买</el-button>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { ElMessage } from 'element-plus'
import { ShoppingCart } from '@element-plus/icons-vue'
import { getGoodsDetail } from '@/api'
import { addToCart, cartCount } from '@/store/cart'

const route = useRoute()
const router = useRouter()

const loading = ref(true)
const goods = ref(null)
const selectedSku = ref('')
const count = ref(1)

onMounted(async () => {
  try {
    // ajax 拉取商品详情
    const data = await getGoodsDetail(route.params.id)
    goods.value = data
    selectedSku.value = data.skus[0]
  } finally {
    loading.value = false
  }
})

const handleAddCart = () => {
  addToCart(goods.value, selectedSku.value, count.value)
  ElMessage.success('已加入购物车')
}

const handleBuyNow = () => {
  addToCart(goods.value, selectedSku.value, count.value)
  router.push('/cart')
}
</script>

<style lang="less" scoped>
.detail-page {
  .detail-card {
    display: flex;
    flex-direction: column;
    gap: 0.2rem;
    margin-top: 0.2rem;

    @media @pc {
      flex-direction: row;
      gap: 40px;
      margin-top: 20px;
      padding: 30px;
      background: #fff;
      border-radius: 12px;
    }
  }

  .gallery {
    width: 100%;
    border-radius: 0.16rem;
    overflow: hidden;
    background: #fff;

    @media @pc {
      width: 460px;
      flex-shrink: 0;
      border-radius: 8px;
    }

    img {
      width: 100%;
      aspect-ratio: 1 / 1;
      object-fit: cover;
    }
  }

  .info {
    padding: 0.2rem;
    background: #fff;
    border-radius: 0.16rem;

    @media @pc {
      flex: 1;
      padding: 0;
      border-radius: 0;
    }

    .title {
      font-size: 0.32rem;
      line-height: 1.5;

      @media @pc {
        font-size: 22px;
      }
    }

    .price-row {
      display: flex;
      align-items: baseline;
      gap: 0.16rem;
      margin-top: 0.2rem;
      padding: 0.2rem;
      border-radius: 0.12rem;
      background: linear-gradient(90deg, #fff0e8, #fff8f5);

      .price {
        color: @price-color;
        font-size: 0.52rem;
        font-weight: bold;

        i {
          font-style: normal;
          font-size: 0.3rem;
        }
      }

      .origin {
        color: @text-sub;
        font-size: 0.26rem;
      }

      .sales {
        margin-left: auto;
        color: @text-sub;
        font-size: 0.24rem;
      }
    }

    .row {
      display: flex;
      align-items: flex-start;
      gap: 0.2rem;
      margin-top: 0.3rem;

      .label {
        flex-shrink: 0;
        padding-top: 0.08rem;
        color: @text-sub;
        font-size: 0.26rem;
      }

      .desc {
        color: @text-sub;
        font-size: 0.26rem;
        line-height: 1.8;
      }
    }

    .actions {
      // 移动端隐藏卡片内按钮（用吸底栏），PC 显示
      display: none;

      @media @pc {
        display: flex;
        gap: 16px;
        margin-top: 40px;

        .el-button {
          min-width: 160px;
        }
      }
    }
  }

  // 移动端吸底操作栏
  .m-action-bar {
    position: fixed;
    bottom: 1.1rem; // 位于 TabBar 之上
    left: 0;
    right: 0;
    z-index: 90;
    display: flex;
    align-items: center;
    gap: 0.16rem;
    padding: 0.12rem 0.2rem;
    padding-bottom: calc(0.12rem + env(safe-area-inset-bottom));
    background: #fff;
    border-top: 1px solid @border-color;

    @media @pc {
      display: none;
    }

    .cart-entry {
      position: relative;
      display: flex;
      flex-direction: column;
      align-items: center;
      color: @text-sub;

      .badge {
        position: absolute;
        top: -0.06rem;
        right: -0.06rem;
        min-width: 0.3rem;
        height: 0.3rem;
        line-height: 0.3rem;
        border-radius: 0.15rem;
        background: @price-color;
        color: #fff;
        font-size: 0.18rem;
        text-align: center;
      }

      .txt {
        font-size: 0.2rem;
      }
    }

    .el-button {
      flex: 1;
      border: none;

      &.btn-cart {
        background: linear-gradient(135deg, #ff69b4, #ff1493);
        color: #fff;
      }

      &.btn-buy {
        background: linear-gradient(135deg, #ff1493, #c71585);
        color: #fff;
      }
    }
  }

  // 为吸底栏留位
  padding-bottom: 2.6rem;

  @media @pc {
    padding-bottom: 60px;
  }
}
</style>
