var express = require("express");
const {
  createfollow,unfollowUser,checkfollow
} = require("../services/follow.service");
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

// router.post("/:UserId", async (req, res) => {
//   let { foodId } = req?.params;
//   let username = req?.username;
//   let response = await addToCart({ foodId, username });
//   res.json(response);
// });
router.post("/check", async (req, res, next) => {

  let shopId = req.body.shopId;
  let LogineduserId = req.body.LoginedUserId;
  
  const response = await checkfollow(LogineduserId, shopId);
  res.json(response);
});

router.post("/create", async (req, res, next) => {
  const { LogineduserId, shopId } = req.body;

  const response = await createfollow(LogineduserId, shopId);
  res.json(response);
});


router.delete("/unfollow", async (req, res) => {
  try {
    let shopId = req.body.shopId;
    let LoginedUserId = req.body.LoginedUserId;
    let response = await unfollowUser(LoginedUserId,shopId);

    res.json(response);
  } catch (error) {
    console.error("Error deleting product:", error);
    res.status(500).json({ status: false, message: "Internal server error" });
  }
});
module.exports = router;
