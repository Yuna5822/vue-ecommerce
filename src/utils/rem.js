/**
 * 移动端 rem 适配方案（类似 flexible）
 * 设计稿宽度 750px，此时 1rem = 100px
 * 例如设计稿上 20px => 代码中写 0.2rem
 */
const DESIGN_WIDTH = 750
const MAX_WIDTH = 750 // PC 端不再放大，配合媒体查询做 PC 布局

function setRem() {
  const html = document.documentElement
  // 取视口宽度，PC 上限制最大按 750 计算
  const clientWidth = Math.min(html.clientWidth, MAX_WIDTH)
  const fontSize = (clientWidth / DESIGN_WIDTH) * 100
  html.style.fontSize = fontSize + 'px'
}

// 初始化
setRem()

// 视口变化时重算（横竖屏切换、窗口缩放）
window.addEventListener('resize', setRem)
window.addEventListener('orientationchange', setRem)

export default setRem
