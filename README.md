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

全部为**运行时**变量（本地写 `.env`，部署由 K8s ConfigMap `remi-frontend-ssr-configmap` 注入）。镜像一份通吃各环境，构建期无需注入任何变量（无 `NEXT_PUBLIC_` 前缀）。

| 变量 | 默认值 | 说明 |
|---|---|---|
| `WEBSITE_API_SERVER_URL` | `http://remi-website-backend-sit.remitech.ai` | 官网 API 服务（`remi-website-backend`）完整地址，BFF 出网唯一目标 |
| `WEBSITE_API_VERSION` | `v1` | API 版本段，拼成 `/api/${版本}` |
| `WEBSITE_API_RSA_PUBLIC_KEY` | 内置 SIT 公钥 | BFF 转发登录/注册前加密密码用的 RSA 公钥（PEM，`\n` 可用字面量）；正式环境后端换密钥对时必须同步注入 |
| `SITE_URL` | `https://www.remitech.ai` | 本站对外 origin：canonical / hreflang / og:url / sitemap `<loc>` / robots `Sitemap:` 全部由它派生 |
| `SITE_ENV` | `sit` | 部署阶段。**只有 `production` 才放开索引**（`index, follow`）；其余取值输出 `noindex, nofollow` + `X-Robots-Tag`，robots.txt 也只给 `Disallow: /` |

命名约定：每个外部 API 服务使用独立的 `<SERVICE>_API_` 前缀（当前服务为 `WEBSITE_API_*`），后续新增服务平行扩展（如 `CRM_API_SERVER_URL`），互不冲突。

浏览器侧只请求本站 `/api/*`（BFF），永不直连后端，因此后端地址不会进入前端产物；切换环境只改 ConfigMap，无需重新构建。

**上正式环境的最小改动**：在生产的 ConfigMap 里设 `SITE_ENV=production` + `SITE_URL=https://www.remitech.ai` + `WEBSITE_API_SERVER_URL=<正式后端地址>`（若后端换密钥对，再加 `WEBSITE_API_RSA_PUBLIC_KEY`），重启 Pod 即生效。

## Docker

```bash
docker build -t remi-frontend-ssr:local .
docker run -p 3212:3212 --env-file .env remi-frontend-ssr:local
```

`.dockerignore` 已排除 `node_modules` / `.next` / `.env`：镜像内的依赖与构建产物只在 builder 阶段生成，运行时配置一律由外部注入。

## 部署（Jenkins → K8s）

流水线流程：拉取代码 → 构建镜像并推送 → 按 `remi-frontend-ssr.yaml` 部署到命名空间 `sit-website` 并滚动更新。

集群侧需预先配置：ConfigMap `remi-frontend-ssr-configmap`（运行时变量）、镜像拉取密钥 `registry-secret`。

当前 `Jenkinsfile` 的 `DEPLOY_TARGET` 只有 `sit`，命名空间与 kubeconfig 也是写死的 SIT 值；要发正式环境，需补一个生产分支（生产 namespace、`kubeconfig-prod` 凭据、生产 ConfigMap），或另建一条生产流水线。

前端之外的配套（运维侧）：TLS 证书与 HTTP→HTTPS 强制跳转、`X-Forwarded-Proto`/`X-Forwarded-Host` 透传（`Secure` Cookie 与 origin 解析依赖它）、CDN 缓存策略（文档 `s-maxage=3600`，新闻 300，已在 `next.config.ts` 的 `headers()` 中下发）。

## 端口约定

| 场景 | 端口 |
|---|---|
| 本地开发 | 3088 |
| 生产服务 | 3212 |
| nginx / Caddy 反向代理 | 81 |

反向代理支持 `?XTransformPort=<port>` 动态切换后端端口（多实例调试场景）。
