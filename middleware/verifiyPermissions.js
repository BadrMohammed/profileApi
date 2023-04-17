const responseMessage = require("../utils/responseMessage");
const verifiyPermissions = (...allowedPermissions) => {
  return (req, res, next) => {
    if (!req?.permissions)
      return res
        .status(400)
        .json(responseMessage(req.t("no-permission"), null, 0));

    const PermissionsArray = [...allowedPermissions];
    const result = req.permissions
      .map((per) => PermissionsArray.includes(per))
      .find((val) => val === true);
    if (!result && !req?.permissions.includes("all-permissions"))
      return res
        .status(400)
        .json(responseMessage(req.t("no-permission"), null, 0));

    if (result || req?.permissions.includes("all-permissions")) next();
  };
};
module.exports = verifiyPermissions;
