module.exports = {
  apps: [
    {
      name: "site-v3",
      script: "/root/.nvm/versions/node/v18.19.0/bin/serve",
      args: "-s dist -l 3000",
      cwd: "/var/www/html/site-v3",
      env: {
        NODE_ENV: "production",
      },
    },
  ],
};
