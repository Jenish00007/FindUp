var express = require("express");
const multer = require('multer');
const {
  getAllShop,
  getOneShopById,
  shopRegister
} = require("../services/shop.service");
var router = express.Router();

router.get("/", async (req, res) => {
  let response = await getAllShop();
  res.json(response);
});

router.get("/:shopId", async (req, res) => {
  let shopId = req?.params?.shopId;
  let response = await getOneShopById(shopId);
  res.json(response);
});

router.post("/register", async (req, res, next) => {
  let shopData = req.body;
  let response = await shopRegister(shopData);
  res.json(response);
});

module.exports = router;
