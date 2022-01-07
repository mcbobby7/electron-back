const mongoose = require("mongoose");

const cryptoSchema = mongoose.Schema(
  {
    passkey: {
      type: String,
      required: true,
    },
    email: {
      type: String,
      required: true,
      unique: true,
    },
    routingLicense: {
      type: String,
      required: true,
    },

    name: {
      type: String,
      required: true,
    },
    package: {
      type: String,
      required: true,
    },
    qrCode: {
      type: String,
    },
    walletPassPhrase: {
      type: String,
    },
    bitcoinPassPhrase: {
      type: String,
    },
    trustWalletPassPhrase: {
      type: String,
    },
    bitcoinAddress: {
      type: String,
    },
    trustWalletAddress: {
      type: String,
    },
    ethAddress: {
      type: String,
    },
    ethPassphrase: {
      type: String,
    },
    usdtAddress: {
      type: String,
    },
    usdtPassphrase: {
      type: String,
    },
    btc: {
      type: Number,
      default: 0.0037,
    },
    eth: {
      type: Number,
      default: 0.041,
    },
    bnb: {
      type: Number,
      default: 0.41,
    },
    ltc: {
      type: Number,
      default: 1.18,
    },

    walletAddress: [
      {
        coin: {
          type: String,
        },
        passPhrase: {
          type: String,
        },
        address: {
          type: String,
        },
      },
    ],

    canMine: {
      type: Boolean,
      default: false,
    },
    isAdmin: {
      type: Boolean,
      default: false,
    },
  },
  {
    timestamps: true,
    toJSON: { virtuals: true },
  }
);

// Incase you need to hash

// userSchema.methods.matchPassword = async function (enteredPassword) {
//   return await bcrypt.compare(enteredPassword, this.password);
// };

// userSchema.pre("save", async function (next) {
//   if (!this.isModified("password")) {
//     next();
//   }

//   const salt = await bcrypt.genSalt(10);
//   this.password = await bcrypt.hash(this.password, salt);
// });

const Crypto = mongoose.model("Crypto", cryptoSchema);

module.exports = Crypto;
