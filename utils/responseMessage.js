const responseMessage = (message, data, type, pagination) => {
  return {
    // isSuccess: type === 1 ? true : false,
    message: message,
    // statusCode: type === 1 ? 200 : 400,
    data: data,
    pagination: pagination || undefined,
  };
};

module.exports = responseMessage;
