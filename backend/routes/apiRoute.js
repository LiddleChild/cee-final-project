const express = require("express");
const router = express.Router();

const apiController = require("./../controllers/apiController");

router.get("/get_calendar", apiController.getCalendar);
router.get("/get_table", apiController.getTable);

module.exports = router;
