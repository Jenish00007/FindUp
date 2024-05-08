const { mongoConfig } = require("../config");
const MongoDB = require("./mongodb.service");


const getAllSliders = async () => {
  try {
    let sliders = await MongoDB.db
      .collection(mongoConfig.collections.SLIDERS)
      .find()
      .toArray();

    if (sliders && sliders?.length > 0) {
      return {
        status: true,
        message: "sliders found successfully",
        sliders,
      };
    } else {
      return {
        status: false,
        message: "No sliders found",
      };
    }
  } catch (error) {
    return {
      status: false,
      message: "sliders finding failed",
      error: `sliders finding failed : ${error?.message}`,
    };
  }
};

module.exports = { getAllSliders };
