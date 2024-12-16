const express = require("express");
const router = express.Router();
const productC = require("../app/controllers/productC");
const upload = require("../middleware/multer");

router.get("/list", productC.listProduct);

router.get(
  "/add",
  upload.fields([
    { name: "image1", maxCount: 1 },
    { name: "image2", maxCount: 1 },
    { name: "image3", maxCount: 1 },
    { name: "image4", maxCount: 1 },
  ]),
  productC.addProduct
);

router.get("/detail", productC.detailProduct);

router.get("/update", productC.updateProduct);

router.delete("/delete", productC.deleteProduct);

module.exports = router;
