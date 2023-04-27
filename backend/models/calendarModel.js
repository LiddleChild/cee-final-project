const axios = require("axios");

const dbModel = require("../models/dbModel");
const coursevilleModel = require("../models/coursevilleModel");

const cacheUtil = require("../utils/cacheUtil");
/*
  ==================== getAcamedicYear ====================
 */
exports.getAcademicYear = (m, y) => {
  // First semester
  if (m >= 8 && m <= 12)
    return {
      year: y.toString(),
      semester: 1,
    };
  // Second semester
  else if (m >= 1 && m <= 5)
    return {
      year: (y - 1).toString(),
      semester: 2,
    };
  else return {};
};

/*
  ==================== getSemesterCourses ====================
 */
exports.getSemesterCourses = async (session, month, year) => {
  const CACHE_ID = `c-${session.token}`;
  let courses = cacheUtil.get(CACHE_ID);

  if (!courses) {
    try {
      let responseData = await axios.get(
        `https://www.mycourseville.com/api/v1/public/get/user/courses?detail=1`,
        session.accessTokenConfig
      );

      courses = responseData.data.data.student;
      cacheUtil.cache(CACHE_ID, courses, 3600 * 6);
    } catch (err) {
      console.error(err);
    }
  }

  let courseFilter = exports.getAcademicYear(month, year);

  // Filter for only this semester's courses
  return courses.filter(
    (element) => element.year === courseFilter.year && element.semester === courseFilter.semester
  );
};

/*
  ==================== getCourseAssignmentsOnTheMonth ====================
 */
exports.getCourseAssignmentsOnTheMonth = async (session, courseId, month) => {
  const CACHE_ID = `ca-${courseId}-${session.token}`;
  let assignments = cacheUtil.get(CACHE_ID);

  if (!assignments) {
    try {
      let responseData = await axios.get(
        `https://www.mycourseville.com/api/v1/public/get/course/assignments?cv_cid=${courseId}&detail=1`,
        session.accessTokenConfig
      );

      assignments = responseData.data.data;
      cacheUtil.cache(CACHE_ID, assignments, 1800);

      // Filter for only current month's assignment
    } catch (err) {
      console.error(err);
    }
  }

  return assignments.filter((element) => new Date(element.duetime * 1000).getMonth() + 1 === month);
};

/*
  ==================== getAssignments ====================
 */
exports.getAssignments = async (session, month, year) => {
  const courses = await exports.getSemesterCourses(session, month, year);
  const eventData = []; // const eventData = await dbModel.getTable();
  const userInfo = await coursevilleModel.getUserInfo(session);

  const USER_ID = userInfo.data.account.uid;

  for (let event of Object.entries(eventData)) {
    if (event.custom) {
      calendar[dayOfMonth].push({
        course_title: event.custom.title,

        assignment_title: event.custom.title,
        assignment_duetime: event.custom.duetime,

        status: event.status,
      });
    }
  }

  let calendar = {};
  for (let c of courses) {
    let courseId = c.cv_cid;
    let assignments = await exports.getCourseAssignmentsOnTheMonth(session, courseId, month);

    for (let assign of assignments) {
      const ASSIGNMENT_ID = assign.itemid;
      let dayOfMonth = new Date(assign.duetime * 1000).getDate();

      if (!calendar[dayOfMonth]) calendar[dayOfMonth] = [];
      calendar[dayOfMonth].push({
        course_title: c.title,
        course_no: c.course_no,
        course_icon: c.course_icon,

        assignment_id: assign.itemid,
        assignment_title: assign.title,
        assignment_duetime: assign.duetime,

        status:
          eventData[USER_ID] && eventData[USER_ID][ASSIGNMENT_ID]
            ? eventData[USER_ID][ASSIGNMENT_ID].status
            : "NOT_DONE",
      });
    }
  }

  return calendar;
};
