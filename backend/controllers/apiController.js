const coursevilleModel = require("../models/coursevilleModel");
const calendarModel = require("../models/calendarModel");
const dbModel = require("../models/dbModel");

const authUtil = require("../utils/authUtil");

/*
  ==================== calendar ====================
 */
exports.getCalendar = async (req, res, session) => {
  let date = new Date();
  let month = parseInt(req.query.month) || date.getMonth() + 1;
  let year = parseInt(req.query.year) || date.getFullYear();

  let courses = await calendarModel.getAssignments(session, month, year);

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
exports.postEventStatus = async (req, res, session) => {
  const userInfo = await coursevilleModel.getUserInfo(session);
  const user_id = userInfo.data.account.uid;
  const { event_id, status } = req.body;

  const response = await dbModel.addItem(user_id, event_id, status);
  res.end(response);
};

/*
==================== deleteEventStatus ====================
*/
exports.deleteEventStatus = async (req, res, session) => {
  const userInfo = await coursevilleModel.getUserInfo(session);
  const user_id = userInfo.data.account.uid;
  const { event_id } = req.body;

  const response = await dbModel.deleteItem(user_id, event_id);
  res.end(response);
};
