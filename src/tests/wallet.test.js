const mongoose = require("mongoose")
const { AuthService, AccountService } = require("../services");
const { connect } = require("../database");
const Account = require("../models/account");
const User = require("../models/user");

describe("Wallet Test", () => {
  let userId, receiverId, accountNo, receiverAccNo, from, to;

  beforeAll(async () => {
    connect(process.env.MONGO_URI);
  });
  afterAll(async () => {
    await mongoose.connection.db.dropCollection("users");
    await mongoose.connection.db.dropCollection("accounts");
    await mongoose.connection.db.dropCollection("histories");
  });

  describe("Wallet", () => {
    test("Create user", async () => {
      let data = [
        {
          firstName: "clem",
          lastName: "test",
          email: "test@gmail.com",
          password: "pass123",
        },
        {
          firstName: "jack",
          lastName: "ola",
          email: "ola@gmail.com",
          password: "pass123",
        },
      ];

      let count = 0;
      for (let dt of data) {
        const user = await AuthService.createUser(dt);
        count += 1;
        if (count == 1) {
          userId = `${user.id}`;
          from = `${user.lastName} ${user.firstName}`;
          const acct = await Account.findOne({ userId });
          accountNo = acct.accountNo;
        }
        if (count == 2) {
          receiverId = `${user.id}`;
          to = `${user.lastName} ${user.firstName}`;
          const acct = await Account.findOne({ userId: receiverId });
          receiverAccNo = acct.accountNo;
        }

        expect(user.email).toEqual(dt.email);
      }
    });
  });
  describe("Get users", () => {
    test("Should get users", async () => {
      const users = await User.find({});

      expect(users.length).toBe(2);
    });
  });
  describe("Wallet", () => {
    test("fund wallet", async () => {
      try {
        const account = await AccountService.fundAccount(
          userId,
          accountNo,
          100
        );

        expect(account.balance).toBe(1100);
      } catch (error) {}
    });
    test("withdraw from wallet", async () => {
      try {
        const account = await AccountService.withDraw(userId, accountNo, 100);
        // console.log("accouont", account);
        expect(account.balance).toBe(1000);
      } catch (error) {}
    });
    test("Transfer money", async () => {
      try {
        const account = await AccountService.updateAccBalance(
          accountNo,
          receiverAccNo,
          200,
          from,
          to
        );
        expect(account).toBe(1);
      } catch (error) {}
    });
  });
});
