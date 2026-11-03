<template>
  <div class="page cart-page">
    <div class="container">
      <h2 class="page-title">购物车（{{ cartCount }}）</h2>

      <template v-if="cartList.length">
        <!-- 商品列表 -->
        <div class="cart-list">
          <div v-for="item in cartList" :key="item.id + item.sku" class="cart-item">
            <el-checkbox
              :model-value="item.checked"
              @change="toggleCheck(item.id, item.sku)"
            />
            <img class="thumb" :src="item.img" :alt="item.title" @click="goDetail(item.id)" />
            <div class="info">
              <h3 class="title" @click="goDetail(item.id)">{{ item.title }}</h3>
              <p class="sku">规格：{{ item.sku }}</p>
              <div class="bottom">
                <span class="price">¥{{ item.price }}</span>
                <div class="ops">
                  <el-input-number
                    :model-value="item.count"
                    :min="1"
                    :max="99"
                    size="small"
                    @change="(val) => updateCount(item.id, item.sku, val)"
                  />
                  <el-icon class="del" :size="18" @click="onRemove(item)">
                    <Delete />
                  </el-icon>
                </div>
              </div>
            </div>
          </div>
        </div>

        <!-- 结算栏 -->
        <div class="settle-bar" :class="{ fixed: isMobile }">
          <el-checkbox
            :model-value="isAllChecked"
            @change="toggleCheckAll"
          >
            全选
          </el-checkbox>
          <div class="total">
            <span>合计：</span>
            <span class="total-price">¥{{ checkedTotalPrice.toFixed(2) }}</span>
          </div>
          <el-button
            type="danger"
            round
            size="large"
            :disabled="!checkedList.length"
            @click="onSettle"
          >
            结算（{{ checkedList.length }}）
          </el-button>
        </div>
      </template>

      <el-empty v-else description="购物车还是空的">
        <el-button type="primary" round @click="$router.push('/')">去逛逛</el-button>
      </el-empty>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted, onUnmounted } from 'vue'
import { useRouter } from 'vue-router'
import { ElMessage, ElMessageBox } from 'element-plus'
import { Delete } from '@element-plus/icons-vue'
import {
  cartList,
  cartCount,
  checkedList,
  checkedTotalPrice,
  isAllChecked,
  toggleCheck,
  toggleCheckAll,
  updateCount,
  removeFromCart,
  clearChecked
} from '@/store/cart'

const router = useRouter()

// 根据视口判断结算栏是否吸底（JS 媒体查询）
const isMobile = ref(window.innerWidth < 768)
const onResize = () => (isMobile.value = window.innerWidth < 768)
onMounted(() => window.addEventListener('resize', onResize))
onUnmounted(() => window.removeEventListener('resize', onResize))

const goDetail = (id) => router.push(`/goods/${id}`)

const onRemove = (item) => {
  ElMessageBox.confirm('确定删除该商品吗？', '提示', {
    confirmButtonText: '删除',
    cancelButtonText: '取消',
    type: 'warning'
  }).then(() => {
    removeFromCart(item.id, item.sku)
    ElMessage.success('已删除')
  }).catch(() => {})
}

const onSettle = () => {
  ElMessageBox.confirm(
    `共 ${checkedList.value.length} 件商品，合计 ¥${checkedTotalPrice.value.toFixed(2)}，确认下单？`,
    '订单确认',
    { confirmButtonText: '提交订单', cancelButtonText: '再想想' }
  ).then(() => {
    clearChecked()
    ElMessage.success('下单成功！')
  }).catch(() => {})
}
</script>

<style lang="less" scoped>
.cart-page {
  .page-title {
    padding: 0.3rem 0 0.2rem;
    font-size: 0.36rem;

    @media @pc {
      font-size: 24px;
    }
  }

  .cart-list {
    display: flex;
    flex-direction: column;
    gap: 0.16rem;

    .cart-item {
      display: flex;
      align-items: center;
      gap: 0.16rem;
      padding: 0.2rem;
      background: #fff;
      border-radius: 0.12rem;

      @media @pc {
        padding: 20px;
        border-radius: 8px;
      }

      .thumb {
        width: 1.6rem;
        height: 1.6rem;
        border-radius: 0.08rem;
        object-fit: cover;
        cursor: pointer;

        @media @pc {
          width: 120px;
          height: 120px;
        }
      }

      .info {
        flex: 1;
        min-width: 0;

        .title {
          font-size: 0.26rem;
          font-weight: normal;
          cursor: pointer;
          .text-clamp(2);

          &:hover {
            color: @primary-color;
          }
        }

        .sku {
          margin-top: 0.06rem;
          color: @text-sub;
          font-size: 0.22rem;
        }

        .bottom {
          display: flex;
          align-items: center;
          justify-content: space-between;
          margin-top: 0.14rem;

          .price {
            color: @price-color;
            font-size: 0.34rem;
            font-weight: bold;
          }

          .ops {
            display: flex;
            align-items: center;
            gap: 0.24rem;

            .del {
              color: @text-sub;
              cursor: pointer;
              transition: color 0.3s;

              &:hover {
                color: @price-color;
              }
            }
          }
        }
      }
    }
  }

  .settle-bar {
    display: flex;
    align-items: center;
    gap: 0.3rem;
    margin-top: 0.2rem;
    padding: 0.2rem 0.24rem;
    background: #fff;
    border-radius: 0.12rem;

    // 移动端吸底（位于 TabBar 之上）
    &.fixed {
      position: fixed;
      bottom: 1.1rem;
      left: 0;
      right: 0;
      z-index: 90;
      margin-top: 0;
      border-radius: 0;
      border-top: 1px solid @border-color;
      padding-bottom: calc(0.2rem + env(safe-area-inset-bottom));
    }

    @media @pc {
      border-radius: 8px;
    }

    .total {
      margin-left: auto;
      font-size: 0.28rem;

      .total-price {
        color: @price-color;
        font-size: 0.4rem;
        font-weight: bold;
      }
    }
  }

  padding-bottom: 2.6rem;

  @media @pc {
    padding-bottom: 60px;
  }
}
</style>
