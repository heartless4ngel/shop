const path = require("path");

const express = require("express");

const adminController = require("../controllers/admin");
const isAuth = require("../middleware/is-auth.js");
const validator = require("../utils/validators.js");

const router = express.Router();
router.use(isAuth);
// /admin/add-product => GET
router.get("/add-product", adminController.getAddProduct);
// /admin/products => GET
router.get("/products", adminController.getProducts);
router.get("/edit-product/:productId", adminController.getEditProduct);
// /admin/add-product => POST
router.post(
  "/add-product",
  validator.addProductValidator,
  adminController.postAddProduct
);
router.post(
  "/edit-product",
  validator.editProductValidator,
  adminController.postEditProduct
);
router.post("/delete-product", adminController.postDeleteProduct);

module.exports = router;
