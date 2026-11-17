import { Router } from 'express'
import pool from '../db.js'

const router = Router()

// GET /api/home 首页聚合数据
router.get('/', async (req, res) => {
  const [banners] = await pool.query('SELECT id, img, title FROM banners ORDER BY id')
  const [categories] = await pool.query('SELECT id, name, icon FROM categories ORDER BY id')
  // 推荐：带"热卖"标签的商品取前 10
  const [recommends] = await pool.query(
    `SELECT id, categoryId, title, price, originalPrice, sales, img, tags
     FROM goods
     WHERE JSON_CONTAINS(tags, '"热卖"')
     ORDER BY sales DESC
     LIMIT 10`
  )
  // mysql2 会自动解析 JSON 列，兼容字符串/对象两种情况
  const safeParse = (v) => (typeof v === 'string' ? JSON.parse(v) : v)
  const parseIcon = (c) => ({ ...c, icon: safeParse(c.icon) })
  const parseTags = (g) => ({ ...g, tags: safeParse(g.tags) })
  res.ok({
    banners,
    categories: categories.map(parseIcon),
    recommends: recommends.map(parseTags)
  })
})

export default router
