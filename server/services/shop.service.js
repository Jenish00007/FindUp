const { mongoConfig } = require("../config");
const MongoDB = require("./mongodb.service");
const { ObjectId } = require('mongodb');
const multer = require('multer');

const getAllShop = async () => {
  try {
    let shop = await MongoDB.db
      .collection(mongoConfig.collections.SHOPS)
      .find()
      .toArray();

    if (shop && shop?.length > 0) {
      return {
        status: true,
        message: "Shops found successfully",
        shop,
      };
    } else {
      return {
        status: false,
        message: "No Shops found",
      };
    }
  } catch (error) {
    return {
      status: false,
      message: "Shops finding failed",
      error: `Shops finding failed : ${error?.message}`,
    };
  }
};

const getOneShopById = async (shopId) => {
  try {
    const objectId = new ObjectId(shopId);
    let shop = await MongoDB.db
      .collection(mongoConfig.collections.SHOPS)
      .aggregate([
        {
          $match: {
            _id: objectId,
          },
        },
        {
          $lookup: {
            from: "products",
            localField: "_id",
            foreignField: "shopId",
            as: "products",
          },
        },
      ])
      .toArray();
    if (shop && shop?.length > 0) {
      return {
        status: true,
        message: "Shops found successfully",
        shop,
      };
    } else {
      return {
        status: false,
        message: "No Shops found",
      };
    }
  } catch (error) {
    return {
      status: false,
      message: "Shops finding failed",
      error: `Shops finding failed : ${error?.message}`,
    };
  }
};

const FILE_TYPE_MAP = {
  'image/png': 'png',
  'image/jpeg': 'jpeg',
  'image/jpg': 'jpg'
}

const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    const isValid = FILE_TYPE_MAP[file.mimetype];
    let uploadError = new Error('invalid image type');

    if (isValid) {
      uploadError = null
    }
    cb(uploadError, 'public/uploads')
  },
  filename: function (req, file, cb) {

    const fileName = file.originalname.split(' ').join('-');
    const extension = FILE_TYPE_MAP[file.mimetype];
    cb(null, `${fileName}-${Date.now()}.${extension}`)
  }
})

const uploadOptions = multer({ storage: storage }).single('shopLogo');

const shopRegister = async (shopData) => {
  try {
    uploadOptions(shopData, async function (err) {
      if (err) {
        console.error(err);
        return {
          status: false,
          message: "File upload failed"
        };
      }
      
      const shopData = shopData; // Assuming shopData is sent in the request body
      const file = shopData.file; // Assuming file is uploaded using multer

      if (
        !shopData?.shopName ||
        !shopData?.shopVerificationId ||
        !shopData?.shopMobileNumber ||
        !file ||
        !shopData?.userId ||
        !shopData?.location
      ) {
        return { status: false, message: "Please fill up all the fields" };
      }

      const fileName = file.filename; // Assuming multer saves filename in file.filename
      const basePath = '../public/user/uploads'; // Assuming base path for file storage
      const imagePath = `${basePath}/${fileName}`;

      const userObject = {
        shopName: shopData.shopName,
        shopVerificationId: shopData.shopVerificationId,
        shopMobileNumber: shopData.shopMobileNumber,
        shopLogo: imagePath,
        userId: shopData.userId,
        location: shopData.location
      };

      const savedUser = await MongoDB.db
        .collection(mongoConfig.collections.SHOPS)
        .insertOne(userObject);

      if (savedUser.insertedId) {
        return {
          status: true,
          message: "Shop Created successfully",
        };
      } else {
        return {
          status: false,
          message: "Shop Creating failed",
        };
      }
    });
  } catch (error) {
    console.error(error);
    let errorMessage = "Shop Creating failed";
    if (error.code === 11000 && error.keyPattern.shopVerificationId) {
      errorMessage = "shopVerificationId already exists";
    } else if (error.code === 11000 && error.keyPattern.shopMobileNumber) {
      errorMessage = "shopMobileNumber already exists";
    }

    return {
      status: false,
      message: errorMessage,
      error: error.toString(),
    };
  }
};


module.exports = { getAllShop, getOneShopById,shopRegister };
