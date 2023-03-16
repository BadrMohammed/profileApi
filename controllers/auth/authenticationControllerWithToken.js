const { getUserByKey, updateUser } = require("../../services/UserServices");

const logout = async (req, res) => {
  const { id } = req;

  if (!id)
    return res
      .status(400)
      .json({ data: null, error: [req.t("item-id-required")] });

  const findUser = await getUserByKey("_id", id);

  if (!findUser.token)
    res.status(200).json({ data: null, message: req.t("signed-successfully") });

  const _result = await updateUser(findUser, req?.body, "");

  res
    .status(200)
    .json({ data: _result, message: req.t("signed-successfully") });
};

module.exports = { logout };
