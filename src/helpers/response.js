/**
 * @param {*} data
 * @param {*} message
 * @param {*} success
 * @returns *{data, message, succes}
 */
const responseMessage = (data, message, success) => {
  return {
    data,
    message,
    success,
  };
};

module.exports = { responseMessage };
