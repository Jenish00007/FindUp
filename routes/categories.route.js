// CategoriesRouter
var express = require("express");
const { getAllCategories,getOneCategoriesById } = require("../services/categories.services");
var router = express.Router();

router.get("/", async (req, res) => {
  let response = await getAllCategories();
  res.json(response);
});

router.get("/:categoriesId", async (req, res) => {
  let categoriesId = req?.params?.categoriesId;
  let response = await getOneCategoriesById(categoriesId);
  res.json(response);
});
module.exports = router;