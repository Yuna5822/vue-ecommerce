-- 电商项目数据库初始化脚本
-- MySQL 5.7，端口 3308

DROP DATABASE IF EXISTS shop;
CREATE DATABASE shop DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;
USE shop;

-- 轮播图
CREATE TABLE banners (
  id INT PRIMARY KEY AUTO_INCREMENT,
  img VARCHAR(255) NOT NULL,
  title VARCHAR(100) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

-- 商品分类（icon 存 iconfont class 数组的 JSON 字符串）
CREATE TABLE categories (
  id INT PRIMARY KEY,
  name VARCHAR(50) NOT NULL,
  icon TEXT NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

-- 商品表
CREATE TABLE goods (
  id INT PRIMARY KEY,
  categoryId INT NOT NULL,
  title VARCHAR(200) NOT NULL,
  price DECIMAL(10,2) NOT NULL,
  originalPrice DECIMAL(10,2) NOT NULL,
  sales INT NOT NULL DEFAULT 0,
  img VARCHAR(255) NOT NULL,
  tags JSON,
  detailImages JSON,
  skus JSON,
  description TEXT,
  INDEX idx_category (categoryId),
  INDEX idx_title (title)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

-- 用户表
CREATE TABLE users (
  id INT PRIMARY KEY AUTO_INCREMENT,
  username VARCHAR(50) NOT NULL UNIQUE,
  password VARCHAR(100) NOT NULL,
  nickname VARCHAR(50),
  avatar VARCHAR(255),
  createdAt DATETIME DEFAULT CURRENT_TIMESTAMP
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

-- 购物车表
CREATE TABLE cart (
  id INT PRIMARY KEY AUTO_INCREMENT,
  userId INT NOT NULL,
  goodsId INT NOT NULL,
  quantity INT NOT NULL DEFAULT 1,
  selected TINYINT NOT NULL DEFAULT 1,
  createdAt DATETIME DEFAULT CURRENT_TIMESTAMP,
  UNIQUE KEY uk_user_goods (userId, goodsId),
  INDEX idx_user (userId)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

-- 订单表
CREATE TABLE orders (
  id INT PRIMARY KEY AUTO_INCREMENT,
  userId INT NOT NULL,
  goodsId INT NOT NULL,
  quantity INT NOT NULL DEFAULT 1,
  price DECIMAL(10,2) NOT NULL,
  status TINYINT NOT NULL DEFAULT 0 COMMENT '0待支付 1已支付 2已发货 3已完成',
  createdAt DATETIME DEFAULT CURRENT_TIMESTAMP,
  INDEX idx_user (userId)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

-- ===== 种子数据 =====
INSERT INTO banners (id, img, title) VALUES
(1, '/images/banners/banner1.png', '数码狂欢节'),
(2, '/images/banners/banner2.png', '秋冬新装上市'),
(3, '/images/banners/banner3.png', '生鲜特惠日');

INSERT INTO categories (id, name, icon) VALUES
(1, '手机数码', '["iconfont","icon-shumashouji"]'),
(2, '服装鞋包', '["iconfont","icon-clothes"]'),
(3, '美妆个护', '["iconfont","icon-meizhuang"]'),
(4, '食品生鲜', '["iconfont","icon-shipin-shengxian-xia"]'),
(5, '家居家纺', '["iconfont","icon-jiajujiafang"]'),
(6, '家用电器', '["iconfont","icon-jiayongdianqi"]'),
(7, '母婴玩具', '["iconfont","icon-muyingwanju"]'),
(8, '运动户外', '["iconfont","icon-yundonghuwai"]');

INSERT INTO goods (id, categoryId, title, price, originalPrice, sales, img, tags, detailImages, skus, description) VALUES
(101, 1, '华为 Mate 70 Pro 智能手机 12GB+512GB 曜石黑', 6499, 6999, 2300, '/images/goods/goods101.png', '["新品","包邮"]', '["/images/goods/goods101.png"]', '["默认款","升级款","豪华款"]', '正品保障 · 七天无理由退换 · 极速发货。'),
(102, 1, '小米平板 7 英寸高刷屏平板电脑 8GB+256GB', 1999, 2299, 5600, '/images/goods/goods102.png', '["热卖"]', '["/images/goods/goods102.png"]', '["默认款","升级款"]', '正品保障 · 七天无理由退换 · 极速发货。'),
(103, 1, '无线蓝牙降噪耳机 超长续航 运动防水', 299, 499, 12000, '/images/goods/goods103.png', '["包邮"]', '["/images/goods/goods103.png"]', '["黑色","白色"]', '正品保障 · 七天无理由退换 · 极速发货。'),
(104, 1, '智能手表 心率血氧监测 1.85英寸大屏', 399, 599, 8900, '/images/goods/goods104.png', '[]', '["/images/goods/goods104.png"]', '["黑色","银色"]', '正品保障 · 七天无理由退换 · 极速发货。'),
(201, 2, '冬季新款加绒连帽卫衣 男女同款宽松版型', 129, 259, 31000, '/images/goods/goods201.png', '["新品"]', '["/images/goods/goods201.png"]', '["S","M","L","XL"]', '正品保障 · 七天无理由退换 · 极速发货。'),
(202, 2, '轻便跑步鞋 透气网面减震运动鞋', 199, 399, 15000, '/images/goods/goods202.png', '["热卖"]', '["/images/goods/goods202.png"]', '["39","40","41","42","43"]', '正品保障 · 七天无理由退换 · 极速发货。'),
(203, 2, '简约通勤双肩包 大容量防水电脑背包', 159, 299, 6700, '/images/goods/goods203.png', '[]', '["/images/goods/goods203.png"]', '["黑色","灰色"]', '正品保障 · 七天无理由退换 · 极速发货。'),
(301, 3, '保湿修护面霜 玻尿酸深层补水 50g', 89, 169, 25000, '/images/goods/goods301.png', '["热卖"]', '["/images/goods/goods301.png"]', '["50g"]', '正品保障 · 七天无理由退换 · 极速发货。'),
(302, 3, '丝绒哑光口红 持久显色不易脱妆', 69, 129, 18000, '/images/goods/goods302.png', '["包邮"]', '["/images/goods/goods302.png"]', '["正红色","豆沙色","枫叶色"]', '正品保障 · 七天无理由退换 · 极速发货。'),
(401, 4, '赣南脐橙 新鲜水果 5斤装 产地直发', 39.9, 59.9, 42000, '/images/goods/goods401.png', '["生鲜"]', '["/images/goods/goods401.png"]', '["5斤装","10斤装"]', '正品保障 · 七天无理由退换 · 极速发货。'),
(402, 4, '每日坚果混合装 30包 孕妇儿童零食', 79, 119, 9800, '/images/goods/goods402.png', '[]', '["/images/goods/goods402.png"]', '["30包"]', '正品保障 · 七天无理由退换 · 极速发货。'),
(403, 4, '精品冷萃咖啡液 0蔗糖 即溶黑咖啡 12条', 45, 69, 7600, '/images/goods/goods403.png', '["新品"]', '["/images/goods/goods403.png"]', '["12条","24条"]', '正品保障 · 七天无理由退换 · 极速发货。'),
(501, 5, '全棉四件套 简约北欧风床品 1.8m床适用', 219, 399, 4300, '/images/goods/goods501.png', '[]', '["/images/goods/goods501.png"]', '["1.5m","1.8m"]', '正品保障 · 七天无理由退换 · 极速发货。'),
(502, 5, '乳胶枕头 护颈椎助睡眠 单人枕芯', 99, 199, 11000, '/images/goods/goods502.png', '["热卖"]', '["/images/goods/goods502.png"]', '["单人"]', '正品保障 · 七天无理由退换 · 极速发货。'),
(601, 6, '变频滚筒洗衣机 10公斤 一级能效', 1899, 2399, 2100, '/images/goods/goods601.png', '["包邮"]', '["/images/goods/goods601.png"]', '["10公斤"]', '正品保障 · 七天无理由退换 · 极速发货。'),
(602, 6, '空气炸锅 5L大容量 无油低脂炸烤', 269, 399, 19000, '/images/goods/goods602.png', '["热卖"]', '["/images/goods/goods602.png"]', '["5L"]', '正品保障 · 七天无理由退换 · 极速发货。'),
(701, 7, '婴儿纸尿裤 超薄透气 L码 68片装', 89, 139, 27000, '/images/goods/goods701.png', '[]', '["/images/goods/goods701.png"]', '["M","L","XL"]', '正品保障 · 七天无理由退换 · 极速发货。'),
(702, 7, '儿童积木拼装玩具 益智大颗粒 120粒', 79, 129, 8500, '/images/goods/goods702.png', '["新品"]', '["/images/goods/goods702.png"]', '["120粒"]', '正品保障 · 七天无理由退换 · 极速发货。'),
(801, 8, '瑜伽垫 加厚防滑 TPE材质 健身垫', 49, 99, 14000, '/images/goods/goods801.png', '[]', '["/images/goods/goods801.png"]', '["6mm","10mm"]', '正品保障 · 七天无理由退换 · 极速发货。'),
(802, 8, '户外登山包 40L 防泼水徒步旅行背包', 189, 329, 3900, '/images/goods/goods802.png', '["热卖"]', '["/images/goods/goods802.png"]', '["40L"]', '正品保障 · 七天无理由退换 · 极速发货。');

-- 测试用户（密码明文：123456，演示用）
INSERT INTO users (username, password, nickname, avatar) VALUES
('test', '123456', '测试用户', '');
