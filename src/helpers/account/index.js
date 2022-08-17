const generateAccNo = () => {
  return Math.floor(Math.random() * (1000000000 - 9999999999 + 1)) + 9999999999;
};

module.exports = { generateAccNo };
