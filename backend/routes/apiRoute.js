const express = require("express");
const router = express.Router();

const apiController = require("./../controllers/apiController");

router.get("/get_calendar", apiController.getCalendar);

module.exports = router;
