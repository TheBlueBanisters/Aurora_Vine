# 开发指南

## 开发模式（含 HMR）

使用 `npm run dev` 启动开发模式，支持：

- **渲染进程 HMR**：修改 `renderer/` 下的 HTML、CSS、JS 后，页面会自动热更新，无需刷新
- **Vite 开发服务器**：渲染进程由 Vite 提供，地址通常为 http://localhost:5173

```bash
npm run dev
```

如需在主进程或 preload 脚本变更时自动重启应用，可加上 `--watch`：

```bash
npx electron-vite dev --watch
```

## 生产构建

```bash
npm run build
npm start
```

构建产物在 `out/` 目录，`npm start` 会加载 `out/main/main.js` 作为 Electron 入口。

## 目录说明

- `main.js`：主进程
- `preload.js`：预加载脚本
- `renderer/`：渲染进程（HTML/CSS/JS）
- `image/`：静态图片资源
- `electron.vite.config.js`：electron-vite 配置
