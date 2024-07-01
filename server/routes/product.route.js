var express = require("express");
const { getOneProductsById,getAllProducts,AddProduct ,deleteOneProductsById} = require("../services/product.service");
var router = express.Router();

router.get("/", async (req, res) => {
  let response = await getAllProducts();
  //console.log(response,'response')
  res.json(response);
});

router.get("/:productId", async (req, res) => {
  let productId = req?.params?.productId;
  let response = await getOneProductsById(productId);
  //console.log(productId,'productId')
  res.json(response);
});

router.delete("/delete/:productId", async (req, res) => {
  try {
    let productId = req.params.productId;
    let response = await deleteOneProductsById(productId);
    //console.log(productId, 'productId');
    res.json(response);
  } catch (error) {
    console.error("Error deleting product:", error);
    res.status(500).json({ status: false, message: "Internal server error" });
  }
});

// router.post("/addproduct", async (req, res, next) => {
//   let body = req.body;
//   let response = await AddProduct(body);
//   res.json(response);
// });
module.exports = router;
