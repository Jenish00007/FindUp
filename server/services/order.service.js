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

const removeFromOrder = async (userId, productId) => {
    try {
        // Convert userId to ObjectId
        const objectId = new ObjectId(userId);

        // Check if user exists
        const userExists = await MongoDB.db
            .collection(mongoConfig.collections.USERS)
            .findOne({ _id: objectId });

        if (userExists) {
            // Delete specific product from user's orders
            const result = await MongoDB.db
                .collection(mongoConfig.collections.BOOKINGS)
                .deleteOne({ userId: userId, productId: productId });

            if (result.deletedCount > 0) {
                return {
                    status: true,
                    message: "Product deleted from orders successfully",
                };
            } else {
                return {
                    status: false,
                    message: "No order found with the given product ID for the user",
                };
            }
        } else {
            return {
                status: false,
                message: "No user found with the given ID",
            };
        }
    } catch (error) {
        return {
            status: false,
            message: "Failed to delete product from orders",
            error: `Error deleting product from orders: ${error.message}`,
        };
    }
};


const updateBookingStatus = async (productId, selectedStep) => {
  try {
      let statusToUpdate;
      console.log(statusToUpdate,productId)
      // Determine the status based on the selectedStep
      if (selectedStep === 1) {
          statusToUpdate = "PICKUP";
      } else if (selectedStep === 2) {
          statusToUpdate = "DELIVERED";
      } else {
          // Handle other steps if needed
          return {
              status: false,
              message: "Invalid step",
          };
      }
      
      // Find the booking with the given productId
      const booking = await MongoDB.db
          .collection(mongoConfig.collections.BOOKINGS)
          .findOne({ productId: productId });

      if (!booking) {
          return {
              status: false,
              message: "No booking found with the given product ID",
          };
      }

      // Update the status of the booking
      const result = await MongoDB.db
          .collection(mongoConfig.collections.BOOKINGS)
          .updateOne(
              { _id: booking._id },
              { $set: { status: statusToUpdate } }
          );

      if (result.modifiedCount === 1) {
          return {
              status: true,
              message: "Booking status updated successfully",
          };
      } else {
          return {
              status: false,
              message: "Failed to update booking status",
          };
      }
  } catch (error) {
      return {
          status: false,
          message: "Error updating booking status",
          error: error.message,
      };
  }
};
  
  
  module.exports = { getOrderUserById, getAllOrderData ,removeFromOrder,updateBookingStatus};
  