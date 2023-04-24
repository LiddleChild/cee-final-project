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

  let date = new Date();
  let month = parseInt(req.query.month) || date.getMonth() + 1;
  let year = parseInt(req.query.year) || date.getFullYear();

  let courses = await calendarModel.getAssignments(accessTokenConfig, month, year);

  res.end(JSON.stringify(courses));
};
