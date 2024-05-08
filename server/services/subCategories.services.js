const { mongoConfig } = require("../config");
const MongoDB = require("./mongodb.service");
const { ObjectId } = require('mongodb');

const getAllSubCategories = async () => {
  try {
    let subCategorie = await MongoDB.db
      .collection(mongoConfig.collections.SUBCATEGORIES)
      .find()
      .toArray();

    if (subCategorie && subCategorie?.length > 0) {
      return {
        status: true,
        message: "subCategories found successfully",
        subCategorie,
      };
    } else {
      return {
        status: false,
        message: "No subCategories found",
      };
    }
  } catch (error) {
    return {
      status: false,
      message: "subCategories finding failed",
      error: `subCategories finding failed : ${error?.message}`,
    };
  }
};




const getOneSubCategoriesById = async (subcategoriesId) => {
  try {
    // Convert userId to ObjectId
    const objectId = new ObjectId(subcategoriesId);

    // Find user by ObjectId
    let subCategorie = await MongoDB.db
      .collection(mongoConfig.collections.SUBCATEGORIES)
      .findOne({ _id: objectId });

    if (subCategorie) {
      return {
        status: true,
        message: "subCategorie found successfully",
        subCategorie,
      };
    } else {
      return {
        status: false,
        message: "No subCategorie found with the given ID",
      };
    }
  } catch (error) {
    return {
      status: false,
      message: "Failed to find subCategorie",
      error: `Error finding subCategorie: ${error.message}`,
    };
  }
};
module.exports = { getAllSubCategories ,getOneSubCategoriesById};
