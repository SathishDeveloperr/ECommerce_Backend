const express = require("express");
const mongoose = require("mongoose");
const cookieParser = require("cookie-parser");
const cors = require("cors");
const cloudinary=require("cloudinary");
const authRouter = require("./routes/auth/auth-routes");
const adminProductsRouter = require("./routes/admin/products-routes");
const adminOrderRouter = require("./routes/admin/order-routes");

const shopProductsRouter = require("./routes/shop/products-routes");
const shopCartRouter = require("./routes/shop/cart-routes");
const shopAddressRouter = require("./routes/shop/address-routes");
const shopOrderRouter = require("./routes/shop/order-routes");
const shopSearchRouter = require("./routes/shop/search-routes");
const shopReviewRouter = require("./routes/shop/review-routes");

const commonFeatureRouter = require("./routes/common/feature-routes");
require("dotenv").config();

cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});

const mongoUri = process.env.MONGO_URI ;

if (!mongoUri) {
  console.error("Error: MONGO_URI is not defined in the environment variables.");
  process.exit(1); // Exit the application with an error code
}

mongoose
  .connect(mongoUri)
  .then(() => console.log("MongoDB connected"))
  .catch((error) => console.error("MongoDB connection error:", error));


const app = express();
const PORT = process.env.PORT;

app.use(cors({
  origin: '*', 
  methods: 'GET,POST,PUT,DELETE', 
  credentials: true, 
}));


app.use(cookieParser());
app.use(express.json());
app.use("/api/auth", authRouter);  //completed
app.use("/api/admin/products", adminProductsRouter); //completed
app.use("/api/admin/orders", adminOrderRouter); //Pending

app.use("/api/shop/products", shopProductsRouter); //completed
app.use("/api/shop/cart", shopCartRouter); //completed
app.use("/api/shop/address", shopAddressRouter); //completed
app.use("/api/shop/order", shopOrderRouter);  //Pending
app.use("/api/shop/search", shopSearchRouter); //Completed
app.use("/api/shop/review", shopReviewRouter); //

app.use("/api/common/feature", commonFeatureRouter);

app.listen(PORT, () => console.log(`Server is now running on port ${PORT}`));
