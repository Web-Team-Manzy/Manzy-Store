const express = require("express");
const router = express.Router();
const cartC = require("../app/controllers/cartC");
const auth = require("../middleware/auth");

router.post("/get", auth, cartC.getUserCart);
router.post("/add", auth, cartC.addToCart);
router.put("/update", auth, cartC.updateCart);

module.exports = router;
