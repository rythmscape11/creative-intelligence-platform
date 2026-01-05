// PM2 Ecosystem Configuration for MediaPlanPro
// This file configures PM2 process manager for production deployment

module.exports = {
  apps: [
    {
      name: 'mediaplanpro',
      script: 'npm',
      args: 'start',
      cwd: './',
      instances: 1,
      autorestart: true,
      watch: false,
      max_memory_restart: '1G',
      
      // Environment variables for production
      env_production: {
        NODE_ENV: 'production',
        PORT: 3000,
        // Add other environment variables here or use .env.production file
      },
      
      // Logging
      error_file: './logs/pm2-error.log',
      out_file: './logs/pm2-out.log',
      log_file: './logs/pm2-combined.log',
      time: true,
      
      // Advanced features
      merge_logs: true,
      log_date_format: 'YYYY-MM-DD HH:mm:ss Z',
      
      // Restart strategy
      min_uptime: '10s',
      max_restarts: 10,
      
      // Graceful shutdown
      kill_timeout: 5000,
      wait_ready: true,
      listen_timeout: 10000,
    },
  ],

  // Deployment configuration (optional)
  deploy: {
    production: {
      user: 'username',
      host: 'yourdomain.com',
      ref: 'origin/main',
      repo: 'git@github.com:yourusername/mediaplanpro.git',
      path: '/home/username/public_html/mediaplanpro',
      'post-deploy': 'npm ci && npm run build && pm2 reload ecosystem.config.js --env production',
      'pre-deploy-local': '',
      'post-setup': 'npm ci && npm run build',
    },
  },
};

