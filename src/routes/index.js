const accountRouter = require("./account");
const authRouter = require("./auth");
const historyRouter = require("./history");

module.exports = (app) => {
  const v1 = "/api/v1";
  app.use(v1, authRouter);
  app.use(v1, accountRouter);
  app.use(v1, historyRouter);
};
