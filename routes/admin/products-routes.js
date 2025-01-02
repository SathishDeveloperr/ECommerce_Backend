const express = require("express");
const router = express.Router();
const { imageUploadUtil } = require("../../helpers/cloudinary");
const upload = require("../../helpers/multer");

const productActions = require("../../controllers/admin/productContoller");

router.post('/add', upload.single('image'), productActions.SaveProduct);

router.put('/update/:productId', upload.single('image'), productActions.UpdateProduct);

router.get('/', productActions.ViewAllProducts);

router.get('/:productId', productActions.ViewProductById);

router.delete('/:productId', productActions.DeleteProduct);

module.exports = router;
