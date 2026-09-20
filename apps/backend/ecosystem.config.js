/* eslint-disable no-undef */
module.exports = {
  apps: [
    {
      name: 'milky-server',
      script: './dist/main.js',
      args: 'start',
      env: {
        NODE_ENV: 'production',
      },
    },
  ],
};
