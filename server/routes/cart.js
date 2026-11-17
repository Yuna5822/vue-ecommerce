import { Router } from 'express'
import pool from '../db.js'
import { getUserId } from './user.js'

const router = Router()

// 鉴权中间件
const auth = (req, res, next) => {
  const userId = getUserId(req)
  if (!userId) return res.fail('未登录', 401)
  req.userId = userId
  next()
}

// GET /api/cart 购物车列表（含商品信息）
router.get('/', auth, async (req, res) => {
  const [list] = await pool.query(
    `SELECT c.id, c.goodsId, c.quantity, c.selected,
            g.title, g.price, g.originalPrice, g.img, g.tags
     FROM cart c JOIN goods g ON c.goodsId = g.id
     WHERE c.userId = ?
     ORDER BY c.id DESC`,
    [req.userId]
  )
  res.ok(list.map((c) => ({ ...c, tags: typeof c.tags === 'string' ? JSON.parse(c.tags) : c.tags })))
})

// POST /api/cart 加入购物车
router.post('/', auth, async (req, res) => {
  const { goodsId, quantity = 1 } = req.body
  const [existing] = await pool.query(
    'SELECT id, quantity FROM cart WHERE userId = ? AND goodsId = ?',
    [req.userId, goodsId]
  )
  if (existing.length) {
    await pool.query(
      'UPDATE cart SET quantity = quantity + ? WHERE id = ?',
      [quantity, existing[0].id]
    )
  } else {
    await pool.query(
      'INSERT INTO cart (userId, goodsId, quantity) VALUES (?, ?, ?)',
      [req.userId, goodsId, quantity]
    )
  }
  res.ok({ success: true })
})

// PUT /api/cart/:id 修改数量/选中状态
router.put('/:id', auth, async (req, res) => {
  const { id } = req.params
  const { quantity, selected } = req.body
  const sets = []
  const params = []
  if (quantity !== undefined) { sets.push('quantity = ?'); params.push(quantity) }
  if (selected !== undefined) { sets.push('selected = ?'); params.push(selected) }
  if (!sets.length) return res.fail('无更新内容', 400)
  params.push(id, req.userId)
  await pool.query(`UPDATE cart SET ${sets.join(',')} WHERE id = ? AND userId = ?`, params)
  res.ok({ success: true })
})

// PUT /api/cart/select/all 全选/取消全选
router.put('/select/all', auth, async (req, res) => {
  const { selected } = req.body
  await pool.query(
    'UPDATE cart SET selected = ? WHERE userId = ?',
    [selected ? 1 : 0, req.userId]
  )
  res.ok({ success: true })
})

// DELETE /api/cart/:id 删除购物车项
router.delete('/:id', auth, async (req, res) => {
  const { id } = req.params
  await pool.query('DELETE FROM cart WHERE id = ? AND userId = ?', [id, req.userId])
  res.ok({ success: true })
})

export default router
