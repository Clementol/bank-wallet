const { ResponseHelper } = require("../../helpers");
const { AccountService, AuthService } = require("../../services");

const createBankAccount = (req, res) => {
  try {
    let msg;
    const { userId } = req.user;

    AccountService.createAccount(userId)
      .then((account) => {
        msg = `Account created successfully`;
        return res
          .status(201)
          .json(ResponseHelper.responseMessage(account, msg, true));
      })
      .catch((error) => {
        msg = `Could not create account ${error}`;
        return res
          .status(400)
          .json(ResponseHelper.responseMessage({}, msg, false));
      });
  } catch (error) {
    return res
      .status(500)
      .json(ResponseHelper.responseMessage({}, `${error}`, false));
  }
};

const accountBalance = (req, res) => {
  try {
    const { userId } = req.user;
    const { accountNo } = req.params;

    AccountService.checkBalance(userId, accountNo).then((account) => {
      if (!account) {
        return res
          .status(400)
          .json(ResponseHelper.responseMessage({}, "Account not found", false));
      }
      return res
        .status(200)
        .json(
          ResponseHelper.responseMessage({ balance: account.balance }, "", true)
        );
    });
  } catch (error) {
    return res
      .status(500)
      .json(ResponseHelper.responseMessage({}, `${error}`, false));
  }
};

const transferMoney = async (req, res) => {
  try {
    let msg, from, to;
    const { userId, firstName, lastName } = req.user;
    const { accountNo } = req.params;
    const { amount, receiverAccNo } = req.body;

    // check user account balance
    await AccountService.checkBalance(userId, accountNo).then((account) => {
      if (!account.active) {
        msg = `Account has been suspended`;
        return res
          .status(400)
          .json(ResponseHelper.responseMessage({}, msg, false));
      }
      if (account.balance <= 0) {
        msg = `Empty wallet`;
        return res
          .status(400)
          .json(ResponseHelper.responseMessage({}, msg, false));
      }
      if (account.balance < amount) {
        msg = `Insufficient fund`;
        return res
          .status(400)
          .json(ResponseHelper.responseMessage({}, msg, false));
      }
      from = `${lastName} ${firstName}`;

      // check for receiver account
      AccountService.findAccount(receiverAccNo).then(async (account) => {
        if (!account) {
          msg = `Receiver account not found`;
          return res
            .status(400)
            .json(ResponseHelper.responseMessage({}, msg, false));
        }
        // if account exist perform transaction
        if (account) {
          const user = await AuthService.checkUserById(account.userId);
          to = `${user.lastName} ${user.firstName}`;
          await AccountService.updateAccBalance(
            accountNo,
            receiverAccNo,
            amount,
            from,
            to
          ).then(() => {
            msg = `Transferred successfully to ${to}`;
            return res
              .status(201)
              .json(
                ResponseHelper.responseMessage({ amount: amount }, msg, true)
              );
          });
        }
      });
    });
  } catch (error) {
    return res
      .status(500)
      .json(ResponseHelper.responseMessage({}, `${error}`, false));
  }
};

const fundWallet = (req, res) => {
  try {
    let msg;
    const { accountNo } = req.params;
    const { userId } = req.user;
    const { amount } = req.body;
    AccountService.fundAccount(userId, accountNo, amount)
      .then((account) => {
        if (account) {
          msg = `Your account has been funded successfully`;
          return res
            .status(202)
            .json(ResponseHelper.responseMessage(account, `${msg}`, true));
        } else {
          msg = `Cannot complete request `;
          return res
            .status(400)
            .json(ResponseHelper.responseMessage({}, `${msg}`, false));
        }
      })
      .catch((error) => {
        return res
          .status(400)
          .json(ResponseHelper.responseMessage({}, `${error}`, false));
      });
  } catch (error) {
    return res
      .status(500)
      .json(ResponseHelper.responseMessage({}, `${error}`, false));
  }
};

const collectYourMoney = async (req, res) => {
  try {
    let msg;
    const { accountNo } = req.params;
    const { userId } = req.user;
    const { amount } = req.body;
    // check user account balance
    await AccountService.checkBalance(userId, accountNo).then( async (account) => {
      if (!account.active) {
        msg = `Account has been suspended`;
        return res
          .status(400)
          .json(ResponseHelper.responseMessage({}, msg, false));
      }
      if (account.balance <= 0) {
        msg = `Empty wallet`;
        return res
          .status(400)
          .json(ResponseHelper.responseMessage({}, msg, false));
      }
      if (account.balance < amount) {
        msg = `Insufficient fund`;
        return res
          .status(400)
          .json(ResponseHelper.responseMessage({}, msg, false));
      }
      await AccountService.withDraw(userId, accountNo, amount)
        .then((account) => {
          if (account) {

            msg = `Your account has been debited`;
            return res
              .status(202)
              .json(ResponseHelper.responseMessage(account, `${msg}`, true));
          } else {
            msg = `Cannot complete request `;
            return res
              .status(400)
              .json(ResponseHelper.responseMessage({}, `${msg}`, false));
          }
        })
        .catch((error) => {
          msg = `Error withdrawing ${error}`;
          return res
            .status(202)
            .json(ResponseHelper.responseMessage(account, `${msg}`, true));
        });
    });
  } catch (error) {
    return res
      .status(500)
      .json(ResponseHelper.responseMessage({}, `${error}`, false));
  }
};

module.exports = {
  createBankAccount,
  accountBalance,
  transferMoney,
  fundWallet,
  collectYourMoney
};
