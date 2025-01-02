const cloudinary = require('cloudinary').v2;

// Initialize Cloudinary with environment variables

console.log(process.env.CLOUDINARY_API_KEY);




async function imageUploadUtil(filePath) {
  try {
    const result = await cloudinary.uploader.upload(filePath, {
      resource_type: 'auto',  
    });
    return result;  
  } catch (error) {
    console.error('Error uploading image:', error);
    throw error; 
  }
}

module.exports = { imageUploadUtil };
