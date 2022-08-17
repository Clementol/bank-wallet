const History = require("../../models/history");

/**
 * @param {*} userId
 * @param {*} accountNo
 * @param {*} amount
 * @param {*} transactionType
 * @param {*} from optional
 * @param {*} to optional
 * @param {*} senderAccNo optional
 * @returns history
 */
const createHistory = (
  userId,
  accountNo,
  amount,
  transactionType,
  from,
  to,
  senderAccNo
) => {
  let transaction = {
    amount: amount,
    transactionType: transactionType,
    from: from,
    to: to,
    senderAccNo: senderAccNo,
  };
  return new Promise((resolve, reject) => {
    History.findOneAndUpdate(
      { userId, accountNo },
      { $push: { transactions: transaction } },
      { upsert: true }
    )
      .then((history) => {
        resolve(history);
      })
      .catch((error) => {
        reject(error);
      });
  });
};

/**
 * @param {*} userId 
 * @param {*} accountNo 
 * @returns history
 * @description Retrieve account history
 */
const checkHistory = (userId, accountNo) => {
  return new Promise((resolve, reject) => {
    History.findOne({ userId, accountNo }, "transactions")
    .then(history => {
      resolve(history)
    })
    .catch(error => {
      reject(error)
    })
  });
};

module.exports = { createHistory, checkHistory };
