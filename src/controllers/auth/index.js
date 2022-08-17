const { AuthHelper, ResponseHelper } = require("../../helpers");
const {
  AuthService,
  AccountService,
  HistoryService,
} = require("../../services");

const signUp = async (req, res) => {
  try {
    const { firstName, lastName, email, password } = req.body;
    let msg, data;
    // check user already exist
    await AuthService.checkUser(email).then((user) => {
      if (user) {
        msg = `User already exist`;
        return res
          .status(400)
          .json(ResponseHelper.responseMessage({}, msg, false));
      }
      // create user
      data = { firstName, lastName, email, password };
      // create user, account & initial deposit of 1000
      
      AuthService.createUser(data)
        .then((user) => {
          // create account & initial deposit of 1000
          msg = `Registration was successful`;
          return res
            .status(201)
            .json(ResponseHelper.responseMessage({}, msg, true));
        })
        .catch((error) => {
          msg = `Unable to complete registration ${error}`;
          return res
            .status(400)
            .json(ResponseHelper.responseMessage({}, msg, false));
        });
    });
  } catch (error) {
    return res
      .status(400)
      .json(ResponseHelper.responseMessage({}, `${error}`, false));
  }
};

const signIn = (req, res) => {
  try {
    let msg;
    const { email, password } = req.body;
    AuthService.checkUser(email)
      .then((user) => {
        if (!user) {
          msg = `Invalid login credentials`;
          return res
            .status(500)
            .send(ResponseHelper.responseMessage({}, msg, false));
        }
        AuthHelper.verifyPassword(user.password, password).then((isMatch) => {
          if (!isMatch) {
            msg = `Invalid login credentials`;
            return res
              .status(400)
              .json(ResponseHelper.responseMessage({}, msg, false));
          }
          AuthHelper.generateToken({
            email: user.email,
            userId: user._id,
            firstName: user.firstName,
            lastName: user.lastName,
          }).then((token) => {
            const rUser = user.toJSON();
            delete rUser.password;

            return res
              .status(200)
              .json(
                ResponseHelper.responseMessage(
                  { token, user: rUser },
                  `success`,
                  true
                )
              );
          });
        });
        
      })
      .catch((error) => {
        return res
          .status(400)
          .json(ResponseHelper.responseMessage({}, `${error}`, false));
      });
  } catch (error) {
    return res
      .status(400)
      .json(ResponseHelper.responseMessage({}, `${error}`, false));
  }
};

module.exports = { signUp, signIn };
