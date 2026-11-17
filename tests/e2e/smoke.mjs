// 易购商城 - 接口冒烟测试脚本
// 运行: node tests/e2e/smoke.mjs
// 产出: tests/e2e/test-report.json
import http from 'http'
import fs from 'fs'
import path from 'path'
import { fileURLToPath } from 'url'

const __dirname = path.dirname(fileURLToPath(import.meta.url))
const BASE = 'http://localhost:3000'

function request(method, url, body, token) {
  return new Promise((resolve) => {
    const urlObj = new URL(url)
    const headers = { 'Content-Type': 'application/json' }
    if (token) headers['Authorization'] = `Bearer ${token}`
    const req = http.request({
      hostname: urlObj.hostname,
      port: urlObj.port,
      path: urlObj.pathname + urlObj.search,
      method, headers
    }, (res) => {
      let data = ''
      res.on('data', c => data += c)
      res.on('end', () => {
        try { resolve({ status: res.statusCode, json: JSON.parse(data), raw: data }) }
        catch { resolve({ status: res.statusCode, json: null, raw: data }) }
      })
    })
    req.on('error', (e) => resolve({ status: 0, json: null, raw: e.message, error: true }))
    if (body) req.write(typeof body === 'string' ? body : JSON.stringify(body))
    req.end()
  })
}

// { name, method, url, body, token, expectCode, note }
const cases = []

// === 用户模块 (9) ===
cases.push({ n: 'U1-正常登录', m: 'POST', u: '/api/user/login', b: { username: 'test', password: '123456' }, e: 0 })
cases.push({ n: 'U2-密码错误', m: 'POST', u: '/api/user/login', b: { username: 'test', password: '12345' }, e: 401 })
cases.push({ n: 'U3-用户不存在', m: 'POST', u: '/api/user/login', b: { username: 'nobody', password: '123456' }, e: 401 })
cases.push({ n: 'U4-空用户名', m: 'POST', u: '/api/user/login', b: { username: '', password: '123456' }, e: 401 })
cases.push({ n: 'U5-空密码', m: 'POST', u: '/api/user/login', b: { username: 'test', password: '' }, e: 401 })
cases.push({ n: 'U6-注册新用户', m: 'POST', u: '/api/user/register', b: { username: `autotest_${Date.now()}`, password: '123456' }, e: 0 })
cases.push({ n: 'U7-重复用户名', m: 'POST', u: '/api/user/register', b: { username: 'test', password: '123456' }, e: 400 })
cases.push({ n: 'U8-获取用户信息(带token)', m: 'GET', u: '/api/user/info', e: 0, needToken: true })
cases.push({ n: 'U9-无token访问info', m: 'GET', u: '/api/user/info', e: 401 })

// === 商品模块 (11) ===
cases.push({ n: 'G1-首页聚合', m: 'GET', u: '/api/home', e: 0 })
cases.push({ n: 'G2-分类筛选categoryId=1', m: 'GET', u: '/api/goods?categoryId=1', e: 0 })
cases.push({ n: 'G3-空分类categoryId=999', m: 'GET', u: '/api/goods?categoryId=999', e: 0 })
cases.push({ n: 'G4-关键词搜索手机', m: 'GET', u: '/api/goods?keyword=手机', e: 0 })
cases.push({ n: 'G5-空关键词', m: 'GET', u: '/api/goods?keyword=', e: 0 })
cases.push({ n: 'G6-分页page=2pageSize=5', m: 'GET', u: '/api/goods?page=2&pageSize=5', e: 0 })
cases.push({ n: 'G7-边界页码page=-1', m: 'GET', u: '/api/goods?page=-1', e: 0 })
cases.push({ n: 'G7b-边界页码page=9999', m: 'GET', u: '/api/goods?page=9999', e: 0 })
cases.push({ n: 'G8-商品详情id=101', m: 'GET', u: '/api/goods/101', e: 0 })
cases.push({ n: 'G9-不存在商品id=9999', m: 'GET', u: '/api/goods/9999', e: 404 })
cases.push({ n: 'G10-非数字id=abc', m: 'GET', u: '/api/goods/abc', e: 400 })
cases.push({ n: 'G11-SQL注入尝试id=1OR1=1', m: 'GET', u: '/api/goods/1%20OR%201=1', e: 400 })

