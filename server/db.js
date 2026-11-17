import mysql from 'mysql2/promise'

// 用户原有 MySQL 实例：端口 3307，root 密码 123456（开发环境）
const pool = mysql.createPool({
  host: '127.0.0.1',
  port: 3307,
  user: 'root',
  password: '123456',
  database: 'shop',
  waitForConnections: true,
  connectionLimit: 10,
  charset: 'utf8mb4'
})

export default pool
