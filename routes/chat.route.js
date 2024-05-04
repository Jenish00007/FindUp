var express = require("express");
const {
  followUser
} = require("../services/follow.service");
const { getMatches, Messages } = require("../services/chat.service");
var router = express.Router();

// router.get("/", async (req, res) => {
//   let response = await getAllShop();
//   res.json(response);
// });

// router.get("/:shopId", async (req, res) => {
//   let shopId = req?.params?.shopId;
//   let response = await getOneShopById(shopId);
//   res.json(response);
// });

// router.post("/get-match", async (req, res, next) => {
//   let body = req.body;
//   let response = await getMatches(body);
//   res.json(response);
// });

// router.post("/Messages", async (req, res, next) => {
//     let body = req.body;
//     let response = await Messages(body);
//     res.json(response);
//   });
module.exports = router;
