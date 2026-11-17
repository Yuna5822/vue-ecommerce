import express from 'express'
import cors from 'cors'
import homeRoutes from './routes/home.js'
import goodsRoutes from './routes/goods.js'
import cartRoutes from './routes/cart.js'
import userRoutes from './routes/user.js'
import orderRoutes from './routes/order.js'

const app = express()
const PORT = 3000

// 中间件
app.use(cors())
app.use(express.json())
app.use(express.urlencoded({ extended: true }))

// 统一响应格式
app.use((req, res, next) => {
  res.ok = (data) => res.json({ code: 0, message: 'ok', data })
  res.fail = (message, code = 500) => res.status(code).json({ code, message })
  next()
})

// 根路径：后端健康检查 + 提示
app.get('/', (req, res) => {
  res.type('html').send(`
    <div style="font-family:sans-serif;text-align:center;padding:60px">
      <h2>易购商城后端服务</h2>
      <p>状态：<span style="color:#67c23a">运行中</span></p>
      <p>前端页面请访问：<a href="http://localhost:5173">http://localhost:5173</a></p>
      <p>接口文档：<code>GET /api/home</code> · <code>GET /api/goods</code> · <code>POST /api/user/login</code></p>
    </div>
  `)
})

// 路由
app.use('/api/home', homeRoutes)
app.use('/api/goods', goodsRoutes)
app.use('/api/cart', cartRoutes)
app.use('/api/user', userRoutes)
app.use('/api/order', orderRoutes)

// 404
app.use((req, res) => res.fail(`接口不存在: ${req.method} ${req.url}`, 404))

// 错误处理
app.use((err, req, res, next) => {
  console.error('[ERROR]', err.message)
  res.fail(err.message || '服务器内部错误', 500)
})

app.listen(PORT, () => {
  console.log(`\n  后端服务已启动: http://localhost:${PORT}`)
  console.log(`  MySQL: 127.0.0.1:3308 / shop\n`)
})
