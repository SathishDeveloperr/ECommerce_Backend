const { imageUploadUtil } = require("../../helpers/cloudinary");
const Product = require("../../models/Product");  // Assuming this is the path to your model

const SaveProduct = async (req, res) => {
  if (!req.file) {
    return res.status(400).json({
      success: false,
      message: 'No file uploaded',
    });
  }

  try {
    const result = await imageUploadUtil(req.file.path);
    const imageUrl = result.secure_url;
    const productData = {
      image: imageUrl,
      title: req.body.title,
      description: req.body.description,
      category: req.body.category,
      brand: req.body.brand,
      price: req.body.price,
      salePrice: req.body.salePrice,
      totalStock: req.body.totalStock,
      averageReview: req.body.averageReview || 0, 
    };

    const newProduct = new Product(productData);
    await newProduct.save();

    return res.status(200).json({
      success: true,
      message: 'Product uploaded and saved successfully',
      product: newProduct, 
    });
  } catch (err) {
    console.error('Error uploading image:', err);
    return res.status(500).json({
      success: false,
      message: 'Error uploading product',
    });
  }
};


const UpdateProduct = async (req, res) => {
    const { productId } = req.params;
  
    try {
      const product = await Product.findById(productId);
  
      if (!product) {
        return res.status(404).json({
          success: false,
          message: 'Product not found',
        });
      }
  
      // If a new file is uploaded, update the image URL
      let imageUrl = product.image; // Keep the existing image if no new one is uploaded
      if (req.file) {
        const result = await imageUploadUtil(req.file.path);
        imageUrl = result.secure_url;
      }
  
      product.image = imageUrl;
      product.title = req.body.title || product.title;
      product.description = req.body.description || product.description;
      product.category = req.body.category || product.category;
      product.brand = req.body.brand || product.brand;
      product.price = req.body.price || product.price;
      product.salePrice = req.body.salePrice || product.salePrice;
      product.totalStock = req.body.totalStock || product.totalStock;
      product.averageReview = req.body.averageReview || product.averageReview;
  
      await product.save();
  
      return res.status(200).json({
        success: true,
        message: 'Product updated successfully',
        product,
      });
    } catch (err) {
      console.error('Error updating product:', err);
      return res.status(500).json({
        success: false,
        message: 'Error updating product',
      });
    }
  };

  const DeleteProduct = async (req, res) => {
    const { productId } = req.params;
  
    try {
      const product = await Product.findByIdAndDelete(productId);
  
      if (!product) {
        return res.status(404).json({
          success: false,
          message: 'Product not found',
        });
      }
  
      return res.status(200).json({
        success: true,
        message: 'Product deleted successfully',
      });
    } catch (err) {
      console.error('Error deleting product:', err);
      return res.status(500).json({
        success: false,
        message: 'Error deleting product',
      });
    }
  };
  const ViewProductById = async (req, res) => {
    const { productId } = req.params;
  
    try {
      const product = await Product.findById(productId);
  
      if (!product) {
        return res.status(404).json({
          success: false,
          message: 'Product not found',
        });
      }
  
      return res.status(200).json({
        success: true,
        product,
      });
    } catch (err) {
      console.error('Error fetching product:', err);
      return res.status(500).json({
        success: false,
        message: 'Error fetching product',
      });
    }
  };
  const ViewAllProducts = async (req, res) => {
    try {
      const products = await Product.find();
      return res.status(200).json({
        success: true,
        products,
      });
    } catch (err) {
      console.error('Error fetching products:', err);
      return res.status(500).json({
        success: false,
        message: 'Error fetching products',
      });
    }
  };
      

  
  module.exports = {
    SaveProduct,
    UpdateProduct,
    ViewAllProducts,
    ViewProductById,
    DeleteProduct,
  };
  
