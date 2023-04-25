const express = require("express");
const router = express.Router();

const apiController = require("./../controllers/apiController");

router.get("/get_calendar", apiController.getCalendar);
router.get("/get_table", apiController.getTable);

router.post("/event_status", apiController.postEventStatus);
router.delete("/event_status", apiController.deleteEventStatus);

module.exports = router;
