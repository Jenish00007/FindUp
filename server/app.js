var createError = require("http-errors");
var express = require("express");
var path = require("path");
var cookieParser = require("cookie-parser");
var logger = require("morgan");
var cors = require("cors"); // Import the CORS middleware
var indexRouter = require("./routes/index");
var authenticationRouter = require("./routes/authentication");
var userRouter = require("./routes/user.route");
var orderRouter = require("./routes/order.route");
var shopRouter = require("./routes/shop.route");
var cartRouter = require("./routes/cart.route");
var chatRouter = require("./routes/chat.route");
var favouriteRouter = require("./routes/favourite.route");
var productRouter = require("./routes/product.route");
var bookmarkRouter = require("./routes/bookmark.route");
var subCategoriesRouter = require("./routes/subCategories.route");
var categoriesRouter = require("./routes/categories.route");
var slidersRouter = require("./routes/sliders.route");
var followRouter = require("./routes/follow.route");

const MongoDB = require("./services/mongodb.service");
const multer = require('multer');
const { mongoConfig } = require("../server/config");
MongoDB.connectToMongoDB();
// Import necessary modules or dependencies
const { ObjectId } = require("mongodb");

var app = express();

// Use CORS middleware to allow requests from all origins
app.use(cors());

// view engine setup
app.set("views", path.join(__dirname, "views"));
app.set("view engine", "jade");

app.use(logger("dev"));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static("static"));

app.use("/", indexRouter);
app.use("/api", authenticationRouter);
app.use("/api/user", userRouter);
app.use("/api/order", orderRouter);
app.use("/api/shop", shopRouter);
app.use("/api/cart", cartRouter);
app.use("/api/chat", chatRouter);
app.use("/api/favourite", favouriteRouter);
app.use("/api/follow", followRouter);
app.use("/api/products", productRouter);
app.use("/api/bookmark", bookmarkRouter);
app.use("/api/subCategories", subCategoriesRouter);
app.use("/api/categories", categoriesRouter);
app.use("/api/sliders", slidersRouter);
app.use(express.static('./'));



// use multer package
let storage = multer.diskStorage({
    destination: (req, file, cb) => {
        cb(null, './Images');
    },
    filename: (req, file, cb) => {
        cb(null, file.fieldname + '_' + Date.now() + path.extname(file.originalname));
    }
});



let maxSize = 10 * 1000 * 1000;
let upload = multer({
    storage: storage,
    limits: {
        fileSize: maxSize
    }
});


app.post('/api/shop/shopregister', upload.single('shopLogo'), async (req, res) => {
    try {
        if (!req.file) {
            return res.status(400).json({ error: 'No file uploaded' });
        }

        const {
            shopName,
            shopVerificationId,
            shopMobileNumber,
            location_latitude,
            location_longitude,
            shopAddress,
            userId
        } = req.body;

        const imagePath = req.file.path;
        const latitude = parseFloat(location_latitude);
        const longitude = parseFloat(location_longitude);
        const formData = {
            shopName: shopName,
            shopVerificationId: shopVerificationId,
            shopMobileNumber: shopMobileNumber,
            shopAddress:shopAddress,
            location: {
                latitude,
                longitude
            },
            shopLogo: {
                url: imagePath
            },
            userId: userId,
        }

        const savedUser = await MongoDB.db
            .collection(mongoConfig.collections.SHOPS)
            .insertOne(formData);

        if (savedUser.insertedId) {
            res.status(200).json({
                status: true,
                message: "Shop Created successfully",
            });
        } else {
            res.status(500).json({
                status: false,
                message: "Shop Creating failed",
            });
        }
    } catch (error) {
        console.error("Error creating shop:", error);
        res.status(500).json({
            status: false,
            message: "An error occurred while creating the shop",
        });
    }
});
//end shop function

