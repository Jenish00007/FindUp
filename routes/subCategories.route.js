// subCategoriesRouter
var express = require("express");
const { getAllSubCategories,getOneSubCategoriesById } = require("../services/subCategories.services");
var router = express.Router();

router.get("/", async (req, res) => {
  let response = await getAllSubCategories();
  res.json(response);
});
router.get("/:subcategoriesId", async (req, res) => {
  let subcategoriesId = req?.params?.subcategoriesId;
  let response = await getOneSubCategoriesById(subcategoriesId);
  res.json(response);
});

module.exports = router;