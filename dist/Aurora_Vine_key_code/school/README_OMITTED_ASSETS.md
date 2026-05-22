# school/ 目录说明（本包未包含全部院校资源）

完整项目中约有 **200** 个院校目录：`school/No.{QS排名}/`

每个目录典型文件：

- `intro.json` — 中英简介、官网、地址（本包仅附带 `No.1/intro.json` 样本）
- `1.jpg` … `5.jpg` — 详情页轮播（可选）
- 若干 `.png` / `.PNG` — 校徽等，文件名因校而异

构建 SQLite 时由 `data/init_db.js` 扫描 `intro.json` 与图片路径。  
运行时通过主进程 `school://` 协议提供静态资源。
