const express = require("express");
const router = express.Router();
const cartC = require("../app/controllers/cartC");

router.post("/get", cartC.getUserCart);
router.post("/add", cartC.addToCart);
router.put("/update", cartC.updateCart);

module.exports = router;
