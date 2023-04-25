const axios = require("axios");

/*
  ==================== getUserInfo ====================
 */
exports.getUserInfo = async (accessTokenConfig) => {
  try {
    let responseData = await axios.get(
      "https://www.mycourseville.com/api/v1/public/get/user/info",
      accessTokenConfig
    );
    const json = responseData.data;

    return json;
  } catch (err) {
    console.log(err);
  }
};
