import { Router } from 'express'
import pool from '../db.js'

const router = Router()

// 简单 token：直接用 "user:{id}" 的 base64（演示用，生产环境应使用 JWT）
const parseToken = (token) => {
  if (!token) return null
  try {
    const raw = Buffer.from(token.split(' ')[1] || token, 'base64').toString()
    const match = raw.match(/^user:(\d+)$/)
    return match ? Number(match[1]) : null
  } catch {
    return null
  }
}

// 从请求中提取 userId
export const getUserId = (req) => {
  const auth = req.headers.authorization
  return parseToken(auth)
}

// POST /api/user/login
router.post('/login', async (req, res) => {
  const { username, password } = req.body
  const [rows] = await pool.query(
    'SELECT id, username, nickname, avatar FROM users WHERE username = ? AND password = ?',
    [username, password]
  )
  if (!rows.length) return res.fail('用户名或密码错误', 401)
  const user = rows[0]
  const token = Buffer.from(`user:${user.id}`).toString('base64')
  res.ok({ token, user })
})

// POST /api/user/register
router.post('/register', async (req, res) => {
  const { username, password, nickname } = req.body
  if (!username || !password) return res.fail('用户名和密码不能为空', 400)
  const [existing] = await pool.query('SELECT id FROM users WHERE username = ?', [username])
  if (existing.length) return res.fail('用户名已存在', 400)
  const [result] = await pool.query(
    'INSERT INTO users (username, password, nickname) VALUES (?, ?, ?)',
    [username, password, nickname || username]
  )
  const token = Buffer.from(`user:${result.insertId}`).toString('base64')
  res.ok({ token, user: { id: result.insertId, username, nickname: nickname || username } })
})

// GET /api/user/info
router.get('/info', async (req, res) => {
  const userId = getUserId(req)
  if (!userId) return res.fail('未登录', 401)
  const [rows] = await pool.query(
    'SELECT id, username, nickname, avatar FROM users WHERE id = ?',
    [userId]
  )
  if (!rows.length) return res.fail('用户不存在', 404)
  res.ok(rows[0])
})

export default router
