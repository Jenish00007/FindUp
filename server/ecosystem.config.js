module.exports = {
    apps: [
      {
        name: "foodelivery-backend",
        script: "./bin/www",
        instances: 1,
        autorestart: true,
        watch: false,
        env: {
          NODE_ENV: "development",
          MONGO_CONNECTION_URL: "mongodb://127.0.0.1:27017/foodelivery_db",
          SERVER_IP: "127.0.0.1",
          SERVER_PORT: "8080",
        },
        env_production: {
          NODE_ENV: "production",
          MONGO_CONNECTION_URL: "mongodb://127.0.0.1:27017/foodelivery_db",
          SERVER_IP: "127.0.0.1",
          SERVER_PORT: "8080",
        },
      },
    ],
  };