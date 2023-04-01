const jwt = require("jsonwebtoken");
const { getUserByKey } = require("../services/UserServices");
const responseMessage = require("../utils/responseMessage");

const verifiyJWT = (req, res, next) => {
  const authHeader = req.headers.authorization || req.headers.Authorization;
  if (!authHeader && req.url === "/api/v1/product/get") next();
  else {
    if (!authHeader?.startsWith("Bearer"))
      return res
        .status(400)
        .json(responseMessage(req.t("unauthenticated"), null, 0));
    const token = authHeader.split(" ")[1];

    jwt.verify(token, process.env.ACCESS_TOKEN_SECRET, async (err, decoded) => {
      if (err) return res.sendStatus(403); //invalid token

      let findUser = await getUserByKey("_id", decoded.id);
      if (!findUser.token)
        return res
          .status(400)
          .json(responseMessage(req.t("unauthenticated"), null, 0));
      const token = authHeader.split(" ")[1];

      req.id = decoded.id;
      req.permissions = decoded.permissions;
      next();
    });
  }
};
module.exports = verifiyJWT;
