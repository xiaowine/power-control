# Power Control

一个基于 Vue 3 的电源控制面板项目，用于监控和控制电源设备。

## 功能特性

- 💡 实时监控电压/电流数据
- 🎛️ 精确控制输出参数
- 📊 数据收发历史记录
- 🌓 自适应深色模式
- 📱 响应式布局设计

## 技术栈

- Vue 3
- TypeScript
- Vite
- CSS Variables

## 快速开始

### 安装依赖

```bash
npm install
# 或
yarn install
```

### 开发环境运行

```bash
npm run dev
# 或
yarn dev
```

### 构建产品

```bash
npm run build
# 或
yarn build
```

## 项目结构

```
power-control/
├── src/
│   ├── assets/         # 静态资源
│   ├── components/     # 组件
│   ├── types/         # TypeScript 类型定义
│   ├── utils/         # 工具函数
│   ├── App.vue        # 根组件
│   └── main.ts        # 入口文件
├── public/            # 公共资源
└── package.json       # 项目配置
```

## 主要功能

### 实时监控

- 实时显示输入/输出电压
- 实时显示输入/输出电流
- 监控工作状态和运行模式

### 参数控制

- 精确设置输出电压
- 精确设置输出电流
- 控制开关机状态
- 切换工作模式

### 数据记录

- 记录发送的控制指令
- 记录接收的状态数据
- 支持历史数据查看
- 数据帧自动解析展示

## 开发指南

### 添加新功能

1. 在 `types/` 目录下定义相关接口
2. 在 `components/` 目录下创建新组件
3. 在 `App.vue` 中引入并使用新组件

### 样式主题

项目使用 CSS 变量实现主题定制，主要变量定义在 `App.vue` 中：

```css
:root {
  --primary-color: #4facfe;
  --text-primary: #2c3e50;
  --border-radius: 8px;
  // ...更多变量
}
```

## 贡献指南

1. Fork 本仓库
2. 创建特性分支 (`git checkout -b feature/AmazingFeature`)
3. 提交改动 (`git commit -m 'Add some AmazingFeature'`)
4. 推送到分支 (`git push origin feature/AmazingFeature`)
5. 打开 Pull Request

## 许可证

[MIT License](LICENSE)

## 作者

xiao_wine - [@github](https://github.com/xiaowine)
