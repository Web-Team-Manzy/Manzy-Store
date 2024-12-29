const express = require("express");
const router = express.Router();
const productC = require("../app/controllers/productC");
const upload = require("../middleware/multer");

const auth = require("../middleware/auth");
const isAdmin = require("../middleware/isAdmin");

router.get("/list", productC.listProduct);

router.post(
    "/add",
    auth,
    isAdmin,
    upload.fields([
        { name: "image1", maxCount: 1 },
        { name: "image2", maxCount: 1 },
        { name: "image3", maxCount: 1 },
        { name: "image4", maxCount: 1 },
    ]),
    productC.addProduct
);

router.get("/detail/:productId", productC.detailProduct);

router.put("/update", auth, isAdmin, productC.updateProduct);

router.delete("/delete", auth, isAdmin, productC.deleteProduct);

module.exports = router;
