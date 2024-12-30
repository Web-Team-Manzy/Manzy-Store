const express = require("express");
const router = express.Router();
const categoryC = require("../app/controllers/categoryC");
const auth = require("../middleware/auth");
const admin = require("../middleware/isAdmin");

router.get("/list", categoryC.listCategory);
router.post("/add",  auth, admin, categoryC.addCategory);
router.put("/update",  auth, admin, categoryC.updateCategory);

module.exports = router;    