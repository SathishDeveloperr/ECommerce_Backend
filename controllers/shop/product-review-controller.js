const Order = require("../../models/Order");
const Product = require("../../models/Product");
const ProductReview = require("../../models/Review");

const jwt = require("jsonwebtoken"); // Ensure you import jwt

const addProductReview = async (req, res) => {
  try {
    const { productId, userName, reviewMessage, reviewValue } = req.body;

    // Retrieve the token from cookies
    const token = req.cookies.token;

    if (!token) {
      return res.status(401).json({
        success: false,
        message: "Authentication token is missing!",
      });
    }

    // Verify and decode the token to get the userId
    let userId;
    try {
      const decoded = jwt.verify(token, process.env.JWT_SECRET || "your_secret_key"); // Use environment variable for the secret key
      userId = decoded.id; // Ensure 'id' exists in the token payload
    } catch (err) {
      console.error("Token verification failed:", err);
      return res.status(403).json({
        success: false,
        message: "Invalid or expired token!",
      });
    }

    // Check if the user has purchased the product before allowing review
    const order = await Order.findOne({
      userId,
      "cartItems.productId": productId,
    });

    if (!order) {
      return res.status(403).json({
        success: false,
        message: "You need to purchase the product to review it.",
      });
    }

    // Check if the user has already reviewed this product
    const checkExistingReview = await ProductReview.findOne({
      productId,
      userId,
    });

    if (checkExistingReview) {
      return res.status(400).json({
        success: false,
        message: "You already reviewed this product!",
      });
    }

    // Create the new review
    const newReview = new ProductReview({
      productId,
      userId,
      userName,
      reviewMessage,
      reviewValue,
    });

    await newReview.save();

    // Recalculate the average review for the product
    const reviews = await ProductReview.find({ productId });
    const totalReviewsLength = reviews.length;
    const averageReview =
      reviews.reduce((sum, reviewItem) => sum + reviewItem.reviewValue, 0) /
      totalReviewsLength;

    await Product.findByIdAndUpdate(productId, { averageReview });

    // Respond with the new review data
    res.status(201).json({
      success: true,
      data: newReview,
    });
  } catch (e) {
    console.log(e);
    res.status(500).json({
      success: false,
      message: "Error",
    });
  }
};


const getProductReviews = async (req, res) => {
  try {
    const { productId } = req.params;

    const reviews = await ProductReview.find({ productId });
    res.status(200).json({
      success: true,
      data: reviews,
    });
  } catch (e) {
    console.log(e);
    res.status(500).json({
      success: false,
      message: "Error",
    });
  }
};

module.exports = { addProductReview, getProductReviews };
