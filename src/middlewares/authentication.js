const jwt = require("jsonwebtoken");
const config = require("../config");
const { ResponseHelper } = require("../helpers");

const requireSignIn = async (req, res, next) => {
  try {
    let msg;
    if (req.headers["authorization"] == null) {
      msg = "Could not start Authentication";
      res.status(401).json(ResponseHelper.responseMessage({}, msg, false));
      return;
    }
    const token = req.headers["authorization"].split(" ")[1];

    if (!token) {
      msg = "Could not proceed to Authentication";
      res.status(401).json(ResponseHelper.responseMessage({}, msg, false));
      return;
    }
    //Verify token
    const decoded = jwt.verify(token, config.JWT_SECRETE);
    if (decoded) {
      req.user = decoded.data;

      next();
    } else if (!decoded) {
      msg = `Login required ${error}`;
      res.status(401).json(ResponseHelper.responseMessage({}, msg, false));
      return;
    }
  } catch (error) {
    msg = `Authetication error`;
    res.status(401).json(ResponseHelper.responseMessage({}, msg, false));
  }
};

module.exports = { requireSignIn };
