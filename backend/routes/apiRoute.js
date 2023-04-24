const express = require("express");
const router = express.Router();

const apiController = require("./../controllers/apiController");

router.get("/getCalendar", apiController.getCalendar);

module.exports = router;
