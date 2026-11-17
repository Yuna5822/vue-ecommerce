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
  height: 100%;
  display: flex;
  flex-direction: column;
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
    padding-top: 100%; // 1:1 正方形，比 aspect-ratio 更稳定
    background: #fafafa;
    overflow: hidden;

    img {
      position: absolute;
      top: 0;
      left: 0;
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
      z-index: 1;
    }
  }

  &:hover .img-box img {
    transform: scale(1.05);
  }

  .info {
    padding: 0.14rem 0.16rem;
    flex: 1;
    display: flex;
    flex-direction: column;

    .title {
      font-size: 0.26rem;
      font-weight: normal;
      line-height: 1.4;
      height: 2.8em;
      .text-clamp(2);
    }

    .bottom {
      margin-top: auto;
      padding-top: 0.1rem;
      display: flex;
      align-items: flex-end;
      justify-content: space-between;
      gap: 0.06rem;

      .price-box {
        flex: 1;
        min-width: 0;
        display: flex;
        align-items: baseline;
        flex-wrap: wrap;
      }

      .price {
        color: @price-color;
        font-size: 0.32rem;
        font-weight: bold;
        white-space: nowrap;

        i {
          font-style: normal;
          font-size: 0.2rem;
        }
      }

      .origin {
        margin-left: 0.06rem;
        color: @text-sub;
        font-size: 0.18rem;
        white-space: nowrap;
      }

      .sales {
        color: @text-sub;
        font-size: 0.18rem;
        white-space: nowrap;
        flex-shrink: 0;
      }
    }
  }
}
</style>
