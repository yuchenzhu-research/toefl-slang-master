# Frontend Governance

本文件记录 SPARK 桌面前端的收纳边界与演进顺序。最高原则仍以 `CONSTITUTION.md` 为准。

---

## 1. Directory Boundary

桌面前端统一放在：

```text
apps/desktop/
```

它是 Electron + React 应用层，不是新的平台核心。顶层 `src/` 仍然是 CLI、contract、provider runtime、模块业务与 backend API 的主源码边界。

---

## 2. Package Boundary

当前仓库采用 npm workspace：

- 根 `package.json`
  - 仓库级 scripts、bin、依赖和 workspace 声明的权威来源
  - 暴露 `desktop:*` 脚本
- `apps/desktop/package.json`
  - 桌面端 Electron / Vite / React 子包描述
  - 不作为仓库级入口
- 根 `package-lock.json`
  - 唯一依赖锁定来源
  - 不维护 `apps/desktop/package-lock.json`

两个 `package.json` 是 monorepo 分层，不是重复入口；第二份 lockfile 才是需要避免的冗余。

---

## 3. Runtime Boundary

前端只能通过稳定边界消费能力：

- 本地 backend API，例如 `spark web`
- 稳定 contract / JSON sidecar
- 明确暴露的 preload / IPC adapter

前端不应直接复制：

- provider resolution
- validated-json runtime
- Dictionary Pro / Content Parser / TOEFL Coach 的业务逻辑
- connector mapping

如果前端需要新能力，优先在 `src/` 的 contract / API 层补齐，再接入 UI。

---

## 4. Generated Files

以下属于本地生成物，不进入项目结构：

- `apps/desktop/node_modules/`
- `apps/desktop/dist/`
- `apps/desktop/out/`
- `.DS_Store`

以下属于桌面端源资产，可以保留：

- `apps/desktop/src/`
- `apps/desktop/resources/`
- `apps/desktop/build/` 中的 Electron 打包资源

---

## 5. Evolution Order

桌面端后续演进按以下顺序推进：

1. 稳定 backend API / contract
2. 稳定 renderer 页面与 shared UI components 的职责
3. 收口 preload / IPC adapter
4. 补最小前端 typecheck / build 验证
5. 最后再扩展复杂交互、离线缓存或多窗口能力

不要先扩大 GUI，再回头补 contract。

---

## 6. Verification Baseline

任何影响 `apps/desktop/`、workspace 依赖、renderer 页面、preload / IPC 或桌面端构建配置的改动，都至少运行：

```bash
npm run desktop:typecheck
npm run desktop:build
```

CI 必须保留桌面端 typecheck 和 build 基线。前端可以继续快速迭代，但不能长期依赖“本地能跑、CI 不覆盖”的状态。
