const mongoose = require("mongoose");

const historySchema = new mongoose.Schema(
  {
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
    },
    accountNo: {
      type: mongoose.Schema.Types.Number,
      ref: "Account",
    },
    transactions: [
      {
        senderAccNo: {
          type: Number,
        },
        from: {
          type: String,
        },
        to: {
          type: String,
        },
        amount: {
          type: Number,
          required: true,
        },
        transactionType: {
          type: String,
          required: true,
          enum: ["DEBITED", "CREDITED"],
        },
        date: {
          type: Date,
          default: Date.now
        }
      },
    ],
  },
  { timestamps: true }
);

const History = mongoose.model("History", historySchema);

module.exports = History;
