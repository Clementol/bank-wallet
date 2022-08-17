const mongoose = require("mongoose");

const accountSchema = new mongoose.Schema(
  {
    accountNo: {
      type: Number,
      required: true,
      trim: true,
      unique: true,
    },
    balance: {
      type: Number,
      required: true,
      trim: true,
      default: 1000,
    },
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
    },
    active: {
      type: Boolean,
      default: true,
    },
  },
  { timestamps: true }
);

const Account = mongoose.model("Account", accountSchema);

module.exports = Account;
