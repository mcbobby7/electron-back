const mongoose = require("mongoose");

const withdrawSchema = mongoose.Schema(
  {
    user: {
      type: mongoose.Schema.Types.ObjectId,
      required: true,
      ref: "User",
    },
    mode: {
      type: String,
      required: true,
    },
    name: {
      type: String,
      required: true,
    },
    amount: {
      type: String,
      required: true,
    },
  },
  {
    timestamps: true,
  }
);

const Withdraw = mongoose.model("withraw", withdrawSchema);

module.exports = Withdraw;
