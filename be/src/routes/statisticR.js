const express = require("express");
const router = express.Router();
const orderC = require("../app/controllers/statisticController");

const auth = require("../middleware/auth");
const isAdmin = require("../middleware/isAdmin");

router.get("/total", orderC.getStatistic);
router.get("/product", orderC.getProductStatistic);
router.get("/chart", orderC.getChartStatistic);

module.exports = router;
