const { mongoConfig } = require("../config");
const MongoDB = require("./mongodb.service");
const { ObjectId } = require('mongodb');
const multer = require('multer');
const fs = require('fs');


const getAllProducts = async () => {
  try {
    let products = await MongoDB.db
      .collection(mongoConfig.collections.PRODUCTS)
      .find()
      .toArray();

    if (products && products.length > 0) {
      return {
        status: true,
        message: "Products found successfully",
        products,
      };
    } else {
      return {
        status: false,
        message: "No products found",
      };
    }
  } catch (error) {
    return {
      status: false,
      message: "Failed to find products",
      error: `Error finding products: ${error.message}`,
    };
  }
};

const getOneProductsById = async (productId) => {
  try {
    const objectId = new ObjectId(productId);
    let product = await MongoDB.db
      .collection(mongoConfig.collections.PRODUCTS)
      .findOne({ _id: objectId });

    if (product) {
      return {
        status: true,
        message: "Product found successfully",
        product,
      };
    } else {
      return {
        status: false,
        message: "No product found with the given ID",
      };
    }
  } catch (error) {
    return {
      status: false,
      message: "Failed to find product",
      error: `Error finding product: ${error.message}`,
    };
  }
};

const deleteOneProductsById = async (productId) => {
  try {
    //console.log(productId,'hg')
    const objectId = new ObjectId(productId);
    let product = await MongoDB.db
      .collection(mongoConfig.collections.PRODUCTS)
      .findOneAndDelete({ _id: objectId });

    if (product.value) {
      // Assume the image path is stored in the product document
      const imagePath = product.value.imagePath;

      // Delete the image file
      fs.unlink(imagePath, (err) => {
        if (err) {
          console.error('Error deleting image:', err);
        } else {
          console.log('Image deleted successfully:', imagePath);
        }
      });

      return {
        status: true,
        message: "Product deleted successfully",
        product: product.value,
      };
    } else {
      return {
        status: false,
        message: "No product found with the given ID",
      };
    }
  } catch (error) {
    return {
      status: false,
      message: "Failed to delete product",
      error: `Error deleting product: ${error.message}`,
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
      uploadError = null;
    }
    cb(uploadError, 'public/uploads');
  },
  filename: function (req, file, cb) {
    const fileName = file.originalname.split(' ').join('-');
    const extension = FILE_TYPE_MAP[file.mimetype];
    cb(null, `${fileName}-${Date.now()}.${extension}`);
  }
});

const upload = multer({ storage: storage }).single('image');

const AddProduct = async (req, res) => {
  try {
    upload(req, res, async function (err) {
      if (err) {
        console.error(err);
        return {
          status: false,
          message: "File upload failed"
        };
      }

      // File upload successful, now proceed to add product
      const { name, price, description, shopId, categoryId, subCategoryId } = req.body;
      const imagePath = req.file.path;

      const productObject = {
        name,
        price,
        description,
        images: imagePath,
        shopId,
        categoryId,
        subCategoryId,
      };

      // MongoDB insert operation
      let savedProduct = await MongoDB.db
        .collection(mongoConfig.collections.PRODUCTS)
        .insertOne(productObject);

      if (savedProduct?.acknowledged && savedProduct?.insertedId) {
        return {
          status: true,
          message: "Product added successfully",
        };
      } else {
        return {
          status: false,
          message: "Product adding failed",
        };
      }
    });
  } catch (error) {
    console.error(error);

    let errorMessage = "Product adding failed";

    return {
      status: false,
      message: errorMessage,
      error: error?.toString(),
    };
  }
};

module.exports = { getOneProductsById, getAllProducts, AddProduct ,deleteOneProductsById};
