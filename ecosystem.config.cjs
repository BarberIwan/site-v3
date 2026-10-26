module.exports = {
  apps: [
    {
      name: "site-v3",
      script: "/root/.nvm/versions/node/v18.19.0/bin/serve",
      // Geen -s: die gaf elk onbekend adres de homepage met status 200.
      // serve leest dist/serve.json (omleidingen, slash, cache).
      args: "dist -l 3000",
      cwd: "/var/www/html/site-v3",
      env: {
        NODE_ENV: "production",
      },
    },
  ],
};
