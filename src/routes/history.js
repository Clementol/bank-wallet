const { Router } = require("express");
const { accountHistory } = require("../controllers/history");
const { Authentication } = require("../middlewares");

const historyRouter = Router();

historyRouter.get(
  "/account/history/:accountNo",
  Authentication.requireSignIn,
  accountHistory
);

module.exports = historyRouter;
