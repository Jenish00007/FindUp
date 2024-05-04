// CategoriesRouter
var express = require("express");
const { getAllSliders } = require("../services/slider.service");
var router = express.Router();

router.get("/", async (req, res) => {
  let response = await getAllSliders();
  res.json(response);
});

module.exports = router;