var express = require("express");
const { getAllUserData ,getOneUserById} = require("../services/user.service");
var router = express.Router();

router.get("/getall", async (req, res) => {
  let response = await getAllUserData();
  res.json(response);
});

router.get("/:userId", async (req, res) => {
  let userId = req?.params?.userId;
  let response = await getOneUserById(userId);
  res.json(response);
});

module.exports = router;
