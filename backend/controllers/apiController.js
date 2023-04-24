const axios = require("axios");

const calendarModel = require("../models/calendarModel");

/*
  ==================== calendar ====================
 */
exports.getCalendar = async (req, res) => {
  // Check for login session
  if (!req.session.token) {
    const json = {
      message: `Login required!`,
    };

    res.status(401);
    res.setHeader("Content-Type", "text/plain");
    res.end(JSON.stringify(json));
    return;
  }

  const accessTokenConfig = {
    headers: {
      Authorization: `Bearer ${req.session.token.access_token}`,
    },
  };

  let courses = await calendarModel.getAssignmentsOnThisMonth(accessTokenConfig);

  res.end(JSON.stringify(courses));
};
