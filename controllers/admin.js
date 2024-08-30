const { validationResult } = require("express-validator");
const Product = require("../models/product");
const CustomError = require("../utils/CustomError");
const fileHelper = require("../utils/file.js");

exports.getAddProduct = (req, res, next) => {
  res.render("admin/edit-product", {
    pageTitle: "Add Product",
    path: "/admin/add-product",
    editing: false,
    hasError: false,
    errorMessage: [],
    validationErrors: [],
  });
};

exports.postAddProduct = (req, res, next) => {
  const title = req.body.title;
  const image = req.file;
  const price = req.body.price;
  const description = req.body.description;
  const errors = validationResult(req);

  if (!errors.isEmpty()) {
    return res.status(422).render("admin/edit-product", {
      pageTitle: "Add Product",
      path: "/admin/add-product",
      editing: false,
      hasError: true,
      product: {
        title,
        price,
        description,
      },
      errorMessage: errors.array()[0].msg,
      validationErrors: errors.array(),
    });
  }

  const imageUrl = image.path;

  const product = new Product({
    title,
    price,
    description,
    imageUrl,
    userId: req.user,
  });
  product
    .save()
    .then(result => {
      console.log("PRODUCT CREATED!");
      res.redirect("/admin/products");
    })
    .catch(err => {
      return next(new CustomError(err.message));
    });
};

exports.getEditProduct = (req, res, next) => {
  const editMode = req.query.edit;
  if (!editMode) {
    return res.redirect("/");
  }
  const prodId = req.params.productId;
  Product.findById(prodId)
    .then(product => {
      if (!product) {
        return res.redirect("/");
      }
      res.render("admin/edit-product", {
        pageTitle: "Edit Product",
        path: "/admin/add-product",
        editing: editMode,
        product: product,
        hasError: false,
        errorMessage: [],
        validationErrors: [],
      });
    })
    .catch(err => {
      return next(new CustomError(err.message));
    });
};

exports.postEditProduct = (req, res, next) => {
  const prodId = req.body.productId;
  const updatedTitle = req.body.title;
  const updatedPrice = req.body.price;
  const image = req.file;
  const updatedDesc = req.body.description;

  const errors = validationResult(req);

  if (!errors.isEmpty()) {
    return res.status(422).render("admin/edit-product", {
      pageTitle: "Edit Product",
      path: "/admin/add-product",
      editing: true,
      hasError: true,
      product: {
        title: updatedTitle,
        price: updatedPrice,
        description: updatedDesc,
        _id: prodId,
      },
      errorMessage: errors.array()[0].msg,
      validationErrors: errors.array(),
    });
  }

  Product.findById(prodId)
    .then(product => {
      if (product.userId.toString() !== req.user._id.toString()) {
        return res.redirect("/");
      }
      product.title = updatedTitle;
      product.price = updatedPrice;
      product.description = updatedDesc;
      if (image) {
        product.imageUrl = image.path;
      }
      return product.save().then(result => {
        fileHelper.deleteFile(product.imageUrl);
        console.log("PRODUCT UPDATED!");

        res.redirect("/admin/products");
      });
    })
    .catch(err => {
      return next(new CustomError(err.message));
    });
};

exports.getProducts = (req, res, next) => {
  Product.find({
    userId: req.user._id,
  })
    // .select("titleprice -_id")
    // .populate("userId", "name")
    .then(products => {
      res.render("admin/products", {
        prods: products,
        pageTitle: "Admin Products",
        path: "/admin/products",
      });
    })
    .catch(err => {
      const error = new Error(err);
      error.httpStatusCode = 500;
      return next(error);
    });
};

exports.deleteProduct = (req, res, next) => {
  const prodId = req.params.productId;
  let pathImgUrl;
  Product.findById(prodId)
    .then(prod => {
      prod = null;
      if (!prod) {
        throw new Error("No product found to delete");
      }
      return (pathImgUrl = prod.imageUrl);
    })
    .then(() => {
      return Product.deleteOne({
        _id: prodId,
        userId: req.user._id,
      });
    })
    .then(() => {
      fileHelper.deleteFile(pathImgUrl);
      console.log("PRODUCT DELETED!");
      res.status(200).json({
        message: "Success!",
      });
    })
    .catch(err => {
      res.status(500).json({
        message: "Deleting product failed",
      });
    });
};
