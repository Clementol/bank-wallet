const { Router } = require("express");
const { signUp, signIn } = require("../controllers/auth");

const authRouter = Router();

authRouter.post("/signup", signUp)
authRouter.post("/signin", signIn)

module.exports = authRouter;
