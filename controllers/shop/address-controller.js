const Address = require("../../models/Address");
const jwt = require("jsonwebtoken"); 

const addAddress = async (req, res) => {
  try {
    const { address, city, pincode, phone, notes } = req.body;

    // Retrieve the token from cookies
    const token = req.cookies.token;

    if (!token) {
      return res.status(401).json({
        success: false,
        message: "Authentication token is missing!",
      });
    }

    let userId;
    try {
      const decoded = jwt.verify(token, process.env.JWT_SECRET);
      userId = decoded.id; 
    } catch (err) {
      console.error("Token verification failed:", err);
      return res.status(403).json({
        success: false,
        message: "Invalid or expired token!",
      });
    }

    // Validate the required data
    if (!userId || !address || !city || !pincode || !phone || !notes) {
      return res.status(400).json({
        success: false,
        message: "Invalid data provided!",
      });
    }

    // Create a new address object with the extracted userId
    const newlyCreatedAddress = new Address({
      userId,
      address,
      city,
      pincode,
      notes,
      phone,
    });

    // Save the new address to the database
    await newlyCreatedAddress.save();

    // Send success response with the newly created address
    res.status(201).json({
      success: true,
      data: newlyCreatedAddress,
    });
  } catch (e) {
    console.log(e);
    res.status(500).json({
      success: false,
      message: "Error occurred while adding address",
    });
  }
};

const fetchAllAddress = async (req, res) => {
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
      const decoded = jwt.verify(token, process.env.JWT_SECRET || "your_secret_key"); // Use environment variable for the secret key
      userId = decoded.id; // Ensure 'id' exists in the token payload
    } catch (err) {
      console.error("Token verification failed:", err);
      return res.status(403).json({
        success: false,
        message: "Invalid or expired token!",
      });
    }

    // Fetch all addresses for the user
    const addressList = await Address.find({ userId });

    if (addressList.length === 0) {
      return res.status(404).json({
        success: false,
        message: "No addresses found for this user!",
      });
    }

    // Return the fetched addresses
    res.status(200).json({
      success: true,
      data: addressList,
    });
  } catch (e) {
    console.log(e);
    res.status(500).json({
      success: false,
      message: "Error occurred while fetching addresses",
    });
  }
};
const editAddress = async (req, res) => {
  try {
    const { addressId } = req.params; // No need for userId in params
    const formData = req.body;

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

    if (!addressId) {
      return res.status(400).json({
        success: false,
        message: "Address ID is required!",
      });
    }

    // Find and update the address for the user
    const address = await Address.findOneAndUpdate(
      {
        _id: addressId,
        userId,
      },
      formData,
      { new: true }
    );

    if (!address) {
      return res.status(404).json({
        success: false,
        message: "Address not found",
      });
    }

    res.status(200).json({
      success: true,
      data: address,
    });
  } catch (e) {
    console.log(e);
    res.status(500).json({
      success: false,
      message: "Error",
    });
  }
};

const deleteAddress = async (req, res) => {
  try {
    const { addressId } = req.params; // No need for userId in params

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

    if (!addressId) {
      return res.status(400).json({
        success: false,
        message: "Address ID is required!",
      });
    }

    // Find and delete the address for the user
    const address = await Address.findOneAndDelete({ _id: addressId, userId });

    if (!address) {
      return res.status(404).json({
        success: false,
        message: "Address not found",
      });
    }

    res.status(200).json({
      success: true,
      message: "Address deleted successfully",
    });
  } catch (e) {
    console.log(e);
    res.status(500).json({
      success: false,
      message: "Error",
    });
  }
};


module.exports = { addAddress, editAddress, fetchAllAddress, deleteAddress };
