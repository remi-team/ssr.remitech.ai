# Remi SSR 官网（ssr.remitech.ai）

Remi 集团官网，基于 Next.js 16（App Router，`output: standalone`）构建的多语言（中/英）企业站点，采用 Service 层 → BFF → Server Components 分层架构。

## 技术栈

- Next.js 16 + React 19 + TypeScript
- Tailwind CSS 4（CSS 优先配置，无 `tailwind.config.ts`）+ shadcn/ui
- next-intl（多语言）、next-themes（明暗主题）、Zustand、TanStack React Query
- 包管理器：pnpm

## 目录结构

```
├── src/app/[locale]/   # 多语言页面（首页、about、solutions、news、contact 等）
├── src/components/     # 布局与通用组件
├── src/services/       # Service 层 + BFF API 路由
├── src/i18n/           # next-intl 配置
├── messages/           # zh / en 文案
├── public/             # 静态资源（图片、字体、视频）
├── Dockerfile          # 生产镜像（pnpm + standalone）
├── Jenkinsfile         # CI/CD 流水线
└── remi-frontend-ssr.yaml  # K8s 部署清单
```

## 本地开发

```bash
pnpm install
pnpm dev        # http://localhost:3088
pnpm lint       # ESLint 检查
```

## 构建与运行

```bash
pnpm build      # 生成 .next/standalone 产物
pnpm start      # 生产模式，端口 3212
```

## 环境变量

运行时变量（本地配置 `.env`，部署由 K8s ConfigMap `remi-frontend-ssr-configmap` 注入）：

| 变量 | 说明 |
|---|---|
| `UPSTREAM_API_HOST` | 上游 API 主机 |
| `UPSTREAM_API_VERSION` | 上游 API 版本 |
| `UPSTREAM_SERVER_URL` | 上游服务完整地址 |

均无 `NEXT_PUBLIC_` 前缀，构建镜像时无需注入。

## Docker

```bash
docker build -t remi-frontend-ssr:local .
docker run -p 3212:3212 --env-file .env remi-frontend-ssr:local
```

## 部署（Jenkins → K8s）

流水线流程：拉取代码 → 构建镜像并推送 → 按 `remi-frontend-ssr.yaml` 部署到命名空间 `sit-website` 并滚动更新。

集群侧需预先配置：ConfigMap `remi-frontend-ssr-configmap`（运行时变量）、镜像拉取密钥 `registry-secret`。

## 端口约定

| 场景 | 端口 |
|---|---|
| 本地开发 | 3088 |
| 生产服务 | 3212 |
| nginx / Caddy 反向代理 | 81 |

反向代理支持 `?XTransformPort=<port>` 动态切换后端端口（多实例调试场景）。
