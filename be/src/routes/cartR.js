const express = require("express");
const router = express.Router();
const cartC = require("../app/controllers/cartC");
const auth = require("../middleware/auth");

router.post("/get", auth, cartC.getUserCart);
router.post("/add", auth, cartC.addToCart);
router.put("/update", auth, cartC.updateCart);
router.post("/delete", auth, cartC.deleteFromCart);

module.exports = router;
