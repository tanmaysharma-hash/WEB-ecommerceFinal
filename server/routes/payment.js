const express = require("express");
const router = express.Router();
const { makePayment } = require("../controllers/paymentController");

router.post("/pay", makePayment);

module.exports = router;
