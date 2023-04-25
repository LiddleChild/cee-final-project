exports.getAccessTokenConfig = (access_token) => {
  return {
    headers: {
      Authorization: `Bearer ${access_token}`,
    },
  };
};
