const express = require("express");
const router = express.Router();
const productcontroller = require("../controllers/productcontroller");

var cookieParser = require("cookie-parser");
router.use(cookieParser());

router.get("/show/:id", productcontroller.show);

router.post("/update/:id", productcontroller.update);

router.post("/restore/:id", productcontroller.restore);

router.post("/:id", productcontroller.delete);

router.post("/force/:id", productcontroller.force);

router.post("/store", productcontroller.store);

router.get("/", productcontroller.index);

module.exports = router;
