# lzh-ai (ai-myvue)

这是一个基于 Vue 3 + Vite 构建的前端项目。结合了 Element Plus、Pinia 和 Vue Router，并集成了富文本编辑器与数据可视化图表，适用于构建现代化的 AI 应用交互界面或后台管理系统。

## 🛠️ 技术栈

- **框架**: [Vue 3](https://vuejs.org/) (Composition API)
- **构建工具**: [Vite](https://vitejs.dev/)
- **路由**: [Vue Router 4](https://router.vuejs.org/)
- **状态管理**: [Pinia](https://pinia.vuejs.org/)
- **UI 组件库**: [Element Plus](https://element-plus.org/)
- **图表库**: [ECharts](https://echarts.apache.org/)
- **富文本编辑器**: [WangEditor 5](https://www.wangeditor.com/)
- **网络请求**: [Axios](https://axios-http.com/) & [fetch-event-source](https://github.com/Azure/fetch-event-source) (用于 SSE 数据流)
- **样式**: Sass

## 🚀 快速开始

### 1. 环境准备

确保你的计算机上已经安装了 [Node.js](https://nodejs.org/) (推荐 18.x 或以上版本)。

### 2. 克隆项目

```bash
git clone https://github.com/xiaoxxo/lzh-ai.git
cd lzh-ai
```

### 3. 安装依赖

推荐使用 `npm` 进行依赖安装：

```bash
npm install
```

### 4. 运行开发环境

```bash
npm run dev
```
项目将在本地启动，默认可以在浏览器访问 `http://localhost:5173/`。

### 5. 生产环境构建

```bash
npm run build
```
执行完毕后，生成的静态资源将会存放在 `dist` 目录中。如需在本地预览打包后的效果，可以运行：

```bash
npm run preview
```

## 📦 部署说明

项目包含了 `vercel.json` 配置文件，支持一键部署到 [Vercel](https://vercel.com/)。
只需将本仓库导入到 Vercel 控制台即可自动完成构建和发布。
