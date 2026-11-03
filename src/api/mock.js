/**
 * Mock 数据层：模拟后端接口
 * 通过自定义 axios adapter 接管请求，保持真实 ajax 调用方式不变
 * 将来接入真实后端时，只需把 request.js 中的 adapter 去掉即可
 *
 * 图片存放约定（Vite public 目录，打包后原样拷贝到 dist/）：
 *   轮播图    → public/images/banners/banner1.png / banner2.png / banner3.png
 *   分类图标  → public/images/categories/default.svg（iconfont 图标已接入，分类不再用图片）
 *   商品图    → public/images/goods/goods{商品id}.png（如 goods101.png）
 */

// 本地图片路径生成器（Vite public 目录下的资源以 / 开头引用）
const BANNER_BASE = '/images/banners'
const CAT_BASE = '/images/categories'
const GOODS_BASE = '/images/goods'

const bannerImg = (n) => `${BANNER_BASE}/banner${n}.png`
const catImg = () => `${CAT_BASE}/default.svg`
const goodsImg = (id) => `${GOODS_BASE}/goods${id}.png`

// 轮播图（3 张）
const banners = [
  { id: 1, img: bannerImg(1), title: '数码狂欢节' },
  { id: 2, img: bannerImg(2), title: '秋冬新装上市' },
  { id: 3, img: bannerImg(3), title: '生鲜特惠日' }
]

// 商品分类（8 个，使用 iconfont 图标，icon 字段存 class 名数组，模板 :class 绑定）
const categories = [
  { id: 1, name: '手机数码', icon: ['iconfont', 'icon-shumashouji'] },
  { id: 2, name: '服装鞋包', icon: ['iconfont', 'icon-clothes'] },
  { id: 3, name: '美妆个护', icon: ['iconfont', 'icon-meizhuang'] },
  { id: 4, name: '食品生鲜', icon: ['iconfont', 'icon-shipin-shengxian-xia'] },
  { id: 5, name: '家居家纺', icon: ['iconfont', 'icon-jiajujiafang'] },
  { id: 6, name: '家用电器', icon: ['iconfont', 'icon-jiayongdianqi'] },
  { id: 7, name: '母婴玩具', icon: ['iconfont', 'icon-muyingwanju'] },
  { id: 8, name: '运动户外', icon: ['iconfont', 'icon-yundonghuwai'] }
]

