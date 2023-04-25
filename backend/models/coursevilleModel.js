const axios = require("axios");

/*
  ==================== getUserInfo ====================
 */
let userInfoCache = {};
exports.getUserInfo = async (session) => {
  if (userInfoCache[session.token]) return userInfoCache[session.token];

  try {
    let responseData = await axios.get(
      "https://www.mycourseville.com/api/v1/public/get/user/info",
      session.accessTokenConfig
    );

    const json = responseData.data;

    userInfoCache[session.token] = json;
    return json;
  } catch (err) {
    console.log(err);
  }
};
