const axios = require("axios");

/*
  ==================== getAcamedicYear ====================
 */
exports.getAcademicYear = () => {
  let date = new Date();
  let m = date.getMonth();

  // First semester
  if (m >= 8 && m <= 12)
    return {
      year: date.getFullYear().toString(),
      semester: 1,
    };
  // Second semester
  else if (m >= 1 && m <= 5)
    return {
      year: (date.getFullYear() - 1).toString(),
      semester: 2,
    };
  else return {};
};

/*
  ==================== getSemesterCourses ====================
 */
exports.getSemesterCourses = async (accessTokenConfig) => {
  try {
    let responseData = await axios.get(
      `https://www.mycourseville.com/api/v1/public/get/user/courses?detail=1`,
      accessTokenConfig
    );
    const json = responseData.data;

    let courses = json.data.student;
    let courseFilter = exports.getAcademicYear();

    // Filter for only this semester's courses
    return courses.filter(
      (element) => element.year === courseFilter.year && element.semester === courseFilter.semester
    );
  } catch (err) {
    console.error(err);
  }
};

/*
  ==================== getCourseAssignmentsOnThisMonth ====================
 */
exports.getCourseAssignmentsOnThisMonth = async (accessTokenConfig, courseId) => {
  try {
    let responseData = await axios.get(
      `https://www.mycourseville.com/api/v1/public/get/course/assignments?cv_cid=${courseId}&detail=1`,
      accessTokenConfig
    );
    const json = responseData.data;

    let m = new Date().getMonth();
    let assignments = json.data;

    // Filter for only current month's assignment
    return assignments.filter((element) => new Date(element.duetime * 1000).getMonth() === m);
  } catch (err) {
    console.error(err);
  }
};

/*
  ==================== getAssignmentsOnThisMonth ====================
 */
exports.getAssignmentsOnThisMonth = async (accessTokenConfig) => {
  let courses = await exports.getSemesterCourses(accessTokenConfig);

  let calendar = {};
  for (let c of courses) {
    let courseId = c.cv_cid;
    let assignments = await exports.getCourseAssignmentsOnThisMonth(accessTokenConfig, courseId);

    for (let assign of assignments) {
      let d = new Date(assign.duetime * 1000).getDate();

      if (!calendar[d]) calendar[d] = [];
      calendar[d].push({
        course_title: c.title,
        course_no: c.course_no,
        course_icon: c.course_icon,

        assignments_title: assign.title,
        assignments_duetime: assign.duetime,
      });
    }
  }

  return calendar;
};
