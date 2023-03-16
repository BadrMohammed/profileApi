const verifiyPermissions = (...allowedPermissions) => {
  return (req, res, next) => {
    if (!req?.permissions)
      return res
        .status(401)
        .json({ data: null, error: [req.t("no-permission")] });

    const PermissionsArray = [...allowedPermissions];

    const result = req.permissions
      .map((per) => PermissionsArray.includes(per))
      .find((val) => val === true);
    if (!result && !req?.permissions.includes("all-permissions"))
      return res
        .status(401)
        .json({ data: null, error: [req.t("no-permission")] });

    if (result || req?.permissions.includes("all-permissions")) next();
  };
};
module.exports = verifiyPermissions;