// 商品列表（img 字段按 id 约定路径）
const goodsList = [
  { id: 101, categoryId: 1, title: '华为 Mate 70 Pro 智能手机 12GB+512GB 曜石黑', price: 6499, originalPrice: 6999, sales: 2300, img: goodsImg(101), tags: ['新品', '包邮'] },
  { id: 102, categoryId: 1, title: '小米平板 7 英寸高刷屏平板电脑 8GB+256GB', price: 1999, originalPrice: 2299, sales: 5600, img: goodsImg(102), tags: ['热卖'] },
  { id: 103, categoryId: 1, title: '无线蓝牙降噪耳机 超长续航 运动防水', price: 299, originalPrice: 499, sales: 12000, img: goodsImg(103), tags: ['包邮'] },
  { id: 104, categoryId: 1, title: '智能手表 心率血氧监测 1.85英寸大屏', price: 399, originalPrice: 599, sales: 8900, img: goodsImg(104), tags: [] },
  { id: 201, categoryId: 2, title: '冬季新款加绒连帽卫衣 男女同款宽松版型', price: 129, originalPrice: 259, sales: 31000, img: goodsImg(201), tags: ['新品'] },
  { id: 202, categoryId: 2, title: '轻便跑步鞋 透气网面减震运动鞋', price: 199, originalPrice: 399, sales: 15000, img: goodsImg(202), tags: ['热卖'] },
  { id: 203, categoryId: 2, title: '简约通勤双肩包 大容量防水电脑背包', price: 159, originalPrice: 299, sales: 6700, img: goodsImg(203), tags: [] },
  { id: 301, categoryId: 3, title: '保湿修护面霜 玻尿酸深层补水 50g', price: 89, originalPrice: 169, sales: 25000, img: goodsImg(301), tags: ['热卖'] },
  { id: 302, categoryId: 3, title: '丝绒哑光口红 持久显色不易脱妆', price: 69, originalPrice: 129, sales: 18000, img: goodsImg(302), tags: ['包邮'] },
  { id: 401, categoryId: 4, title: '赣南脐橙 新鲜水果 5斤装 产地直发', price: 39.9, originalPrice: 59.9, sales: 42000, img: goodsImg(401), tags: ['生鲜'] },
  { id: 402, categoryId: 4, title: '每日坚果混合装 30包 孕妇儿童零食', price: 79, originalPrice: 119, sales: 9800, img: goodsImg(402), tags: [] },
  { id: 403, categoryId: 4, title: '精品冷萃咖啡液 0蔗糖 即溶黑咖啡 12条', price: 45, originalPrice: 69, sales: 7600, img: goodsImg(403), tags: ['新品'] },
  { id: 501, categoryId: 5, title: '全棉四件套 简约北欧风床品 1.8m床适用', price: 219, originalPrice: 399, sales: 4300, img: goodsImg(501), tags: [] },
  { id: 502, categoryId: 5, title: '乳胶枕头 护颈椎助睡眠 单人枕芯', price: 99, originalPrice: 199, sales: 11000, img: goodsImg(502), tags: ['热卖'] },
  { id: 601, categoryId: 6, title: '变频滚筒洗衣机 10公斤 一级能效', price: 1899, originalPrice: 2399, sales: 2100, img: goodsImg(601), tags: ['包邮'] },
  { id: 602, categoryId: 6, title: '空气炸锅 5L大容量 无油低脂炸烤', price: 269, originalPrice: 399, sales: 19000, img: goodsImg(602), tags: ['热卖'] },
  { id: 701, categoryId: 7, title: '婴儿纸尿裤 超薄透气 L码 68片装', price: 89, originalPrice: 139, sales: 27000, img: goodsImg(701), tags: [] },
  { id: 702, categoryId: 7, title: '儿童积木拼装玩具 益智大颗粒 120粒', price: 79, originalPrice: 129, sales: 8500, img: goodsImg(702), tags: ['新品'] },
  { id: 801, categoryId: 8, title: '瑜伽垫 加厚防滑 TPE材质 健身垫', price: 49, originalPrice: 99, sales: 14000, img: goodsImg(801), tags: [] },
  { id: 802, categoryId: 8, title: '户外登山包 40L 防泼水徒步旅行背包', price: 189, originalPrice: 329, sales: 3900, img: goodsImg(802), tags: ['热卖'] }
]

const delay = (ms = 300) => new Promise((resolve) => setTimeout(resolve, ms))

/** 模拟后端路由 */
async function handleRequest(config) {
  await delay(200 + Math.random() * 300)
  const { url, params = {} } = config

  // GET /home 首页聚合数据
  if (url === '/home') {
    return {
      banners,
      categories,
      recommends: goodsList.filter((g) => g.tags.includes('热卖')).slice(0, 10)
    }
  }

  // GET /goods 商品列表（支持 categoryId / keyword / 分页）
  if (url === '/goods') {
    const { categoryId = 0, keyword = '', page = 1, pageSize = 10 } = params
    let list = [...goodsList]
    if (categoryId) list = list.filter((g) => g.categoryId === Number(categoryId))
    if (keyword) list = list.filter((g) => g.title.includes(keyword))
    const start = (page - 1) * pageSize
    return {
      list: list.slice(start, start + pageSize),
      total: list.length,
      page,
      pageSize
    }
  }

  // GET /goods/:id 商品详情
  const detailMatch = url.match(/^\/goods\/(\d+)$/)
  if (detailMatch) {
    const goods = goodsList.find((g) => g.id === Number(detailMatch[1]))
    if (!goods) {
      const error = new Error('商品不存在')
      error.code = 404
      throw error
    }
    return {
      ...goods,
      detailImages: [goods.img, goods.img],
      skus: ['默认款', '升级款', '豪华款'],
      description:
        '正品保障 · 七天无理由退换 · 极速发货。该商品由易购商城官方自营仓发货，支持全国联保，品质保证。'
    }
  }

  const error = new Error(`接口不存在: ${url}`)
  error.code = 404
  throw error
}

/** 自定义 axios adapter：接管所有请求并返回 mock 响应 */
export async function mockAdapter(config) {
  try {
    const data = await handleRequest(config)
    return {
      data: { code: 0, message: 'ok', data },
      status: 200,
      statusText: 'OK',
      headers: {},
      config
    }
  } catch (err) {
    return Promise.reject({
      response: {
        data: { code: err.code || 500, message: err.message },
        status: err.code || 500
      },
      config
    })
  }
}
