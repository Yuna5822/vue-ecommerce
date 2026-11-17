import { Router } from 'express'
import pool from '../db.js'
import { getUserId } from './user.js'

const router = Router()

const auth = (req, res, next) => {
  const userId = getUserId(req)
  if (!userId) return res.fail('未登录', 401)
  req.userId = userId
  next()
}

// GET /api/order 订单列表
router.get('/', auth, async (req, res) => {
  const [list] = await pool.query(
    `SELECT o.id, o.goodsId, o.quantity, o.price, o.status, o.createdAt,
            g.title, g.img
     FROM orders o JOIN goods g ON o.goodsId = g.id
     WHERE o.userId = ?
     ORDER BY o.id DESC`,
    [req.userId]
  )
  res.ok(list)
})

// POST /api/order 下单（从购物车选中项生成）
router.post('/', auth, async (req, res) => {
  const conn = await pool.getConnection()
  try {
    await conn.beginTransaction()
    // 查出购物车选中项
    const [items] = await conn.query(
      `SELECT c.goodsId, c.quantity, g.price
       FROM cart c JOIN goods g ON c.goodsId = g.id
       WHERE c.userId = ? AND c.selected = 1`,
      [req.userId]
    )
    if (!items.length) {
      await conn.rollback()
      return res.fail('请先选择商品', 400)
    }
    // 批量插入订单
    const values = items.map((i) => [req.userId, i.goodsId, i.quantity, i.price])
    await conn.query(
      'INSERT INTO orders (userId, goodsId, quantity, price) VALUES ?',
      [values]
    )
    // 清空已下单的购物车项
    await conn.query(
      'DELETE FROM cart WHERE userId = ? AND selected = 1',
      [req.userId]
    )
    await conn.commit()
    res.ok({ success: true, count: items.length })
  } catch (err) {
    await conn.rollback()
    throw err
  } finally {
    conn.release()
  }
})

export default router
