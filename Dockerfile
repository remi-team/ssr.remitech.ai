# ---------- 1. 构建阶段 ----------
FROM node:22-alpine AS builder

WORKDIR /app

# 配置 pnpm（项目统一使用 pnpm，锁文件为 pnpm-lock.yaml）
RUN corepack enable && corepack prepare pnpm@9 --activate

# 复制依赖文件（仅锁文件，利用构建缓存）
COPY package.json pnpm-lock.yaml ./
RUN pnpm install --frozen-lockfile

# 复制所有源代码
COPY . .

# 【核心】执行 Next.js 构建（next build + standalone 产物组装）
RUN pnpm run build


# ---------- 2. 运行阶段 ----------
FROM node:22-alpine

WORKDIR /app

# 安装基础工具（Node 运行时由基础镜像提供）
RUN apk add --no-cache bash curl

# 全局安装 pm2
RUN npm install -g pm2

# 复制构建产物
COPY --from=builder /app/.next/standalone ./.next/standalone
COPY --from=builder /app/.next/static ./.next/static
COPY --from=builder /app/public ./public
COPY --from=builder /app/ecosystem.config.cjs .

EXPOSE 3212
# 【终结】直接使用原生命令，去除了 start.sh，环境变量由 K8s envFrom 注入
CMD ["pm2-runtime", "ecosystem.config.cjs", "--only", "prod"]