const { mongoConfig } = require("../config");
const MongoDB = require("./mongodb.service");
const { ObjectId } = require('mongodb');
const getAllUserData = async () => {
  try {
    let userObject = await MongoDB.db
      .collection(mongoConfig.collections.USERS)
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



const getOneUserById = async (userId) => {
  try {
    // Convert userId to ObjectId
    const objectId = new ObjectId(userId);

    // Find user by ObjectId
    let userObject = await MongoDB.db
      .collection(mongoConfig.collections.USERS)
      .findOne({ _id: objectId });

    if (userObject) {
      return {
        status: true,
        message: "User found successfully",
        userObject,
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
      message: "Failed to find user",
      error: `Error finding user: ${error.message}`,
    };
  }
};
module.exports = { getOneUserById,getAllUserData };
