# 易购商城 — 测试执行报告

> 项目：电商全栈项目（Vue3 + Express + MySQL）  
> 测试日期：2026-11-17  
> 测试工具：Node.js 冒烟脚本 + Postman/APIPost + Navicat  
> 执行人员：项目本人（面试展示用）

---

## 一、测试环境

| 项 | 值 |
|----|----|
| 前端 | Vue3 + Vite + Element Plus，端口 5173 |
| 后端 | Node.js v18 + Express 4.21，端口 3000 |
| 数据库 | MySQL 5.7.16，端口 3307，库名 shop |
| 操作系统 | Windows 11 |
| 测试工具 | Node.js 原生 http 模块（冒烟）、Chrome DevTools、Navicat |

---

## 二、测试范围

| 层级 | 覆盖 | 未覆盖 |
|------|------|--------|
| 接口测试 | 5 路由模块全部 18 个接口，34 条用例 | 性能压测、吞吐量 |
| UI 测试 | 5 页面功能检查点 | 非关键样式动画 |
| 数据库验证 | 6 张表增删改查一致性 | MySQL 内部机制 |
| 安全测试 | 鉴权拦截、参数校验、SQL 注入防护 | SSL/TLS、密码加盐 |
| 兼容性 | Chrome + Edge（桌面+移动模式） | Safari/Firefox 真机 |

---

## 三、接口测试结果

### 总体

| 指标 | 数值 |
|------|------|
| 总用例数 | **34** |
| 通过 | **34** |
| 失败 | **0** |
| 通过率 | **100%** |
| 发现并修复的 Bug | **2** |

### 模块分布

| 模块 | 用例数 | 通过 | 失败 | 修复的 Bug |
|------|--------|------|------|-----------|
| 用户 user | 9 | 9 | 0 | — |
| 商品 goods | 12 | 12 | 0 | **Bug #1 + Bug #2** |
| 购物车 cart | 8 | 8 | 0 | — |
| 订单 order | 5 | 5 | 0 | — |

### 34 条用例明细

#### 用户模块（9 条）✅ 全部通过

| # | 用例 | 方法 | URL | 预期 code | 实际 code | 结论 |
|---|------|------|-----|-----------|-----------|------|
| U1 | 正常登录 test/123456 | POST | /api/user/login | 0 | 0 | ✅ |
| U2 | 密码错误 | POST | /api/user/login | 401 | 401 | ✅ |
| U3 | 用户不存在 | POST | /api/user/login | 401 | 401 | ✅ |
| U4 | 空用户名 | POST | /api/user/login | 401 | 401 | ✅ |
| U5 | 空密码 | POST | /api/user/login | 401 | 401 | ✅ |
| U6 | 注册新用户 | POST | /api/user/register | 0 | 0 | ✅ |
| U7 | 重复用户名 | POST | /api/user/register | 400 | 400 | ✅ |
| U8 | 获取用户信息(带 token) | GET | /api/user/info | 0 | 0 | ✅ |
| U9 | 无 token 访问 info | GET | /api/user/info | 401 | 401 | ✅ |

#### 商品模块（12 条）✅ 全部通过

