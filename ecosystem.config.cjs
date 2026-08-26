/**
 * PM2 Ecosystem Configuration
 *
 * Usage:
 *   pnpm exec pm2 start ecosystem.config.cjs --only test   → start test instance via PM2
 *   pnpm exec pm2 start ecosystem.config.cjs --only prod   → start production instance via PM2
 *   pnpm exec pm2 stop test    → stop test instance
 *   pnpm exec pm2 restart prod → restart production instance
 *   pnpm exec pm2 logs test    → tail test logs
 *
 * Dev mode remains unchanged: pnpm dev
 */

module.exports = {
  apps: [
    {
      name: "test",
      script: ".next/standalone/server.js",
      interpreter: "node",
      env: {
        NODE_ENV: "test",
        PORT: "3212",
        HOSTNAME: "0.0.0.0",
      },
      instances: 1,
      exec_mode: "fork",
      max_restarts: 10,
      restart_delay: 2000,
      log_date_format: "YYYY-MM-DD HH:mm:ss Z",
      error_file: "logs/test-error.log",
      out_file: "logs/test-out.log",
      merge_logs: true,
      autorestart: true,
      watch: false,
      max_memory_restart: "512M",
    },
    {
      name: "prod",
      script: ".next/standalone/server.js",
      interpreter: "node",
      env: {
        NODE_ENV: "production",
        PORT: "3212",
        HOSTNAME: "0.0.0.0",
      },
      instances: 1,
      exec_mode: "fork",
      max_restarts: 10,
      restart_delay: 5000,
      log_date_format: "YYYY-MM-DD HH:mm:ss Z",
      error_file: "logs/prod-error.log",
      out_file: "logs/prod-out.log",
      merge_logs: true,
      autorestart: true,
      watch: false,
      max_memory_restart: "1G",
    },
  ],
};
