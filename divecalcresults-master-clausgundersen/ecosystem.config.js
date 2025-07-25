module.exports = {
  /**
   * Application configuration section
   * http://pm2.keymetrics.io/docs/usage/application-declaration/
   */
  apps: [
    {
      name: "DIVECALC-SCOREBOARD",
      script: "src/server/index.js",
      env: {
        NODE_ENV: "production",
        PORT: 9000,
        FORWARD_ENABLED: true,
        FORWARD_URL: "http://virtual-prod:3000",
        FORWARD_SECRET: "supersaus"
      },
      exec_mode: "fork",
      instances: 1,
      autorestart: true,
      watch: false,
      max_memory_restart: "1G",
      env_production: {
        NODE_ENV: "production"
      }
    }
  ],
  deploy: {
    production: {
      user: "user",
      host: ["yourserver.com"],
      ref: "origin/main",
      repo: "git_repo_url",
      path: "/var/www/divecalc-scoreboard",
      'post-setup': "npm install",
      'post-deploy': "npm install && npm run build && pm2 startOrRestart ecosystem.config.js --env production"
    }
  }
};