require("dotenv").config();

const url = require("url");
const querystring = require("querystring");
const axios = require("axios");

const REDIRECT_URI = `http://${process.env.BACKEND_ADDRESS}:${process.env.PORT}/courseville/access_token`;
const AUTHORIZATION_URL = `https://www.mycourseville.com/api/oauth/authorize?response_type=code&client_id=${process.env.CLIENT_ID}&redirect_uri=${REDIRECT_URI}`;
const ACCESS_TOKEN_URL = "https://www.mycourseville.com/api/oauth/access_token";

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
    res.writeHead(400, { "Content-Type": "text/plain" });
    res.end(`Authorization error: ${parsedQuery.error_description}`);
  }

  if (!parsedQuery.code) {
    res.redirect(AUTHORIZATION_URL);
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
    .then((tokenData) => {
      const token = tokenData.data;
      req.session.token = token;

      if (token)
        res.redirect(`http://${process.env.FRONTEND_ADDRESS}/index.html`);
    })
    .catch((err) => console.error(err));
};
