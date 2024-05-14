var express = require("express");
const { getAllOrderData ,getOrderUserById,removeFromOrder,updateBookingStatus} = require("../services/order.service");
var router = express.Router();

router.get("/getall", async (req, res) => {
  let response = await getAllOrderData();
  res.json(response);
});

router.get("/:userId", async (req, res) => {
  let userId = req?.params?.userId;
  let response = await getOrderUserById(userId);
  res.json(response);

});

router.delete("/delete", async (req, res) => {
  try {
    const productId = req.body.productId; // Change to req.body.productId if productId is sent in the request body
    const LoginedUserId = req.body.LoginedUserId; // Get the logged-in user's ID
    await removeFromOrder(LoginedUserId, productId);
    res.json({ status: true, message: "Product Canceled successfully" });
  } catch (error) {
    console.error("Error Canceled product:", error.message); // Log only the error message
    res.status(500).json({ status: false, message: "Internal server error" });
  }
});
// Update booking status
router.post("/updatestatus", async (req, res) => {
  try {
      const productId = req.body.productId;
      const selectedStep = req.body.selectedStep;
      console.log(selectedStep,productId)
      await updateBookingStatus(productId, selectedStep);
      res.json({ status: true, message: "Booking status updated successfully" });
  } catch (error) {
      console.error("Error updating booking status:", error.message);
      res.status(500).json({ status: false, message: "Internal server error" });
  }
});

module.exports = router;
