module.exports = {
  apps: [
    {
      name: "site-v3",
      script: "serve",
      args: "-s dist -l 3000",
      env: {
        NODE_ENV: "production",
      },
    },
  ],
};