// === 购物车模块 (8) ===
cases.push({ n: 'C1-正常加购goodsId=101', m: 'POST', u: '/api/cart', b: { goodsId: 101, quantity: 2 }, e: 0, needToken: true })
cases.push({ n: 'C2-不存在商品加购goodsId=9999', m: 'POST', u: '/api/cart', b: { goodsId: 9999, quantity: 1 }, e: 0, needToken: true })
cases.push({ n: 'C3-数量边界quantity=0', m: 'POST', u: '/api/cart', b: { goodsId: 101, quantity: 0 }, e: 0, needToken: true })
cases.push({ n: 'C4-查看购物车', m: 'GET', u: '/api/cart', e: 0, needToken: true })
cases.push({ n: 'C5-修改数量cartId=1', m: 'PUT', u: '/api/cart/1', b: { quantity: 5 }, e: 0, needToken: true })
cases.push({ n: 'C6-全选selectAll', m: 'PUT', u: '/api/cart/select/all', b: { selected: true }, e: 0, needToken: true })
cases.push({ n: 'C7-取消全选', m: 'PUT', u: '/api/cart/select/all', b: { selected: false }, e: 0, needToken: true })
cases.push({ n: 'C8-未登录加购', m: 'POST', u: '/api/cart', b: { goodsId: 101, quantity: 1 }, e: 401 })

// === 订单模块 (6) ===
// 下单前必须先选中购物车商品，加前置步骤
cases.push({ n: 'O0-前置:全选购物车商品', m: 'PUT', u: '/api/cart/select/all', b: { selected: true }, e: 0, needToken: true })
cases.push({ n: 'O1-正常下单', m: 'POST', u: '/api/order', e: 0, needToken: true })
cases.push({ n: 'O2-空购物车再下单(预期失败)', m: 'POST', u: '/api/order', e: 400, needToken: true })
cases.push({ n: 'O3-未登录下单', m: 'POST', u: '/api/order', e: 401 })
cases.push({ n: 'O4-查看订单列表', m: 'GET', u: '/api/order', e: 0, needToken: true })

const results = []
let token = null

async function run() {
  console.log('🚀 易购商城接口冒烟测试')
  console.log('='.repeat(60))

  // 先登录拿 token
  const loginRes = await request('POST', `${BASE}/api/user/login`, { username: 'test', password: '123456' })
  if (loginRes.json && loginRes.json.data) {
    token = loginRes.json.data.token
    console.log(`✅ 登录成功 token=${token}`)
  } else {
    console.log('❌ 登录失败，终止测试')
    process.exit(1)
  }
  console.log()

  for (const c of cases) {
    const res = await request(c.m, `${BASE}${c.u}`, c.b, c.needToken ? token : null)
    const actual = res.json ? res.json.code : null
    const pass = (actual === c.e)
    results.push({
      name: c.n, method: c.m, url: c.u,
      expect: c.e, actual, status: res.status, pass,
      message: res.json ? res.json.message : res.raw?.slice(0, 100)
    })
    const icon = pass ? '✅' : '❌'
    console.log(`${icon} ${c.n.padEnd(30)} expect=${c.e} actual=${actual} HTTP=${res.status}`)
    if (!pass && res.json) console.log(`   msg: ${res.json.message}`)
  }

  const passCount = results.filter(r => r.pass).length
  const total = results.length
  console.log()
  console.log('='.repeat(60))
  console.log(`📊 测试结果: ${passCount}/${total} 通过 (${(passCount/total*100).toFixed(1)}%)`)
  
  // 输出失败列表
  const fails = results.filter(r => !r.pass)
  if (fails.length) {
    console.log(`\n❌ 失败用例 (${fails.length}):`)
    fails.forEach(f => console.log(`  - ${f.name}: 期望code=${f.expect} 实际code=${f.actual} (HTTP ${f.status})`))
  }

  // 写入报告
  const reportPath = path.join(__dirname, 'test-report.json')
  fs.writeFileSync(reportPath, JSON.stringify({
    summary: { total, pass: passCount, fail: fails.length, rate: `${(passCount/total*100).toFixed(1)}%` },
    generatedAt: new Date().toISOString(),
    results
  }, null, 2), 'utf-8')
  console.log(`\n📄 报告已写入: ${reportPath}`)
}

run().catch(console.error)
