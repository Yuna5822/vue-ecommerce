import { Router } from 'express'
import pool from '../db.js'

const router = Router()

// GET /api/goods 商品列表（categoryId / keyword / 分页）
router.get('/', async (req, res) => {
  const { categoryId = 0, keyword = '', page = 1, pageSize = 10 } = req.query
  let sql = 'SELECT id, categoryId, title, price, originalPrice, sales, img, tags FROM goods WHERE 1=1'
  const params = []
  if (Number(categoryId)) {
    sql += ' AND categoryId = ?'
    params.push(Number(categoryId))
  }
  if (keyword) {
    sql += ' AND title LIKE ?'
    params.push(`%${keyword}%`)
  }
  const countSql = sql.replace('SELECT id, categoryId, title, price, originalPrice, sales, img, tags', 'SELECT COUNT(*) AS total')
  const [[{ total }]] = await pool.query(countSql, params)

  const start = (Number(page) - 1) * Number(pageSize)
  sql += ' ORDER BY sales DESC LIMIT ? OFFSET ?'
  params.push(Number(pageSize), start)
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
  const { id } = req.params
  const [rows] = await pool.query(
    'SELECT * FROM goods WHERE id = ?',
    [Number(id)]
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
