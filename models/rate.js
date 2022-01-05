const mongoose = require("mongoose");

const rateSchema = mongoose.Schema(
  {
    btc: {
      type: String,
      required: true,
    },
    ltc: {
      type: String,
      required: true,
    },
    bnb: {
      type: String,
      required: true,
    },
    eth: {
      type: String,
      required: true,
    },

    btc1: {
      type: String,
      required: true,
    },
    ltc1: {
      type: String,
      required: true,
    },
    bnb1: {
      type: String,
      required: true,
    },
    eth1: {
      type: String,
      required: true,
    },

    btc2: {
      type: String,
      required: true,
    },
    ltc2: {
      type: String,
      required: true,
    },
    bnb2: {
      type: String,
      required: true,
    },
    eth2: {
      type: String,
      required: true,
    },

    btc3: {
      type: String,
      required: true,
    },
    ltc3: {
      type: String,
      required: true,
    },
    bnb3: {
      type: String,
      required: true,
    },
    eth3: {
      type: String,
      required: true,
    },
  },
  {
    timestamps: true,
  }
);

const Rate = mongoose.model("rate", rateSchema);

module.exports = Rate;
