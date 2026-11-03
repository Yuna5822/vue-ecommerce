import { createApp } from 'vue'
import ElementPlus from 'element-plus'
import 'element-plus/dist/index.css'
import zhCn from 'element-plus/es/locale/lang/zh-cn'

import App from './App.vue'
import router from './router'
import './utils/rem' // rem 移动适配
import './styles/global.less'

// iconfont 图标（本地字体文件，已放到 src/styles/iconfont/ 目录）
import './styles/iconfont/iconfont.css'

const app = createApp(App)

app.use(router)
app.use(ElementPlus, { locale: zhCn })

app.mount('#app')
