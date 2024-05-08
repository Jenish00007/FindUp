const { mongoConfig } = require("../config");
const MongoDB = require("./mongodb.service");
const { ObjectId } = require('mongodb');
const addToCart = async ({ foodId, username }) => {
  try {
    let updatedCart = await MongoDB.db
      .collection(mongoConfig.collections.CARTS)
      .updateOne(
        { foodId, username },
        { $inc: { count: 1 } },
        { upsert: true }
      );
    if (updatedCart?.modifiedCount > 0 || updatedCart?.upsertedCount > 0) {
      let cartResponse = await getCartItems({ username });
      return {
        status: true,
        message: "Item Added to Cart Successfully",
        data: cartResponse?.data,
      };
    }
  } catch (error) {
    return {
      status: false,
      message: "Item Added to Cart Failed",
    };
  }
};

const removeFromCart = async ({ foodId, username }) => {
  try {
    let cart = await MongoDB.db
      .collection(mongoConfig.collections.CARTS)
      .findOne({ foodId, username, count: 1 });
    if (cart) {
      await MongoDB.db
        .collection(mongoConfig.collections.CARTS)
        .deleteOne({ foodId, username });
      let cartResponse = await getCartItems({ username });
      return {
        status: true,
        message: "Item Removed from Cart Successfully",
        data: cartResponse?.data,
      };
    }
    let updatedCart = await MongoDB.db
      .collection(mongoConfig.collections.CARTS)
      .updateOne(
        { foodId, username },
        { $inc: { count: -1 } },
        { upsert: true }
      );
    if (updatedCart?.modifiedCount > 0 || updatedCart?.upsertedCount > 0) {
      let cartResponse = await getCartItems({ username });
      return {
        status: true,
        message: "Item Removed from Cart Successfully",
        data: cartResponse?.data,
      };
    }
  } catch (error) {
    return {
      status: false,
      message: "Item Removed from Cart Failed",
    };
  }
};




const getFavouriteItems = async ({ LoginedUserId }) => {
  try {
    let FavouriteItems = await MongoDB.db
      .collection(mongoConfig.collections.FAVOURITES) // Corrected collection name
      .aggregate([
        {
          $match: {
            userId: LoginedUserId,
          },
        },
        {
          $lookup: {
            from: "products",
            localField: "productId",
            foreignField: "id",
            as: "products",
          },
        },
        {
          $unwind: {
            path: "$products",
          },
        },
      ])
      .toArray();
      
    if (FavouriteItems?.length > 0) {
      let itemsTotal = FavouriteItems.reduce((total, item) => total + (item.products?.price || 0), 0); // Corrected calculation of itemsTotal
      let discount = 0;
      return {
        status: true,
        message: "Favourite items fetched successfully", // Updated message
        data: {
          FavouriteItems,
          metaData: {
            itemsTotal,
            discount,
            grandTotal: itemsTotal - discount,
          },
        },
      };
    } else {
      return {
        status: false,
        message: "Favourite items not found", // Updated message
      };
    }
  } catch (error) {
    return {
      status: false,
      message: "Favourite items fetch failed", // Updated message
    };
  }
};


const removeFromFavourite = async (LoginedUserId, productId) => {
  try {
    const objectId = new ObjectId(LoginedUserId); // Convert the user ID to ObjectId
   

    const result = await MongoDB.db.collection(mongoConfig.collections.USERS)
      .updateOne(
        { _id: objectId }, // Find the user by ID
        { $pull: { favouriteProductId: productId } } // Remove the product ID from the favouriteProductId array
      );

    if (result.modifiedCount > 0) {
      return {
        status: true,
        message: "Product removed from favorites successfully",
       
      };
    } else {
      return {
        status: false,
        message: "No product found with the given ID in user's favorites",
      };
    }
  } catch (error) {
    console.error("Error removing product:", error);
    return {
      status: false,
      message: "Failed to remove product from favorites",
      error: error.message, // Return only the error message, not the whole error object
    };
  }
};


const addToFavourite = async (LoginedUserId, productId) => {
  try {
    const objectId = new ObjectId(LoginedUserId); // Convert the user ID to ObjectId
  

    const result = await MongoDB.db.collection(mongoConfig.collections.USERS)
      .updateOne(
        { _id: objectId }, // Find the user by ID
        { $addToSet: { favouriteProductId: productId } } // Add the product ID to the favouriteProductId array, avoiding duplicates
      );

    if (result.modifiedCount > 0) {
      return {
        status: true,
        message: "Product added to favorites successfully",
      };
    } else {
      return {
        status: false,
        message: "No user found with the given ID",
      };
    }
  } catch (error) {
    console.error("Error adding product:", error);
    return {
      status: false,
      message: "Failed to add product to favorites",
      error: error.message, // Return only the error message, not the whole error object
    };
  }
};



module.exports = { addToFavourite, removeFromFavourite, getFavouriteItems };