let storage_Product = multer.diskStorage({
    destination: (req, file, cb) => {
        cb(null, './Products');
    },
    filename: (req, file, cb) => {
        cb(null, file.fieldname + '_' + Date.now() + path.extname(file.originalname));
    }
});

let upload_Product = multer({
    storage: storage_Product,
    limits: {
        fileSize: maxSize
    }
});


app.post('/api/product/add_product', upload_Product.single('Product_Image'), async (req, res) => {
    try {
        if (!req.file) {
            return res.status(400).json({ error: 'No file uploaded' });
        }

        const {
            name,
            price,
            description,
            shopId,
            categoryId,
            subCategoryId
        } = req.body;

        const imagePath = req.file.path;
        //console.log(imagePath)
        const productStatus = '';
        const createdAt = new Date(); // Get current date and time
        const productprice = parseFloat(price);
        const formData = {
            name,
            price: productprice,
            description,
            images: [{ url: imagePath }],
            shopId,
            categoryId,
            subCategoryId,
            createdAt,
            productStatus
        }
        //console.log(formData)
        const savedUser = await MongoDB.db
            .collection(mongoConfig.collections.PRODUCTS)
            .insertOne(formData);

        if (savedUser.insertedId) {
            res.status(200).json({
                status: true,
                message: "PRODUCTS Added successfully",
            });
        } else {
            res.status(500).json({
                status: false,
                message: "PRODUCTS Creating failed",
            });
        }
    } catch (error) {
        console.error("Error creating PRODUCTS:", error);
        res.status(500).json({
            status: false,
            message: "An error occurred while creating the PRODUCTS",
        });
    }
});





// Create subscription checkout session endpoint
app.post("/api/v1/create-subscription-checkout-session", async (req, res) => {
    const { Plan, LoginedUserId, transactionId } = req.body;
    const createdAt = new Date();

    let planPrice = null;
    if (Plan === "Basic") {
        planPrice = 99;
    } else if (Plan === "Standard") {
        planPrice = 499;
    }

    // Define the data to be inserted into the database
    const formData = {
        plan: Plan,
        userId: LoginedUserId,
        transactionId: transactionId,
        createdAt: createdAt,
        planPrice: planPrice,
        status:''
    };

    try {
        // Insert the data into the database
        const savedOrder = await MongoDB.db
            .collection(mongoConfig.collections.ORDERS)
            .insertOne(formData);

        // Respond with the saved order data
        res.status(201).json(savedOrder);
    } catch (error) {
        // If there's an error, respond with an error message
        console.error("Error saving order:", error);
        res.status(500).json({ error: "Failed to save order" });
    }
});


app.post("/api/get_subscription/check", async (req, res) => {
    const { LoginedUserId } = req.body;
    try {
        // Get the latest subscription status
        const latestSubscription = await MongoDB.db
            .collection(mongoConfig.collections.ORDERS)
            .findOne({ userId: LoginedUserId }, { sort: { createdAt: -1 } });

        // If there's no subscription or the latest subscription is not active, return false
        if (!latestSubscription || latestSubscription.status !== 'active') {
            return res.status(200).json({ status: false });
        }

        // If the subscription is active and it's been a year since creation, update status to inactive
        const creationDate = new Date(latestSubscription.createdAt);
        const currentDate = new Date();
        const oneYear = 365 * 24 * 60 * 60 * 1000; // One year in milliseconds
        if (currentDate - creationDate >= oneYear) {
            await MongoDB.db
                .collection(mongoConfig.collections.ORDERS)
                .updateOne(
                    { _id: latestSubscription._id },
                    { $set: { status: 'inactive' } }
                );
            return res.status(200).json({ status: false }); // Return false as status is now inactive
        }

        // Otherwise, return true
        res.status(200).json({ status: true });
    } catch (error) {
        // If there's an error, respond with an error message
        console.error("Error checking subscription:", error);
        res.status(500).json({ error: "Failed to check subscription" });
    }
});

