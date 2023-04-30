/*
  ==================== getAccessTokenConfig ====================
 */
exports.getAccessTokenConfig = (access_token) => {
  return {
    headers: {
      Authorization: `Bearer ${access_token}`,
    },
  };
};
/*
  ==================== requireLogin (Middleware) ====================
 */
exports.requireLogin = (callback) => {
  return async (req, res, next) => {
    if (!req.session.token) {
      const json = { message: `Access denied!, please sign in to continue.` };

      res.status(401);
      res.setHeader("Content-Type", "text/plain");
      res.end(JSON.stringify(json));
    } else {
      const session = {
        token: req.session.token.access_token,
        accessTokenConfig: exports.getAccessTokenConfig(req.session.token.access_token),
      };

      await callback(req, res, session);
      next();
    }
  };
};
