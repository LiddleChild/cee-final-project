const express = require("express");
const router = express.Router();

const apiController = require("./../controllers/apiController");
const authUtil = require("../utils/authUtil");

router.get("/get_calendar", authUtil.requireLogin(apiController.getCalendar));

router.post("/event_status", authUtil.requireLogin(apiController.postEventStatus));
router.delete("/event_status", authUtil.requireLogin(apiController.deleteEventStatus));

module.exports = router;
