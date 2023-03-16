const jwt = require("jsonwebtoken");
function createToken(userId, permissions) {
  const newToken = jwt.sign(
    {
      id: userId,
      permissions: permissions ? permissions : [],
    },
    process.env.ACCESS_TOKEN_SECRET
  );

  return newToken;
}

module.exports = createToken;
