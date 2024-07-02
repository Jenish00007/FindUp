const config = require("./package.json").projectConfig;

module.exports = {
  mongoConfig: {
    connectionUrl: config.mongoConnectionUrl,
    database: "foodelivery_db",
    collections: {
       TOKEN:'tokens',
      USERS: "users",
      SHOPS: "shop",
      CARTS: "carts",
      FAVOURITES: "favourite",
      PRODUCTS: "products",
      BOOKMARKS: "bookmarks",
      CATEGORIES: "categories",
      SUBCATEGORIES: "subCategories",
      SLIDERS:"sliders",
      ORDERS:'orders',
      BOOKINGS:'booking',
     
    },
  },
  serverConfig: {
    ip: config.serverIp,
    port: config.serverPort,
  },
  tokenSecret: "foodelivery_secret",
};

