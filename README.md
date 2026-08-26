# Remi SSR 官网（ssr.remitech.ai）

Remi 集团官网，基于 Next.js，采用 Service 层 → BFF → Server Components 的分层架构。

## 技术栈

- **框架**：Next.js 16（App Router，`output: standalone`）+ React 19 + TypeScript
- **样式**：Tailwind CSS 4 + shadcn/ui（Radix UI 组件）
- **国际化**：next-intl（`zh` 默认无前缀 / `en` 带前缀），文案位于 `messages/`
- **主题**：next-themes（light / dark / system）
- **状态与请求**：Zustand、TanStack React Query（客户端岛通过 BFF + Suspense）
- **包管理器**：pnpm（锁文件 `pnpm-lock.yaml`）

## 目录结构

```
├── src/
│   ├── app/[locale]/        # 多语言页面（首页、about、solutions、news、contact 等）
│   ├── components/          # 布局与通用组件（header / footer / nav 等）
│   ├── config/              # 站点导航等配置
│   ├── i18n/                # next-intl 路由与请求配置
│   ├── lib/                 # 工具函数与基础设施
│   ├── services/            # Service 层（内容服务抽象 + BFF API）
│   ├── stores/              # Zustand 状态
│   └── proxy.ts             # 上游 API 代理配置
├── messages/                # zh.json / en.json 多语言文案
├── public/                  # 静态资源（图片、字体、视频）
├── Dockerfile               # 生产镜像构建（pnpm + Next.js standalone）
├── Jenkinsfile              # CI/CD 流水线（构建镜像 → 部署 K8s）
├── remi-frontend-ssr.yaml   # K8s Deployment + Service 清单
├── ecosystem.config.cjs     # PM2 进程配置（test / prod 实例）
└── nginx.conf / Caddyfile   # 反向代理配置
```

## 本地开发

前置要求：[pnpm](https://pnpm.io) ≥ 9

```bash
pnpm install       # 安装依赖
pnpm dev           # 启动开发服务器（端口 3088，日志输出到 dev.log）
pnpm lint          # ESLint 检查
```

## 构建与生产启动

```bash
pnpm build         # next build 并组装 .next/standalone 产物
pnpm start         # 以 node 运行 standalone server（端口 3212）
```

PM2 方式（对应部署环境）：

```bash
pm2 start ecosystem.config.cjs --only prod    # 生产实例（端口 3212）
pm2 start ecosystem.config.cjs --only test    # 测试实例
```

## 环境变量

在 `.env`（本地）或 K8s ConfigMap `remi-frontend-ssr-configmap`（部署）中配置：

| 变量 | 说明 |
|---|---|
| `UPSTREAM_API_HOST` | 上游 API 主机 |
| `UPSTREAM_API_VERSION` | 上游 API 版本 |
| `UPSTREAM_SERVER_URL` | 上游服务完整地址 |

以上均为**运行时**变量（无 `NEXT_PUBLIC_` 前缀），构建镜像时无需注入。

## Docker

```bash
docker build -t remi-frontend-ssr:local .
docker run -p 3212:3212 --env-file .env remi-frontend-ssr:local
```

镜像分两阶段：构建阶段用 pnpm 安装依赖并执行 `next build`；运行阶段仅包含 `.next/standalone` 产物，由 `pm2-runtime` 以 node 作为解释器启动。

## CI/CD（Jenkins → K8s）

流水线（`Jenkinsfile`）流程：

1. **初始化**：命名空间 `sit-website`，使用 `kubeconfig-sit` 凭据
2. **拉取代码**：`git@github.com:remi-team/ssr.remitech.ai.git`（凭据 `ssh-key-git`）
3. **构建镜像**：`docker build` 后推送至 `sitanduat.azurecr.io`（凭据 `docker-hub-creds`），标签为 `<分支>-<时间戳>`
4. **部署**：将镜像名注入 `remi-frontend-ssr.yaml` 后 `kubectl apply`，滚动重启并等待就绪

部署前置条件（集群侧一次性配置）：

- ConfigMap `remi-frontend-ssr-configmap`：包含上表运行时变量
- Secret `registry-secret`：Azure CR 拉取凭据
- Jenkins 凭据：`ssh-key-git`、`docker-hub-creds`、`kubeconfig-sit`

## 端口约定

| 场景 | 端口 |
|---|---|
| 本地开发（`pnpm dev`） | 3088 |
| 生产 standalone 服务 | 3212 |
| nginx / Caddy 反向代理入口 | 81 |

反向代理支持 `?XTransformPort=<port>` 查询参数动态切换后端端口（多实例并行调试场景）。
