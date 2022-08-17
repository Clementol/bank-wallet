const { connection } = require("../../database");
const { AuthHelper, AccountHelper } = require("../../helpers");
const Account = require("../../models/account");
const History = require("../../models/history");
const User = require("../../models/user");

/**
 * @param {*} email
 * @returns user
 */
const checkUser = (email) => {
  return new Promise((resolve, reject) => {
    User.findOne({ email })
      .then((user) => {
        resolve(user);
      })
      .catch((error) => {
        reject(error);
      });
  });
};

/**
 * @param {*} id
 * @returns user
 */
const checkUserById = (id) => {
  return new Promise((resolve, reject) => {
    User.findById(id).exec((err, user) => {
      if (user) {
        resolve(user);
      }
      if (err) {
        reject(err);
      }
    });
  });
};

/**
 * @param {*} data
 * @returns user
 */
const createUser = (data) => {
  return new Promise((resolve, reject) => {
    AuthHelper.encryptPassword(data.password).then(async ({ passwordHash }) => {
      data.password = passwordHash;
      let userData = {};
      // generate random account No
      const accountNo = AccountHelper.generateAccNo();
      userData.accountNo = accountNo;
      const session = await connection.startSession();
      try {
        session.startTransaction();
        const user = await User.create([data], { session: session });
        userData.userId = user[0].id;
        const account = await Account.create([userData], { session: session });

        let transaction = {
          amount: account[0].balance,
          transactionType: "CREDITED",
        };
        await History.findOneAndUpdate(
          { userId: user[0]._id, accountNo },
          { $push: { transactions: transaction } },
          { upsert: true, session: session }
        );
        await session.commitTransaction();
        resolve(user[0]);
      } catch (error) {
        await session.abortTransaction();
        reject(error);
      }
    });
  });
};

module.exports = { checkUser, createUser, checkUserById };
