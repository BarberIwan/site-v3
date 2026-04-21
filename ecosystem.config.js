module.exports = {
  apps: [
    {
      name: "barber-iwan-v3",
      script: "serve",
      args: "-s dist -l 3000",
      env: {
        NODE_ENV: "production",
      },
    },
  ],
};
