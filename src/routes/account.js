const { Router } = require("express");
const { createBankAccount, accountBalance, transferMoney, fundWallet, collectYourMoney } = require("../controllers/account");
const { Authentication } = require("../middlewares");

const accountRouter = Router();

accountRouter.post(
  "/account/create",
  Authentication.requireSignIn,
  createBankAccount
);
accountRouter.get(
  "/account/balance/:accountNo",
  Authentication.requireSignIn,
  accountBalance
);
accountRouter.post(
  "/account/transfer/:accountNo",
  Authentication.requireSignIn,
  transferMoney
);
accountRouter.put(
  "/account/fund/:accountNo",
  Authentication.requireSignIn,
  fundWallet
);
accountRouter.put(
  "/account/withDraw/:accountNo",
  Authentication.requireSignIn,
  collectYourMoney
);
module.exports = accountRouter;
