const express = require("express");
const router = express.Router();

const apiController = require("../controllers/apiController");
const authUtil = require("../utils/authUtil");

router.get("/get_calendar", authUtil.requireLogin(apiController.getCalendar));
router.get("/get_table", apiController.getTable);

router.post("/create_event", authUtil.requireLogin(apiController.postCreateEvent));
router.post("/event", authUtil.requireLogin(apiController.postEvent));
router.delete("/event", authUtil.requireLogin(apiController.deleteEvent));

module.exports = router;
