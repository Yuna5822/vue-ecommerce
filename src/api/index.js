import request from './request'

/** 首页聚合数据（轮播图、分类、推荐） */
export const getHomeData = () => request.get('/home')

/** 商品列表：{ categoryId, keyword, page, pageSize } */
export const getGoodsList = (params) => request.get('/goods', { params })

/** 商品详情 */
export const getGoodsDetail = (id) => request.get(`/goods/${id}`)
