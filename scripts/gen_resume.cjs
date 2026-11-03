const fs = require('fs');
const {
  Document, Packer, Paragraph, TextRun, Table, TableRow, TableCell,
  AlignmentType, BorderStyle, WidthType, LevelFormat, PageNumber, Header, Footer
} = require('docx');

const FONT = { ascii: 'Microsoft YaHei', hAnsi: 'Microsoft YaHei', eastAsia: 'Microsoft YaHei' };
const border = { style: BorderStyle.SINGLE, size: 1, color: 'CCCCCC' };
const borders = { top: border, bottom: border, left: border, right: border };
const BLUE = '2E5CB8';
const SIZE = 22;

function txt(text, opts = {}) {
  return new TextRun({ text, font: FONT, size: SIZE, ...opts });
}
function p(text, opts = {}) {
  return new Paragraph({ spacing: { after: 80, line: 360 }, ...opts, children: [txt(text)] });
}
function h1(text) {
  return new Paragraph({
    spacing: { before: 360, after: 120 },
    border: { bottom: { style: BorderStyle.SINGLE, size: 6, color: BLUE } },
    children: [txt(text, { size: 28, bold: true, color: BLUE })]
  });
}
function bullet(text) {
  return new Paragraph({
    numbering: { reference: 'bullets', level: 0 },
    spacing: { after: 40, line: 340 },
    children: [txt(text)]
  });
}
function cell(text, w, center = false) {
  return new TableCell({
    borders,
    width: { size: w, type: WidthType.DXA },
    margins: { top: 60, bottom: 60, left: 100, right: 100 },
    children: [new Paragraph({
      alignment: center ? AlignmentType.CENTER : AlignmentType.LEFT,
      spacing: { after: 0 },
      children: [txt(text)]
    })]
  });
}
function row(cells) {
  return new TableRow({ cantSplit: true, children: cells });
}

// ===== 个人信息表格 =====
const infoTable = new Table({
  width: { size: 100, type: WidthType.PERCENTAGE },
  columnWidths: [1800, 3700, 1800, 3726],
  rows: [
    row([cell('姓    名', 1800, true), cell('李晓涵', 3700), cell('学    号', 1800, true), cell('20231119148', 3726)]),
    row([cell('学    院', 1800, true), cell('信息科学与工程学院', 3700), cell('专    业', 1800, true), cell('计算机科学与技术(华为云)', 3726)]),
    row([cell('班    级', 1800, true), cell('2304 班', 3700), cell('指导教师', 1800, true), cell('何苗', 3726)])
  ]
});

