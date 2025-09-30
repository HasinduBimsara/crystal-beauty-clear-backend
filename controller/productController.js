import Product from "../models/product.js";
export async function createProduct(req, res) {
  if (!req.user) {
    res.status(403).json({
      message: "you need to login first ",
    });
    return;
  }

  if (req.user.role != "admin") {
    res.status(403).json({
      message: "you are not allowed to add product",
    });
    return;
  }

  const product = new Product(req.body);
  try {
    await product.save();
    res.json({
      message: "Product saved successfully",
    });
  } catch (err) {
    res.status(500).json({
      message: "Product not saved",
    });
  }
}
export function getProducts(req, res) {
  Product.find()
    .then((products) => {
      res.json(products);
    })
    .catch((err) => {
      console.log(err);
      res.status(500).json({
        message: "could not fetch products",
      });
    });
}
export function deleteProduct(req, res) {
  if (!req.user) {
    res.status(403).json({
      message: "you need to login first",
    });
    return;
  }

  if (req.user.role !== "admin") {
    res.status(403).json({
      message: "you are not allowed to delete product",
    });
    return;
  }
  const productId = req.params.id;

  Product.findByIdAndDelete(productId)
    .then((product) => {
      if (!product) {
        res.status(404).json({
          message: "product not found",
        });
      } else {
        res.json({
          message: "product deleted",
        });
      }
    })
    .catch((err) => {
      console.log(err);
      res.status(500).json({
        message: "could not delete product",
      });
    });
}

export function updateProduct(req, res) {
  if (!req.user) {
    res.status(403).json({
      message: "you need to login first",
    });
    return;
  }

  if (req.user.role !== "admin") {
    res.status(403).json({
      message: "you are not allowed to update product",
    });
    return;
  }

  const productId = req.params.id;

  Product.findByIdAndUpdate(productId, req.body, { new: true })
    .then((product) => {
      if (!product) {
        res.status(404).json({
          message: "product not found",
        });
      } else {
        res.json({
          message: "product updated",
          product,
        });
      }
    })
    .catch((err) => {
      console.log(err);
      res.status(500).json({
        message: "could not update product",
      });
    });
}
