const { mongoConfig } = require("../config");
const MongoDB = require("./mongodb.service");
const { ObjectId } = require('mongodb');
const getAllOrderData = async () => {
  try {
    let userObject = await MongoDB.db
      .collection(mongoConfig.collections.BOOKINGS)
      .find()
      .toArray();

    if (userObject) {
      return {
        status: true,
        message: "User found successfully",
        userObject,
      };
    } else {
      return {
        status: false,
        message: "No user found",
      };
    }
  } catch (error) {
    return {
      status: false,
      message: "User finding failed",
      error: `User finding failed : ${error?.message}`,
    };
  }
};



const getOrderUserById = async (userId) => {
    try {
      // Convert userId to ObjectId
      const objectId = new ObjectId(userId);
  
      // Find user by ObjectId
      let userObject = await MongoDB.db
        .collection(mongoConfig.collections.USERS)
        .findOne({ _id: objectId });
  
      if (userObject) {
        // Find bookings by user ID
        let bookings = await MongoDB.db
          .collection(mongoConfig.collections.BOOKINGS)
          .find({ userId: userId })
          .toArray();
  
        // Find products associated with bookings
        let productIds = bookings.map(booking => booking.productId);
        let products = await MongoDB.db
          .collection(mongoConfig.collections.PRODUCTS)
          .find({ _id: { $in: productIds } })
          .toArray();

        return {
          status: true,
          message: "Order found successfully",
       
          bookings,
          products
        };
      } else {
        return {
          status: false,
          message: "No Order found with the given ID",
        };
      }
    } catch (error) {
      return {
        status: false,
        message: "Failed to find user",
        error: `Error finding user: ${error.message}`,
      };
    }
  };

  const removeFromOrder = async (userId) => {
    try {
        // Convert userId to ObjectId
        const objectId = new ObjectId(userId);

        // Check if user exists
        const userExists = await MongoDB.db
            .collection(mongoConfig.collections.USERS)
            .findOne({ _id: objectId });

        if (userExists) {
            // Delete orders associated with user
            await MongoDB.db
                .collection(mongoConfig.collections.BOOKINGS)
                .deleteMany({ userId: userId });

            return {
                status: true,
                message: "Orders deleted successfully",
            };
        } else {
            return {
                status: false,
                message: "No user found with the given ID",
            };
        }
    } catch (error) {
        return {
            status: false,
            message: "Failed to delete orders",
            error: `Error deleting orders: ${error.message}`,
        };
    }
};

  
  
  module.exports = { getOrderUserById, getAllOrderData ,removeFromOrder};
  