const doc = new Document({
  numbering: {
    config: [{
      reference: 'bullets',
      levels: [{
        level: 0, format: LevelFormat.BULLET, text: '\u2022', alignment: AlignmentType.LEFT,
        style: { paragraph: { indent: { left: 480, hanging: 240 } } }
      }]
    }]
  },
  sections: [{
    properties: {
      page: {
        size: { width: 11906, height: 16838 },
        margin: { top: 1440, right: 1440, bottom: 1440, left: 1440 }
      }
    },
    headers: { default: new Header({ children: [new Paragraph({ alignment: AlignmentType.RIGHT, children: [txt('李晓涵 - 前端开发求职简历', { size: 18, color: '888888' })] })] }) },
    footers: { default: new Footer({ children: [new Paragraph({ alignment: AlignmentType.CENTER, children: [txt('第 ', { size: 18 }), new TextRun({ children: [PageNumber.CURRENT], font: FONT, size: 18 }), txt(' 页', { size: 18 })] })] }) },
    children: [

      // 标题
      new Paragraph({ alignment: AlignmentType.CENTER, spacing: { after: 100 },
        children: [txt('李  晓  涵', { size: 48, bold: true, color: BLUE })] }),
      new Paragraph({ alignment: AlignmentType.CENTER, spacing: { after: 300 },
        children: [txt('前端开发工程师  |  计算机科学与技术（华为云）', { size: 22, color: '555555' })] }),

      // 个人信息表
      infoTable,
      new Paragraph({ spacing: { before: 120, after: 200 }, children: [
        txt('求职意向：', { bold: true }), txt('前端开发工程师 / Web 前端实习生      '),
        txt('电子邮箱：', { bold: true }), txt('lixiaohan@example.com      '),
        txt('所在城市：', { bold: true }), txt('武汉')
      ] }),

      h1('一、教育背景'),
      new Paragraph({ spacing: { after: 40 }, children: [
        txt('计算机科学与技术（华为云）', { bold: true }),
        txt('    信息科学与工程学院    本科在读'),
        new TextRun({ break: 1, font: FONT }),
        txt('2023.09 \u2014 至今    GPA：3.8/4.0    专业前 15%')
      ] }),
      bullet('主修课程：数据结构、操作系统、计算机网络、数据库原理、软件工程、Web 前端开发'),
      bullet('在校经历：班级学习委员，组织多场技术分享活动；参与华为云认证课程学习'),

      h1('二、专业技能'),
      new Paragraph({ spacing: { after: 40 }, children: [txt('前端核心：', { bold: true })] }),
      bullet('熟练使用 HTML5 / CSS3 / JavaScript（ES6+），理解 DOM / BOM / 事件循环 / 原型链等底层概念'),
      bullet('熟练使用 Vue 3 组合式 API（setup / reactive / computed / watch）、Vue Router 4 路由管理'),
      bullet('熟练使用 Element Plus 组件库，能独立完成主题定制与样式覆盖'),
      bullet('掌握 Less 预处理器，能运用变量、嵌套、Mixin、媒体查询管理复杂样式'),

      new Paragraph({ spacing: { before: 160, after: 40 }, children: [txt('工程化与工具：', { bold: true })] }),
      bullet('熟练使用 Vite 构建工具，理解模块解析、HMR、代码分割与打包优化'),
      bullet('掌握 Axios 二次封装，熟悉拦截器、统一错误处理、请求/响应适配'),
      bullet('熟练使用 iconfont 图标库（font-class 模式），能按项目规范管理图标资源'),
      bullet('掌握 Git 版本控制，熟悉分支管理、代码提交规范'),

      new Paragraph({ spacing: { before: 160, after: 40 }, children: [txt('移动适配与响应式：', { bold: true })] }),
      bullet('掌握 rem + 动态根字体方案，能基于设计稿完成 750 适配'),
      bullet('熟练使用 CSS 媒体查询，完成 PC / 平板 / 手机多端响应式布局'),
      bullet('熟悉 viewport 配置、safe-area 安全区适配，处理刘海屏 / 底部手势条兼容'),

      new Paragraph({ spacing: { before: 160, after: 40 }, children: [txt('后端与其他：', { bold: true })] }),
      bullet('了解 HTTP / HTTPS 协议、RESTful API 设计、跨域（CORS）解决方案'),
      bullet('了解 Node.js 基础，能使用 Express 搭建简单 Mock 服务'),
      bullet('了解 MySQL 基础增删改查，能编写简单 SQL 语句'),

      h1('三、项目经历 \u2014— 粉色主题电商 Web 应用'),
      new Paragraph({ spacing: { after: 60 }, children: [
        txt('项目角色：', { bold: true }), txt('独立开发      '),
        txt('技术栈：', { bold: true }), txt('Vue 3 + Vite + Element Plus + Less + Axios + iconfont'),
        new TextRun({ break: 1, font: FONT }),
        txt('项目周期：', { bold: true }), txt('2026.10 \u2014 2026.11'),
        new TextRun({ break: 1, font: FONT }),
        txt('项目描述：', { bold: true }), txt('面向移动端优先的多端电商前端应用，涵盖首页、分类、商品详情、购物车、个人中心 5 大页面，支持商品浏览、规格选择、加购结算、本地持久化购物车等完整电商流程。')
      ] }),

      new Paragraph({ spacing: { before: 160, after: 60 }, children: [txt('核心职责与技术亮点：', { bold: true })] }),
      bullet('完成项目工程化搭建：基于 Vite 创建 Vue 3 项目，配置自动导入、Less 全局变量注入、Element Plus 按需引入，项目冷启动时间 < 2s'),
      bullet('实现移动端优先的响应式适配：通过动态 rem（750 设计稿基准）+ 媒体查询断点（mobile 375 / tablet 768 / pc 1200），同一套代码覆盖手机、平板、PC 三端，PC 端布局根据屏幕宽度自动切换导航形态'),
      bullet('设计并封装 Axios 请求层：统一请求拦截（Token 注入）、响应拦截（业务码判断、错误提示）、自定义 adapter 接入本地 Mock 数据，切换真实后端仅需替换 adapter，业务层零改动'),
      bullet('实现购物车模块：基于 Vue reactive + localStorage 实现轻量全局状态管理，支持数量修改、勾选结算、合计计算、图片路径自动迁移，刷新/关闭浏览器数据不丢失'),
      bullet('完成 Element Plus 主题定制：通过 CSS 变量覆盖 + Less 全局变量双轨方案，将默认蓝色主题一键切换为粉色系（hotpink #ff69b4），涉及按钮、标签、导航、表单等 20+ 组件的视觉统一'),
      bullet('集成 iconfont 图标库：采用 font-class 模式管理 20+ 业务图标（首页、分类、购物车、我的等），实现图标与文字解耦的样式方案，便于后续替换/扩展'),
      bullet('优化图片资源加载：建立本地图片资源管理规范（banner / category / goods 分层存储、goods{id}.png 命名约定），配合 Vite 静态资源自动拷贝，支持开发阶段 HMR 热更新与生产打包优化'),

      h1('四、自我评价'),
      bullet('对前端技术有持续兴趣，喜欢动手做项目，遇到问题愿意主动查文档、读源码、写 Demo 验证'),
      bullet('编码习惯良好：组件拆分合理、样式可维护、命名规范，注重代码可读性与可扩展性'),
      bullet('学习能力强，能快速上手新技术；关注社区动态，持续学习 Vue 3 生态与前端工程化实践'),
      bullet('具备良好的沟通与团队协作意识，在校期间担任学习委员，组织过多场技术分享活动'),

      h1('五、致谢'),
      p('感谢指导教师何苗老师在项目设计与实现过程中的悉心指导，感谢学院提供的学习环境与资源。'),

      h1('附录：项目目录结构'),
      new Paragraph({ spacing: { after: 0 }, children: [txt('src/', { bold: true })] }),
      new Paragraph({ spacing: { after: 0 }, children: [txt('\u251c\u2500 api/           request.js（Axios 封装）+ mock.js（模拟后端数据）')] }),
      new Paragraph({ spacing: { after: 0 }, children: [txt('\u251c\u2500 components/    NavBar / TabBar / GoodsCard（可复用组件）')] }),
      new Paragraph({ spacing: { after: 0 }, children: [txt('\u251c\u2500 router/        hash 路由，5 个页面懒加载')] }),
      new Paragraph({ spacing: { after: 0 }, children: [txt('\u251c\u2500 store/         cart.js（购物车全局状态 + localStorage 持久化）')] }),
      new Paragraph({ spacing: { after: 0 }, children: [txt('\u251c\u2500 styles/        Less 全局变量 / 媒体查询断点 / iconfont 字体')] }),
      new Paragraph({ spacing: { after: 0 }, children: [txt('\u251c\u2500 utils/         rem.js（动态 rem 适配）')] }),
      new Paragraph({ spacing: { after: 0 }, children: [txt('\u2514\u2500 views/         HomeView / CategoryView / DetailView / CartView / ProfileView')] })

    ]
  }]
});

Packer.toBuffer(doc).then((buffer) => {
  const out = 'e:/dev/WebProjects/电商project/求职简历-李晓涵.docx';
  fs.writeFileSync(out, buffer);
  console.log('简历已生成：', out);
});
