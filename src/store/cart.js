import { reactive, computed, watch } from 'vue'
import { getCart, addCart, updateCart, deleteCart, selectAllCart } from '@/api'

/**
 * 购物车全局状态
 * - 已登录：后端为数据源，本地 state 作为 UI 缓存，操作时同步到后端
 * - 未登录：localStorage 本地缓存，不影响体验
 */
const isLogin = () => !!localStorage.getItem('token')

const state = reactive({ list: [] })

// 未登录时从 localStorage 读取
if (!isLogin()) {
  state.list = JSON.parse(localStorage.getItem('cart') || '[]')
}

watch(
  () => state.list,
  (val) => {
    if (!isLogin()) localStorage.setItem('cart', JSON.stringify(val))
  },
  { deep: true }
)

/** 从后端拉取购物车（登录后调用） */
export async function fetchCart() {
  if (!isLogin()) return
  try {
    const list = await getCart()
    state.list = list.map((c) => ({
      id: c.goodsId,
      cartId: c.id,
      title: c.title,
      price: c.price,
      img: c.img,
      sku: '默认款',
      count: c.quantity,
      checked: !!c.selected
    }))
  } catch (e) {
    // 未登录或请求失败时忽略
  }
}

/** 加入购物车 */
export async function addToCart(goods, sku = '默认款', count = 1) {
  const item = state.list.find((i) => i.id === goods.id && i.sku === sku)
  if (item) {
    item.count += count
    if (item.cartId && isLogin()) {
      await updateCart(item.cartId, { quantity: item.count }).catch(() => {})
    }
  } else {
    state.list.push({
      id: goods.id,
      cartId: null,
      title: goods.title,
      price: goods.price,
      img: goods.img,
      sku,
      count,
      checked: true
    })
    if (isLogin()) {
      try {
        await addCart({ goodsId: goods.id, quantity: count })
        await fetchCart() // 刷新拿到 cartId
      } catch (e) {}
    }
  }
}

/** 更新数量 */
export async function updateCount(id, sku, count) {
  const item = state.list.find((i) => i.id === id && i.sku === sku)
  if (item) {
    item.count = count
    if (item.cartId && isLogin()) {
      await updateCart(item.cartId, { quantity: count }).catch(() => {})
    }
  }
}

/** 删除商品 */
export async function removeFromCart(id, sku) {
  const idx = state.list.findIndex((i) => i.id === id && i.sku === sku)
  if (idx > -1) {
    const item = state.list[idx]
    state.list.splice(idx, 1)
    if (item.cartId && isLogin()) {
      await deleteCart(item.cartId).catch(() => {})
    }
  }
}

/** 切换勾选 */
export async function toggleCheck(id, sku) {
  const item = state.list.find((i) => i.id === id && i.sku === sku)
  if (item) {
    item.checked = !item.checked
    if (item.cartId && isLogin()) {
      await updateCart(item.cartId, { selected: item.checked ? 1 : 0 }).catch(() => {})
    }
  }
}

/** 全选 / 反选 */
export async function toggleCheckAll(checked) {
  state.list.forEach((i) => (i.checked = checked))
  if (isLogin()) {
    await selectAllCart({ selected: checked ? 1 : 0 }).catch(() => {})
  }
}

/** 清空已勾选商品（结算） */
export async function clearChecked() {
  const checked = state.list.filter((i) => i.checked)
  state.list = state.list.filter((i) => !i.checked)
  if (isLogin()) {
    for (const item of checked) {
      if (item.cartId) await deleteCart(item.cartId).catch(() => {})
    }
  }
}

// 派生数据
export const cartList = computed(() => state.list)
export const cartCount = computed(() => state.list.reduce((sum, i) => sum + i.count, 0))
export const checkedList = computed(() => state.list.filter((i) => i.checked))
export const checkedTotalPrice = computed(() =>
  checkedList.value.reduce((sum, i) => sum + i.price * i.count, 0)
)
export const isAllChecked = computed(
  () => state.list.length > 0 && state.list.every((i) => i.checked)
)
