const jwt = require("jsonwebtoken");
const bcrypt = require("bcryptjs/dist/bcrypt");
const config = require("../../config");

/**
 * @param {*} foundedPassword
 * @param {*} password
 * @description To verify Password
 */
 const verifyPassword = (foundedPassword, password) => {
  return new Promise((resolve, reject) => {
    bcrypt.compare(password, foundedPassword).then((isMatch) => {
      if (isMatch) {
        resolve(isMatch);
      } else {
        resolve(isMatch);
      }
    });
  });
};


/**
 * @description encrypt password
 * @param {*} password
 * @returns passwordHash, error
 */
const encryptPassword = (password) => {
  return new Promise((resolve, reject) => {
    bcrypt.genSalt(10, (error, salt) => {
      bcrypt.hash(password, salt, (error, hash) => {
        // if (error) reject({ error });
        resolve({ passwordHash: hash });
      });
    });
  });
};

/**
 * @description Generate token
 * @param {*} data
 * @returns token
 */
 const generateToken = (data) => {
  // let token, refreshToken;
  return new Promise((resolve, reject) => {
    jwt.sign(
      { data },
      config.JWT_SECRETE,
      { expiresIn: "1h" },
      (error, token) => {
        resolve(token);
      }
    );
  });
};

module.exports = { encryptPassword, verifyPassword, generateToken };
