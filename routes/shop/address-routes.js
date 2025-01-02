const express = require("express");

const {
  addAddress,
  fetchAllAddress,
  editAddress,
  deleteAddress,
} = require("../../controllers/shop/address-controller");

const router = express.Router();

router.post("/add", addAddress);
router.get("/get", fetchAllAddress);
router.delete("/delete/:addressId", deleteAddress);
router.put("/update/:addressId", editAddress);

module.exports = router;
