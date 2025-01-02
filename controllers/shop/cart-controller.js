const Cart = require("../../models/Cart");
const Product = require("../../models/Product");

const jwt = require('jsonwebtoken');

const addToCart = async (req, res) => {
  try {
    const { productId, quantity } = req.body;


    const token = req.cookies.token; 

    if (!token) {
      return res.status(401).json({
        success: false,
        message: "Authentication token is missing!",
      });
    }

    // Verify and decode the token
    let userId;
    try {
      const decoded = jwt.verify(token, process.env.JWT_SECRET); 
      
      userId = decoded.id; 
    } catch (err) {
      return res.status(403).json({
        success: false,
        message: "Invalid or expired token!",
      });
    }

    console.log(userId);
    

    if (!userId || !productId || quantity <= 0) {
      return res.status(400).json({
        success: false,
        message: "Invalid data provided!",
      });
    }

    const product = await Product.findById(productId);

    if (!product) {
      return res.status(404).json({
        success: false,
        message: "Product not found",
      });
    }

    let cart = await Cart.findOne({ userId });

    if (!cart) {
      cart = new Cart({ userId, items: [] });
    }

    const findCurrentProductIndex = cart.items.findIndex(
      (item) => item.productId.toString() === productId
    );

    if (findCurrentProductIndex === -1) {
      cart.items.push({ productId, quantity });
    } else {
      cart.items[findCurrentProductIndex].quantity += quantity;
    }

    await cart.save();
    res.status(200).json({
      success: true,
      data: cart,
    });
  } catch (error) {
    console.log(error);
    res.status(500).json({
      success: false,
      message: "Error",
    });
  }
};


const fetchCartItems = async (req, res) => {
  try {
    // Retrieve the token from cookies
    const token = req.cookies.token;

    if (!token) {
      return res.status(401).json({
        success: false,
        message: "Authentication token is missing!",
      });
    }

    // Verify and decode the token
    let userId;
    try {
      const decoded = jwt.verify(token, process.env.JWT_SECRET || 'your_secret_key'); // Use env variable for the secret key
      userId = decoded.id; // Ensure 'id' exists in the token payload
    } catch (err) {
      console.error("Token verification failed:", err);
      return res.status(403).json({
        success: false,
        message: "Invalid or expired token!",
      });
    }

    if (!userId) {
      return res.status(400).json({
        success: false,
        message: "User ID is mandatory!",
      });
    }

    // Fetch cart items for the user
    const cart = await Cart.findOne({ userId }).populate({
      path: "items.productId",
      select: "image title price salePrice",
    });

    if (!cart) {
      return res.status(404).json({
        success: false,
        message: "Cart not found!",
      });
    }

    // Filter out invalid items
    const validItems = cart.items.filter(
      (productItem) => productItem.productId
    );

    // Save updated cart if invalid items were found
    if (validItems.length < cart.items.length) {
      cart.items = validItems;
      await cart.save();
    }

    // Format cart items for the response
    const populateCartItems = validItems.map((item) => ({
      productId: item.productId._id,
      image: item.productId.image,
      title: item.productId.title,
      price: item.productId.price,
      salePrice: item.productId.salePrice,
      quantity: item.quantity,
    }));

    // Send success response with cart details
    res.status(200).json({
      success: true,
      data: {
        ...cart._doc,
        items: populateCartItems,
      },
    });
  } catch (error) {
    console.error("Error in fetchCartItems:", error);
    res.status(500).json({
      success: false,
      message: "An internal server error occurred",
    });
  }
};
const updateCartItemQty = async (req, res) => {
  try {
    const { productId, quantity } = req.body;

    // Retrieve the token from cookies
    const token = req.cookies.token;

    if (!token) {
      return res.status(401).json({
        success: false,
        message: "Authentication token is missing!",
      });
    }

    // Verify and decode the token
    let userId;
    try {
      const decoded = jwt.verify(token, process.env.JWT_SECRET); 
      userId = decoded.id; // Ensure 'id' exists in the token payload
    } catch (err) {
      console.error("Token verification failed:", err);
      return res.status(403).json({
        success: false,
        message: "Invalid or expired token!",
      });
    }

    // Validate the required data
    if (!userId || !productId || quantity <= 0) {
      return res.status(400).json({
        success: false,
        message: "Invalid data provided!",
      });
    }

    // Find the cart for the user
    const cart = await Cart.findOne({ userId });
    if (!cart) {
      return res.status(404).json({
        success: false,
        message: "Cart not found!",
      });
    }

    // Find the index of the product in the cart
    const findCurrentProductIndex = cart.items.findIndex(
      (item) => item.productId.toString() === productId
    );

    if (findCurrentProductIndex === -1) {
      return res.status(404).json({
        success: false,
        message: "Cart item not present!",
      });
    }

    // Update the quantity of the product
    cart.items[findCurrentProductIndex].quantity = quantity;
    await cart.save();

    // Populate the product details
    await cart.populate({
      path: "items.productId",
      select: "image title price salePrice",
    });

    // Format the cart items for the response
    const populateCartItems = cart.items.map((item) => ({
      productId: item.productId ? item.productId._id : null,
      image: item.productId ? item.productId.image : null,
      title: item.productId ? item.productId.title : "Product not found",
      price: item.productId ? item.productId.price : null,
      salePrice: item.productId ? item.productId.salePrice : null,
      quantity: item.quantity,
    }));

    // Send success response with updated cart details
    res.status(200).json({
      success: true,
      data: {
        ...cart._doc,
        items: populateCartItems,
      },
    });
  } catch (error) {
    console.error("Error in updateCartItemQty:", error);
    res.status(500).json({
      success: false,
      message: "An internal server error occurred",
    });
  }
};



const deleteCartItem = async (req, res) => {
  try {
    const { productId } = req.body;

    // Retrieve the token from cookies
    const token = req.cookies.token;

    if (!token) {
      return res.status(401).json({
        success: false,
        message: "Authentication token is missing!",
      });
    }

    // Verify and decode the token
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

    // Validate the required data
    if (!userId || !productId) {
      return res.status(400).json({
        success: false,
        message: "Invalid data provided!",
      });
    }

    // Find the cart for the user
    const cart = await Cart.findOne({ userId }).populate({
      path: "items.productId",
      select: "image title price salePrice",
    });

    if (!cart) {
      return res.status(404).json({
        success: false,
        message: "Cart not found!",
      });
    }

    // Filter out the product to delete
    cart.items = cart.items.filter(
      (item) => item.productId._id.toString() !== productId
    );

    await cart.save();

    // Populate the product details
    await cart.populate({
      path: "items.productId",
      select: "image title price salePrice",
    });

    // Format the cart items for the response
    const populateCartItems = cart.items.map((item) => ({
      productId: item.productId ? item.productId._id : null,
      image: item.productId ? item.productId.image : null,
      title: item.productId ? item.productId.title : "Product not found",
      price: item.productId ? item.productId.price : null,
      salePrice: item.productId ? item.productId.salePrice : null,
      quantity: item.quantity,
    }));

    // Send success response with updated cart details
    res.status(200).json({
      success: true,
      data: {
        ...cart._doc,
        items: populateCartItems,
      },
    });
  } catch (error) {
    console.error("Error in deleteCartItem:", error);
    res.status(500).json({
      success: false,
      message: "An internal server error occurred",
    });
  }
};
module.exports = {
  addToCart,
  updateCartItemQty,
  deleteCartItem,
  fetchCartItems,
};
