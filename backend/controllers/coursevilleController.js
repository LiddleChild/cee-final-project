require("dotenv").config();

const url = require("url");
const querystring = require("querystring");
const axios = require("axios");

const REDIRECT_URI = `http://${process.env.BACKEND_ADDRESS}:${process.env.PORT}/courseville/access_token`;
const AUTHORIZATION_URL = `https://www.mycourseville.com/api/oauth/authorize?response_type=code&client_id=${process.env.CLIENT_ID}&redirect_uri=${REDIRECT_URI}`;
const ACCESS_TOKEN_URL = "https://www.mycourseville.com/api/oauth/access_token";

const coursevilleModel = require("../models/coursevilleModel");
const authUtil = require("../utils/authUtil");

/*
  ==================== login ====================
 */
exports.login = (req, res) => {
  res.redirect(AUTHORIZATION_URL);
};

/*
  ==================== logout ====================
 */
exports.logout = (req, res) => {
  req.session.destroy();
  res.redirect(`http://${process.env.FRONTEND_ADDRESS}/index.html`);
};

/*
  ==================== accessToken ====================
 */
exports.accessToken = (req, res) => {
  const parsedUrl = url.parse(req.url);
  const parsedQuery = querystring.parse(parsedUrl.query);

  if (parsedQuery.error) {
    const json = {
      message: `Authorization error: ${parsedQuery.error_description}`,
    };

    res.state(400);
    res.setHeader("Content-Type", "text/plain");
    res.end(JSON.stringify(json));
    return;
  }

  if (!parsedQuery.code) {
    res.redirect(AUTHORIZATION_URL);
    return;
  }

  const postData = {
    grant_type: "authorization_code",
    code: parsedQuery.code,
    client_id: process.env.CLIENT_ID,
    client_secret: process.env.CLIENT_SECRET,
    redirect_uri: REDIRECT_URI,
  };

  // Request for token from MCV
  axios
    .post(ACCESS_TOKEN_URL, postData)
    .then(async (responseData) => {
      const token = responseData.data; // { token_type, access_token, expires_in, refresh_token }
      req.session.token = token;

      if (token) {
        res.status(302);
        res.location(`http://${process.env.FRONTEND_ADDRESS}/index.html`);
        res.end();
      }
    })
    .catch((err) => console.error(err));
};

/*
  ==================== getUserInfo ====================
 */
exports.getUserInfo = async (req, res, session) => {
  const responseData = await coursevilleModel.getUserInfo(session);
  res.end(JSON.stringify(responseData));
};
