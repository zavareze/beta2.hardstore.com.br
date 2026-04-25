module.exports = {
  apps: [
    {
      name: 'Hardstore',
      port: '3000',
      exec_mode: 'cluster',
      instances: 'max',
      interpreter: '/root/.nvm/versions/node/v24.15.0/bin/node',
      script: './.output/server/index.mjs',
    },
  ],
}
