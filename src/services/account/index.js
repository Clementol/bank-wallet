const { AccountHelper } = require("../../helpers");
const { connection } = require("../../database");
const Account = require("../../models/account");
const History = require("../../models/history");

/**
 * @param {*} userId
 * @returns account
 */
const createAccount = (userId) => {
  let data = {};
  // generate random account No
  const accountNo = AccountHelper.generateAccNo();
  data.accountNo = accountNo;
  data.userId = userId;
  return new Promise(async (resolve, reject) => {
    const session = await connection.startSession();
    try {
      session.startTransaction();
      const account = await Account.create([data], { session: session });
      let transaction = {
        amount: account.balance,
        transactionType: "CREDITED",
      };
      await History.findOneAndUpdate(
        { userId, accountNo },
        { $push: { transactions: transaction } },
        { upsert: true, session: session }
      );
      await session.commitTransaction();
      resolve(account);
    } catch (error) {
      await session.abortTransaction();
      reject(error);
    }
  });
};

/**
 * @param {*} userId
 * @param {*} accountNo
 * @returns account
 */
const checkBalance = (userId, accountNo) => {
  return new Promise((resolve, reject) => {
    Account.findOne({ userId, accountNo })
      .then((account) => {
        resolve(account);
      })
      .catch((error) => {
        reject(error);
      });
  });
};

/**
 * @param {*} receiverAccNo
 * @returns account
 */
const findAccount = (receiverAccNo) => {
  return new Promise((resolve, reject) => {
    Account.findOne({ accountNo: receiverAccNo })
      .then((account) => {
        resolve(account);
      })
      .catch((error) => {
        reject(error);
      });
  });
};

/**
 * @param {*} accountNo 
 * @param {*} receiverAccNo receiver
 * @param {*} amount
 * @param {*} from
 * @param {*} to
 * @description Debit or Credit user account
 */
const updateAccBalance = (
  accountNo,
  receiverAccNo,
  amount,
  from,
  to
) => {
  return new Promise(async (resolve, reject) => {
    const session = await connection.startSession();
    try {
      session.startTransaction();
      // debit user acc
      await Account.findOneAndUpdate(
        { accountNo },
        { $inc: { balance: -amount } },
        {session: session, new: true}
      );
      // credit receiver account
      await Account.findOneAndUpdate(
        { accountNo: receiverAccNo },
        { $inc: { balance: amount } },
        {session: session, new: true}
      );
      let transaction = {
        // amount: any,
        // transactionType: any,
        // from: any,
        // to: any,
        // senderAccNo: any,
      };
      // create user history
      transaction.amount = amount;
      transaction.transactionType = "DEBITED";
      transaction.to = to;
      transaction.from = "You";
      await History.findOneAndUpdate(
        { accountNo },
        { $push: { transactions: transaction } },
        { upsert: true, session: session }
      );
      transaction = {};
      // create reciever history
      transaction.amount = amount;
      transaction.transactionType = "CREDITED";
      transaction.from = from;
      transaction.senderAccNo = accountNo;
      await History.findOneAndUpdate(
        { accountNo: receiverAccNo },
        { $push: { transactions: transaction } },
        { upsert: true, session: session }
      );
      await session.commitTransaction();
      resolve(1);
    } catch (error) {
      await session.abortTransaction();
      reject(error);
    }
  });
};

/**
 * @param {*} userId
 * @param {*} accountNo
 * @param {*} amount
 * @returns account
 */
const fundAccount = (userId, accountNo, amount) => {
  return new Promise(async (resolve, reject) => {
    const session = await connection.startSession();
    try {
      session.startTransaction();
      const account = await Account.findOneAndUpdate(
        { userId, accountNo },
        { $inc: { balance: amount } },
        { session: session, new: true }
      );

      let transaction = {
        // amount: any,
        // transactionType: any,
        // from: any,
      };
      // create user history
      transaction.amount = amount;
      transaction.transactionType = "CREDITED";
      transaction.from = "You";
      await History.findOneAndUpdate(
        { accountNo },
        { $push: { transactions: transaction } },
        { upsert: true, session: session }
      );
      await session.commitTransaction();
      resolve(account);
    } catch (error) {
      await session.abortTransaction();
      reject(error);
    }
  });
};

/**
 * @param {*} userId
 * @param {*} accountNo
 * @param {*} amount
 * @returns account
 */
const withDraw = (userId, accountNo, amount) => {
  return new Promise(async (resolve, reject) => {
    const session = await connection.startSession();
    try {
      session.startTransaction();
      const account = await Account.findOneAndUpdate(
        { userId, accountNo },
        { $inc: { balance: -amount } },
        { session: session, new: true }
      );

      let transaction = {
        // amount: any,
        // transactionType: any,
        // from: any,
      };
      // create user history
      transaction.amount = amount;
      transaction.transactionType = "DEBITED";
      transaction.to = "You";
      await History.findOneAndUpdate(
        { accountNo },
        { $push: { transactions: transaction } },
        { upsert: true, session: session }
      );
      await session.commitTransaction();
      resolve(account);
    } catch (error) {
      await session.abortTransaction();
      reject(error);
    }
  });
};

module.exports = {
  createAccount,
  checkBalance,
  findAccount,
  updateAccBalance,
  fundAccount,
  withDraw,
};