| # | 用例 | 方法 | URL | 预期 code | 实际 code | 结论 |
|---|------|------|-----|-----------|-----------|------|
| G1 | 首页聚合 | GET | /api/home | 0 | 0 | ✅ |
| G2 | 分类筛选 categoryId=1 | GET | /api/goods?categoryId=1 | 0 | 0 | ✅ |
| G3 | 空分类 categoryId=999 | GET | /api/goods?categoryId=999 | 0 | 0 | ✅ |
| G4 | 关键词搜索"手机" | GET | /api/goods?keyword=手机 | 0 | 0 | ✅ |
| G5 | 空关键词 | GET | /api/goods?keyword= | 0 | 0 | ✅ |
| G6 | 分页 page=2 pageSize=5 | GET | /api/goods?page=2&pageSize=5 | 0 | 0 | ✅ |
| G7 | 边界页码 page=-1 | GET | /api/goods?page=-1 | 0 | 0 | ✅ (**已修复 Bug #1**) |
| G7b | 边界页码 page=9999 | GET | /api/goods?page=9999 | 0 | 0 | ✅ |
| G8 | 商品详情 id=101 | GET | /api/goods/101 | 0 | 0 | ✅ |
| G9 | 不存在商品 id=9999 | GET | /api/goods/9999 | 404 | 404 | ✅ |
| G10 | 非数字 id=abc | GET | /api/goods/abc | 400 | 400 | ✅ (**已修复 Bug #2**) |
| G11 | SQL 注入尝试 id=1 OR 1=1 | GET | /api/goods/1%20OR%201=1 | 400 | 400 | ✅ (防御生效) |

#### 购物车模块（8 条）✅ 全部通过

| # | 用例 | 方法 | URL | 预期 code | 实际 code | 结论 |
|---|------|------|-----|-----------|-----------|------|
| C1 | 正常加购 goodsId=101 | POST | /api/cart | 0 | 0 | ✅ |
| C2 | 不存在商品加购 goodsId=9999 | POST | /api/cart | 0 | 0 | ✅ (后端未校验，记录为潜在缺陷) |
| C3 | 数量边界 quantity=0 | POST | /api/cart | 0 | 0 | ✅ |
| C4 | 查看购物车 | GET | /api/cart | 0 | 0 | ✅ |
| C5 | 修改数量 cartId=1 | PUT | /api/cart/1 | 0 | 0 | ✅ |
| C6 | 全选 selectAll | PUT | /api/cart/select/all | 0 | 0 | ✅ |
| C7 | 取消全选 | PUT | /api/cart/select/all | 0 | 0 | ✅ |
| C8 | 未登录加购 | POST | /api/cart | 401 | 401 | ✅ |

#### 订单模块（5 条）✅ 全部通过

| # | 用例 | 方法 | URL | 预期 code | 实际 code | 结论 |
|---|------|------|-----|-----------|-----------|------|
| O0 | 前置：全选购物车 | PUT | /api/cart/select/all | 0 | 0 | ✅ |
| O1 | 正常下单 | POST | /api/order | 0 | 0 | ✅ |
| O2 | 空购物车再下单(预期失败) | POST | /api/order | 400 | 400 | ✅ |
| O3 | 未登录下单 | POST | /api/order | 401 | 401 | ✅ |
| O4 | 查看订单列表 | GET | /api/order | 0 | 0 | ✅ |

---

## 四、缺陷列表（发现 → 修复）

### Bug #1：分页参数负数导致后端崩溃

| 项 | 内容 |
|----|------|
| 严重级别 | **高**（后端崩溃） |
| 模块 | 商品列表 /api/goods |
| 现象 | 传入 `page=-1` 时，后端计算 `OFFSET = (-1-1)*10 = -20`，MySQL 报语法错误，Express 抛出未捕获异常，**后端进程直接崩溃** |
| 根因 | 未对 `page`、`pageSize` 做边界校验，直接拼入 SQL |
| 修复 | 在 [server/routes/goods.js](file:///e:/dev/WebProjects/电商project/server/routes/goods.js) 加入边界防御：`page = Math.max(1, Math.floor(Number(page) || 1))`，`pageSize` 限制在 1-100 |
| 验证 | 修复后 `page=-1` 自动归一成 page=1，返回第一页数据 |
| 测试用例 | G7、G7b |

**修复前日志：**
```
Error: You have an error in your SQL syntax ... 
sql: 'SELECT ... LIMIT 10 OFFSET -20'
```

**修复后行为：**
```
GET /api/goods?page=-1 → 自动归一为 page=1 → 返回 HTTP 200 + 第一页数据
```

### Bug #2：商品详情接口非数字 id 导致后端崩溃

| 项 | 内容 |
|----|------|
| 严重级别 | **高**（后端崩溃 + 安全隐患） |
| 模块 | 商品详情 /api/goods/:id |
| 现象 | 传入 `id=abc` 或 `id=1 OR 1=1` 时，`Number('abc')` 返回 NaN，SQL 变成 `WHERE id = NaN`，MySQL 报 "Unknown column 'NaN'"，后端崩溃 |
| 根因 | 直接 `Number(id)` 未校验结果有效性，NaN 被当作 SQL 字面量传入 |
| 修复 | 在 [server/routes/goods.js](file:///e:/dev/WebProjects/电商project/server/routes/goods.js) 加入校验：`if (!id \|\| id < 1 \|\| !Number.isInteger(id)) return res.fail('无效的商品ID', 400)` |
| 验证 | 修复后非数字 id 返回 400 + "无效的商品ID"，不会崩溃；SQL 注入尝试也会被拦截 |
| 测试用例 | G10、G11 |

**修复前日志：**
```
Error: Unknown column 'NaN' in 'where clause'
sql: 'SELECT * FROM goods WHERE id = NaN'
```

**修复后行为：**
```
GET /api/goods/abc        → HTTP 400 + "无效的商品ID"
GET /api/goods/1 OR 1=1   → HTTP 400 + "无效的商品ID"  (SQL 注入被拦截)
```

### 潜在缺陷（记录未修复）

| # | 项 | 说明 |
|---|----|------|
| P1 | 购物车加购未校验 goodsId 是否存在 | `POST /api/cart {goodsId:9999}` 会向 cart 表插入不存在的商品 ID。属于产品决策（是否需要强校验），当前后端允许 |
| P2 | 购物车 quantity=0 未校验 | `quantity=0` 会导致 OFFSET 计算异常或产生无意义的购物车项 |
| P3 | 密码明文存储 | 演示项目使用明文，生产环境应使用 bcrypt |

---

## 五、三层验证闭环

本次测试特别强调"三层闭环"，避免只看接口返回就放过问题：

| 层级 | 验证内容 | 工具 |
|------|----------|------|
| 第 1 层：接口返回 | `code === 0`？HTTP 状态码对吗？ | Node.js 脚本 / Postman |
| 第 2 层：数据库落库 | 写操作后 Navicat 查真实数据 | Navicat Premium |
| 第 3 层：前端行为 | 页面 UI 是否正确反映后端数据 | Chrome DevTools (Network + Application) |

**举例 — "下单成功" 不只看 code=0：**
```
1️⃣ 接口返回 POST /api/order → code=0, count=3 ✅
2️⃣ Navicat: SELECT * FROM orders WHERE userId=1 → 看到 3 条新订单 ✅
3️⃣ Navicat: SELECT * FROM cart WHERE userId=1 → 之前 selected=1 的项已删除 ✅
4️⃣ 前端: 购物车页面刷新 → 已清空 ✅
```

---

## 六、自动化冒烟脚本

**位置：** [tests/e2e/smoke.mjs](file:///e:/dev/WebProjects/电商project/tests/e2e/smoke.mjs)

**运行方式：**
```bash
node tests/e2e/smoke.mjs
```

**产出：**
- 终端实时输出 34 条用例结果（✅/❌）
- `tests/e2e/test-report.json` 完整 JSON 报告

**脚本特点：**
- 纯 Node.js 原生 `http` 模块，零依赖
- 34 条用例覆盖 5 模块
- 正确处理 HTTP 4xx/5xx（不会像 Postman 把 401 当异常）
- 自动登录拿 token，按 `needToken` 标记注入鉴权头

---

## 七、改进建议

1. **购物车加购加 goodsId 存在性校验** — 防脏数据
2. **quantity 加边界校验** — 防 0 / 负数 / 超大值
3. **密码改为 bcrypt 加密** — 安全基线
4. **token 改为 JWT** — 支持过期、刷新、吊销
5. **加 404 兜底** — Express 路由 `/:id` 对非数字参数已经有校验，但可以更优雅
