<template>
  <div class="goods-card" @click="goDetail">
    <div class="img-box">
      <img :src="goods.img" :alt="goods.title" loading="lazy" />
      <span v-if="goods.tags?.length" class="tag">{{ goods.tags[0] }}</span>
    </div>
    <div class="info">
      <h3 class="title">{{ goods.title }}</h3>
      <div class="bottom">
        <div class="price-box">
          <span class="price"><i>¥</i>{{ goods.price }}</span>
          <del v-if="goods.originalPrice" class="origin">¥{{ goods.originalPrice }}</del>
        </div>
        <span class="sales">{{ formatSales(goods.sales) }}人付款</span>
      </div>
    </div>
  </div>
</template>

<script setup>
import { useRouter } from 'vue-router'

const props = defineProps({
  goods: { type: Object, required: true }
})

const router = useRouter()
const goDetail = () => router.push(`/goods/${props.goods.id}`)

const formatSales = (n) => (n >= 10000 ? `${(n / 10000).toFixed(1)}万` : n)
</script>

<style lang="less" scoped>
.goods-card {
  background: #fff;
  border-radius: 0.12rem;
  overflow: hidden;
  cursor: pointer;
  // CSS3 过渡与阴影
  transition: transform 0.3s ease, box-shadow 0.3s ease;

  @media @pc {
    border-radius: 8px;

    &:hover {
      transform: translateY(-4px);
      box-shadow: 0 8px 24px rgba(0, 0, 0, 0.1);
    }
  }

  .img-box {
    position: relative;
    width: 100%;
    aspect-ratio: 1 / 1;
    background: #fafafa;
    overflow: hidden;

    img {
      width: 100%;
      height: 100%;
      object-fit: cover;
      transition: transform 0.5s ease;
    }

    .tag {
      position: absolute;
      top: 0.1rem;
      left: 0.1rem;
      padding: 0.02rem 0.1rem;
      border-radius: 0.06rem;
      background: linear-gradient(135deg, #ff69b4, #ff1493);
      color: #fff;
      font-size: 0.18rem;
    }
  }

  &:hover .img-box img {
    transform: scale(1.05);
  }

  .info {
    padding: 0.14rem 0.16rem;

    .title {
      font-size: 0.26rem;
      font-weight: normal;
      line-height: 1.4;
      height: 2.8em;
      .text-clamp(2);
    }

    .bottom {
      margin-top: 0.1rem;
      display: flex;
      align-items: flex-end;
      justify-content: space-between;

      .price {
        color: @price-color;
        font-size: 0.36rem;
        font-weight: bold;

        i {
          font-style: normal;
          font-size: 0.22rem;
        }
      }

      .origin {
        margin-left: 0.08rem;
        color: @text-sub;
        font-size: 0.2rem;
      }

      .sales {
        color: @text-sub;
        font-size: 0.2rem;
      }
    }
  }
}
</style>
