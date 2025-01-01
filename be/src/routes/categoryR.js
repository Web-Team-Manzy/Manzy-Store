const express = require("express");
const router = express.Router();
const categoryC = require("../app/controllers/categoryC");

const auth = require("../middleware/auth");
const isAdmin = require("../middleware/isAdmin");

router.get("/list", categoryC.listCategory);

router.post("/add", auth, isAdmin, categoryC.addCategory);
router.put("/update", auth, isAdmin, categoryC.updateCategory);
router.delete("/delete/:categoryId", auth, isAdmin, categoryC.deleteCategory);


module.exports = router;
