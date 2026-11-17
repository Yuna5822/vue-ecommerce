import request from './request'

/* ===== 首页与商品 ===== */
/** 首页聚合数据（轮播图、分类、推荐） */
export const getHomeData = () => request.get('/home')

/** 商品列表：{ categoryId, keyword, page, pageSize } */
export const getGoodsList = (params) => request.get('/goods', { params })

/** 商品详情 */
export const getGoodsDetail = (id) => request.get(`/goods/${id}`)

/* ===== 用户 ===== */
/** 登录 */
export const login = (data) => request.post('/user/login', data)

/** 注册 */
export const register = (data) => request.post('/user/register', data)

/** 当前用户信息 */
export const getUserInfo = () => request.get('/user/info')

/* ===== 购物车 ===== */
/** 购物车列表 */
export const getCart = () => request.get('/cart')

/** 加入购物车 { goodsId, quantity } */
export const addCart = (data) => request.post('/cart', data)

/** 修改购物车项 { quantity, selected } */
export const updateCart = (id, data) => request.put(`/cart/${id}`, data)

/** 全选/取消全选 { selected } */
export const selectAllCart = (data) => request.put('/cart/select/all', data)

/** 删除购物车项 */
export const deleteCart = (id) => request.delete(`/cart/${id}`)

/* ===== 订单 ===== */
/** 订单列表 */
export const getOrders = () => request.get('/order')

/** 下单（从购物车选中项生成） */
export const createOrder = () => request.post('/order')
