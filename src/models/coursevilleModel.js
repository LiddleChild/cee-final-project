const axios = require("axios");

const cacheUtil = require("../utils/cacheUtil");

/*
  ==================== getUserInfo ====================
 */
exports.getUserInfo = async (session) => {
  const CACHE_ID = `ui-${session.token}`;
  let cachedUserInfo = cacheUtil.get(CACHE_ID);

  if (cachedUserInfo) return cachedUserInfo;

  try {
    let responseData = await axios.get(
      "https://www.mycourseville.com/api/v1/public/get/user/info",
      session.accessTokenConfig
    );
    const userInfo = responseData.data;

    cacheUtil.cache(CACHE_ID, userInfo, 3600 * 6);
    return userInfo;
  } catch (err) {
    console.log(err);
  }
};
