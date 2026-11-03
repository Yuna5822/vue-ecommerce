import { reactive, computed, watch } from 'vue'

/**
 * 购物车全局状态（轻量方案：reactive + localStorage 持久化）
 * 不引入 pinia，保持项目精简；数据驱动视图，任何组件操作后自动同步
 */

// 兼容：把历史遗留的旧图片路径统一迁移到当前命名规则 goods{id}.png
// 用户在路径演化过程中（goodsImage → goods，svg → png）加入购物车的商品，
// img 字段存的是当时的 URL，不会自动跟着 mock.js 变，这里一次性修正
function migrateImgPaths(list) {
  return list.map((item) => {
    if (!item.img) return item
    const id = item.id
    const expected = `/images/goods/goods${id}.png`
    // 已经是最新路径的跳过
    if (item.img === expected) return item
    // 包含旧片段的统一替换
    const migrated = item.img
      .replace(/goodsImage/g, 'goods')          // goodsImage101 → goods101
      .replace(/\/g(\d+)\.svg$/, '/goods$1.png') // g101.svg → goods101.png
      .replace(/\.svg$/, '.png')
      .replace(/\/placeholder\.(svg|png)$/, expected)
    return { ...item, img: migrated }
  })
}

const migrated = migrateImgPaths(JSON.parse(localStorage.getItem('cart') || '[]'))
if (migrated.length) localStorage.setItem('cart', JSON.stringify(migrated))
const state = reactive({ list: migrated })

// 任何变更自动持久化
watch(
  () => state.list,
  (val) => localStorage.setItem('cart', JSON.stringify(val)),
  { deep: true }
)

/** 加入购物车 */
export function addToCart(goods, sku = '默认款', count = 1) {
  const item = state.list.find((i) => i.id === goods.id && i.sku === sku)
  if (item) {
    item.count += count
  } else {
    state.list.push({
      id: goods.id,
      title: goods.title,
      price: goods.price,
      img: goods.img,
      sku,
      count,
      checked: true
    })
  }
}

/** 更新数量 */
export function updateCount(id, sku, count) {
  const item = state.list.find((i) => i.id === id && i.sku === sku)
  if (item) item.count = count
}

/** 删除商品 */
export function removeFromCart(id, sku) {
  const idx = state.list.findIndex((i) => i.id === id && i.sku === sku)
  if (idx > -1) state.list.splice(idx, 1)
}

/** 切换勾选 */
export function toggleCheck(id, sku) {
  const item = state.list.find((i) => i.id === id && i.sku === sku)
  if (item) item.checked = !item.checked
}

/** 全选 / 反选 */
export function toggleCheckAll(checked) {
  state.list.forEach((i) => (i.checked = checked))
}

/** 清空已勾选商品（结算） */
export function clearChecked() {
  state.list = state.list.filter((i) => !i.checked)
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
