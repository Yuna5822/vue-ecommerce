import { Router } from 'express'
import pool from '../db.js'

const router = Router()

// GET /api/goods 商品列表（categoryId / keyword / 分页）
router.get('/', async (req, res) => {
  let { categoryId = 0, keyword = '', page = 1, pageSize = 10 } = req.query
  // 边界防御：防止负数 / 非数字导致 SQL 错误
  page = Math.max(1, Math.floor(Number(page) || 1))
  pageSize = Math.max(1, Math.min(100, Math.floor(Number(pageSize) || 10)))
  const categoryNum = Number(categoryId)
  let sql = 'SELECT id, categoryId, title, price, originalPrice, sales, img, tags FROM goods WHERE 1=1'
  const params = []
  if (categoryNum) {
    sql += ' AND categoryId = ?'
    params.push(categoryNum)
  }
  if (keyword) {
    sql += ' AND title LIKE ?'
    params.push(`%${keyword}%`)
  }
  const countSql = sql.replace('SELECT id, categoryId, title, price, originalPrice, sales, img, tags', 'SELECT COUNT(*) AS total')
  const [[{ total }]] = await pool.query(countSql, params)

  const start = (page - 1) * pageSize
  sql += ' ORDER BY sales DESC LIMIT ? OFFSET ?'
  params.push(pageSize, start)
  const [list] = await pool.query(sql, params)

  res.ok({
    list: list.map((g) => ({ ...g, tags: typeof g.tags === 'string' ? JSON.parse(g.tags) : g.tags })),
    total,
    page: Number(page),
    pageSize: Number(pageSize)
  })
})

// GET /api/goods/:id 商品详情
router.get('/:id', async (req, res) => {
  const id = Number(req.params.id)
  // 边界防御：非数字或非正整数
  if (!id || id < 1 || !Number.isInteger(id)) {
    return res.fail('无效的商品ID', 400)
  }
  const [rows] = await pool.query(
    'SELECT * FROM goods WHERE id = ?',
    [id]
  )
  if (!rows.length) return res.fail('商品不存在', 404)
  const g = rows[0]
  res.ok({
    id: g.id,
    categoryId: g.categoryId,
    title: g.title,
    price: g.price,
    originalPrice: g.originalPrice,
    sales: g.sales,
    img: g.img,
    tags: typeof g.tags === 'string' ? JSON.parse(g.tags) : g.tags,
    detailImages: typeof g.detailImages === 'string' ? JSON.parse(g.detailImages) : g.detailImages,
    skus: typeof g.skus === 'string' ? JSON.parse(g.skus) : g.skus,
    description: g.description
  })
})

export default router
