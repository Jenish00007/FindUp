const { mongoConfig } = require("../config");
const MongoDB = require("./mongodb.service");
const { ObjectId } = require('mongodb');

const getAllCategories = async () => {
  try {
    let categories = await MongoDB.db
      .collection(mongoConfig.collections.CATEGORIES)
      .find()
      .toArray();

    if (categories && categories?.length > 0) {
      return {
        status: true,
        message: "categories found successfully",
        categories,
      };
    } else {
      return {
        status: false,
        message: "No categories found",
      };
    }
  } catch (error) {
    return {
      status: false,
      message: "categories finding failed",
      error: `categories finding failed : ${error?.message}`,
    };
  }
};


const getOneCategoriesById = async (categoriesId) => {
  try {
    // Convert userId to ObjectId
    const objectId = new ObjectId(categoriesId);

    // Find user by ObjectId
    let categories = await MongoDB.db
      .collection(mongoConfig.collections.CATEGORIES)
      .findOne({ _id: objectId });

    if (categories) {
      return {
        status: true,
        message: "categories found successfully",
        categories,
      };
    } else {
      return {
        status: false,
        message: "No categories found with the given ID",
      };
    }
  } catch (error) {
    return {
      status: false,
      message: "Failed to find categories",
      error: `Error finding categories: ${error.message}`,
    };
  }
};
module.exports = { getAllCategories ,getOneCategoriesById};
