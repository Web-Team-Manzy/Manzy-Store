const express = require("express");
const router = express.Router();
const categoryC = require("../app/controllers/categoryC");

router.get("/list", categoryC.listCategory);
router.post("/add", categoryC.addCategory);
router.put("/update", categoryC.updateCategory);

module.exports = router;    