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
  ==================== getCurrentCourses ====================
 */
exports.getCurrentCourses = async (accessTokenConfig) => {
  try {
    let responseData = await axios.get(
      `https://www.mycourseville.com/api/v1/public/get/user/courses?detail=1`,
      accessTokenConfig
    );
    const json = responseData.data;

    let courses = json.data.student;
    let courseFilter = exports.getAcademicYear();

    courses = courses.filter(
      (element) => element.year === courseFilter.year && element.semester === courseFilter.semester
    );

    return courses;
  } catch (err) {
    console.error(err);
  }
};

/*
  ==================== getCourseAssignments ====================
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

    assignments = assignments.filter(
      (element) => new Date(element.duetime * 1000).getMonth() === m
    );

    return assignments;
  } catch (err) {
    console.error(err);
  }
};