app.post("/api/v1/create-onbook", async (req, res) => {
    const { LoginedUserId, productId } = req.body;
    const createdAt = new Date();
// Generate booking code
const bookingCode = generateBookingCode();
    // Define the data to be inserted into the database
    const formData = {
        userId: LoginedUserId,
        productId: productId,
        createdAt: createdAt,
        status:'PENDING',
        bookingCodes: bookingCode 
    };

    try {
        // Insert the data into the database
        const savedOrder = await MongoDB.db
            .collection(mongoConfig.collections.BOOKINGS)
            .insertOne(formData);

        // Respond with the saved order data
        res.status(201).json(savedOrder);
    } catch (error) {
        // If there's an error, respond with an error message
        console.error("Error saving order:", error);
        res.status(500).json({ error: "Failed to save order" });
    }
});

// Define a function to generate a 4-digit random code
const generateBookingCode = () => {
    // Generate a random 4-digit code
    const code = Math.floor(1000 + Math.random() * 9000);
    return code.toString(); // Convert it to string
};

// Get the latest products
app.get('/api/product/latest', async (req, res) => {
    try {
        const product = await MongoDB.db
            .collection(mongoConfig.collections.PRODUCTS)
            .find()
            .sort({ createdAt: -1 }) // Sort by createdAt in descending order to get the latest products first
            .limit(10) // Limit to the latest 10 products
            .toArray();

        res.status(200).json({
            status: true,
            message: "Latest products retrieved successfully",
            product
        });

    } catch (error) {
        console.error("Error retrieving latest products:", error);
        res.status(500).json({
            status: false,
            message: "An error occurred while retrieving latest products",
            error: error.message
        });
    }
});

// Get the trending products
app.get('/api/product/trending', async (req, res) => {
    try {
        const product = await MongoDB.db
            .collection(mongoConfig.collections.PRODUCTS)
            .find({ productStatus: "Trending" }) // Filter by productStatus "Trending"
            .sort({ createdAt: -1 }) // Sort by createdAt in descending order to get the latest trending products first
            .limit(10) // Limit to the latest 10 trending products
            .toArray();

        res.status(200).json({
            status: true,
            message: "Trending products retrieved successfully",
            product
        });
        //console.log(product,'backend')
    } catch (error) {
        console.error("Error retrieving trending products:", error);
        res.status(500).json({
            status: false,
            message: "An error occurred while retrieving trending products",
            error: error.message
        });
    }
});

// Define the route to calculate the distance
const haversine = require('haversine-distance');




app.post('/api/calculate-distance', async (req, res) => {
    const { latitude, longitude, maxDistance } = req.body;

    if (!latitude || !longitude) {
        return res.status(400).json({
            status: false,
            message: "Latitude and longitude are required"
        });
    }

    if (maxDistance === undefined) {
        return res.status(400).json({
            status: false,
            message: "maxDistance is required"
        });
    }

    try {
        const shops = await MongoDB.db
            .collection(mongoConfig.collections.SHOPS)
            .find()
            .toArray();

        const nearbyShops = shops.map(shop => {
            if (shop.location && shop.location.latitude && shop.location.longitude) {
                const shopLocation = {
                    lat: shop.location.latitude,
                    lon: shop.location.longitude
                };

                const userLocation = {
                    lat: latitude,
                    lon: longitude
                };

                const distance = haversine(userLocation, shopLocation);

                return {
                    ...shop, // spread the shop object to include all its properties
                    distance: Math.round(distance),
                };
            } else {
                return null;
            }
        }).filter(shop => shop !== null && shop.distance <= maxDistance);

        nearbyShops.sort((a, b) => a.distance - b.distance);

        res.status(200).json({
            status: true,
            message: "Nearby shops retrieved successfully",
            shops: nearbyShops
        });
    } catch (error) {
        console.error("Error retrieving nearby shops:", error);
        res.status(500).json({
            status: false,
            message: "An error occurred while retrieving nearby shops",
            error: error.message
        });
    }
});



module.exports = app;