const coursevilleModel = require("../models/coursevilleModel");
const calendarModel = require("../models/calendarModel");
const dbModel = require("../models/dbModel");

const authUtil = require("../utils/authUtil");

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

  let date = new Date();
  let month = parseInt(req.query.month) || date.getMonth() + 1;
  let year = parseInt(req.query.year) || date.getFullYear();

  const accessTokenConfig = authUtil.getAccessTokenConfig(req.session.token.access_token);
  let courses = await calendarModel.getAssignments(accessTokenConfig, month, year);

  res.end(JSON.stringify(courses));
};

/*
  ==================== getTable ====================
 */
exports.getTable = async (req, res) => {
  let response = await dbModel.getTable();
  res.end(JSON.stringify(response));
};

/*
  ==================== postEventStatus ====================
 */
exports.postEventStatus = async (req, res) => {
  const accessTokenConfig = authUtil.getAccessTokenConfig(req.session.token.access_token);
  const userInfo = await coursevilleModel.getUserInfo(accessTokenConfig);
  const user_id = userInfo.data.account.uid;
  const { event_id, status } = req.body;

  const response = await dbModel.addItem(user_id, event_id, status);
  res.end(response);
};

/*
==================== deleteEventStatus ====================
*/
exports.deleteEventStatus = async (req, res) => {
  const accessTokenConfig = authUtil.getAccessTokenConfig(req.session.token.access_token);
  const userInfo = await coursevilleModel.getUserInfo(accessTokenConfig);
  const user_id = userInfo.data.account.uid;
  const { event_id } = req.body;

  const response = await dbModel.deleteItem(user_id, event_id);
  res.end(response);
};
