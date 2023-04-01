const { getUserByKey, updateUser } = require("../../services/UserServices");
const responseMessage = require("../../utils/responseMessage");

const logout = async (req, res) => {
  const { id } = req;

  if (!id)
    return res
      .status(400)
      .json({ data: null, error: [req.t("item-id-required")] });

  const findUser = await getUserByKey("_id", id);

  if (!findUser.token)
    res
      .status(200)
      .json(responseMessage(req.t("signed-successfully"), null, 1));

  const _result = await updateUser(findUser, req?.body, "");

  res
    .status(200)
    .json(responseMessage(req.t("signed-successfully"), _result, 1));
};

module.exports = { logout };
