var express = require("express");
const {
  // addToCart,
  removeFromFavourite,
  getFavouriteItems,
  addToFavourite
} = require("../services/favourite.service");
var router = express.Router();

router.get("/:userId", async (req, res) => {
  let userId = req?.userId;
  let response = await getFavouriteItems({ userId });
  res.json(response);
});

// router.post("/:foodId", async (req, res) => {
//   let { foodId } = req?.params;
//   let username = req?.username;
//   let response = await addToCart({ foodId, username });
//   res.json(response);
// });

router.delete("/delete", async (req, res) => {
  try {
    const productId = req.body.productId; // Change to req.body.productId if productId is sent in the request body
    const LoginedUserId = req.body.LoginedUserId; // Get the logged-in user's ID
    await removeFromFavourite(LoginedUserId, productId);
    res.json({ status: true, message: "Product removed successfully" });
  } catch (error) {
    console.error("Error removing product:", error.message); // Log only the error message
    res.status(500).json({ status: false, message: "Internal server error" });
  }
});

router.post("/addToFavourite", async (req, res) => {
  try {
    const productId = req.body.productId; // Change to req.body.productId if productId is sent in the request body
    const LoginedUserId = req.body.LoginedUserId; // Get the logged-in user's ID
    //console.log(LoginedUserId,productId)
    await addToFavourite(LoginedUserId, productId);
    res.json({ status: true, message: "Product added successfully" });
  } catch (error) {
    console.error("Error adding product:", error.message); // Log only the error message
    res.status(500).json({ status: false, message: "Internal server error" });
  }
});



module.exports = router;
