const { mongoConfig } = require("../config");
const MongoDB = require("./mongodb.service");
const { ObjectId } = require('mongodb');

const createfollow = async (LogineduserId, shopId) => {
  try {
    const { ObjectId } = require('mongodb');

    const user = await MongoDB.db
      .collection(mongoConfig.collections.USERS)
      .findOne({ _id: ObjectId(LogineduserId) });

    if (!user) {
      return {
        status: false,
        message: "User to follow not found",
      };
    }

    const shop = await MongoDB.db
      .collection(mongoConfig.collections.SHOPS)
      .findOne({ _id: ObjectId(shopId) });

    if (!shop) {
      return {
        status: false,
        message: "Shop not found",
      };
    }

    const isAlreadyFollowing = user.following.includes(shopId);

    if (isAlreadyFollowing) {
      return {
        status: false,
        message: "User is already following the shop",
      };
    }

    await MongoDB.db
      .collection(mongoConfig.collections.USERS)
      .updateOne(
        { _id: ObjectId(LogineduserId) },
        { $addToSet: { following: shopId } }
      );

    await MongoDB.db
      .collection(mongoConfig.collections.SHOPS)
      .updateOne(
        { _id: ObjectId(shopId) },
        { $addToSet: { followers:LogineduserId} }
      );

    return {
      status: true,
      message: "User followed successfully",
    };
  } catch (error) {
    console.error("Error following user:", error);
    return {
      status: false,
      message: "Error following user",
      error: error.message,
    };
  }
};


const unfollowUser = async (userId, shopId) => {
  try {
    const { ObjectId } = require('mongodb');

    const user = await MongoDB.db
      .collection(mongoConfig.collections.USERS)
      .findOne({ _id: ObjectId(userId) });

    if (!user) {
      return {
        status: false,
        message: "User not found",
      };
    }

    const shop = await MongoDB.db
      .collection(mongoConfig.collections.SHOPS)
      .findOne({ _id: ObjectId(shopId) });

    if (!shop) {
      return {
        status: false,
        message: "Shop not found",
      };
    }

    const isFollowing = user.following.includes(shopId);

    if (!isFollowing) {
      return {
        status: false,
        message: "User is not following the shop",
      };
    }

    await MongoDB.db
      .collection(mongoConfig.collections.USERS)
      .updateOne(
        { _id: ObjectId(userId) },
        { $pull: { following: shopId } }
      );

    await MongoDB.db
      .collection(mongoConfig.collections.SHOPS)
      .updateOne(
        { _id: ObjectId(shopId) },
        { $pull: { followers: userId } }
      );

    return {
      status: true,
      message: "User unfollowed successfully",
    };
  } catch (error) {
    console.error("Error unfollowing user:", error);
    return {
      status: false,
      message: "Error unfollowing user",
      error: error.message,
    };
  }
};


const checkfollow = async (userId, shopId) => {
  try {
    const { ObjectId } = require('mongodb');
//console.log(userId)
    const user = await MongoDB.db
      .collection(mongoConfig.collections.USERS)
      .findOne({ _id: ObjectId(userId) });

    if (!user) {
      return {
        status: false,
        message: "User not found",
      };
    }

    const isFollowing = user.following.includes(shopId);

    return {
      status: true,
      isFollowing: isFollowing,
    };
  } catch (error) {
    console.error("Error checking follow:", error);
    return {
      status: false,
      message: "Error checking follow",
      error: error.message,
    };
  }
};

 


module.exports = { createfollow ,unfollowUser,checkfollow};
