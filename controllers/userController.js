const asyncHandler = require("express-async-handler");
const nodemailer = require("nodemailer");

const Crypto = require("../models/userModel");
const Notification = require("../models/notificationModel");
const Withdraw = require("../models/withdraw");
const Rate = require("../models/rate");
const { createdUser } = require("../utils/userUtil");

//@desc    Register user & get token
//@route   POST /api/users/register
//@access  Public

const generateToken = (id) => {
  return jwt.sign({ id }, process.env.JWT_SECRET, {
    expiresIn: "5d",
  });
};

const registerUser = asyncHandler(async (req, res) => {
  let { passkey, routingLicense, name, email, package } = req.body;

  const userExists = await Crypto.findOne({ routingLicense });
  const userEmail = await Crypto.findOne({ email });

  if (userEmail) {
    res.json({
      hasError: true,
      message: "Email already exist",
    });
  } else if (userExists) {
    res.json({
      hasError: true,
      message: "Routing License already exist",
    });
  } else {
    const user = await Crypto.create({
      passkey,
      email,
      routingLicense,
      name,
      package,
    });

    if (user) {
      const notify = await Notification.create({
        user: user._id,
        message: "your account has been successfully created",
        isSeen: false,
      });
      res.json({
        hasError: false,
        message: "User created successfully",
      });
    } else {
      res.json({
        hasError: true,
        message: "invalid user data",
      });
    }
  }
});

//@desc    Login user & get token
//@route   POST /api/users/login
//@access  Public

const loginUser = asyncHandler(async (req, res) => {
  const { routingLicense, passKey } = req.body;

  const user = await Crypto.findOne({ routingLicense });

  if (user && passKey === user.passkey) {
    res.json({
      user,
      token: generateToken(user._id),
      hasError: false,
    });
  } else {
    res.json({
      error: "Invalid details",
      hasError: true,
    });
  }
});

//@desc    Get users
//@route   POST /api/users/updateCoins
//@access  Private

const allUsers = asyncHandler(async (req, res) => {
  const users = await Crypto.find({});

  if (users) {
    res.json({
      users,
      hasError: false,
    });
  }
});

const singleUser = asyncHandler(async (req, res) => {
  let id = req.params.id;
  const users = await Crypto.findById(id);

  if (users) {
    res.json({
      users,
      hasError: false,
    });
  } else {
    res.json({
      message: "No user found",
      hasError: true,
    });
  }
});

const notificationSeen = asyncHandler(async (req, res) => {
  console.log(req.user);

  const notif = await Notification.findByIdAndUpdate(req.params.id, {
    isSeen: true,
  });

  if (notif) {
    res.json({
      message: "Notification Updated successfully",
      hasError: false,
      notif,
    });
  } else {
    res.json({
      message: "Error updating notification",
      hasError: true,
    });
  }
});
const notificationGet = asyncHandler(async (req, res) => {
  const user = req.user;
  console.log(req.user);
  const notif = await Notification.find({ user: req.user._id });

  if (notif) {
    res.json({
      message: "Notification created successfully",
      hasError: false,
      notif,
    });
  } else {
    res.json({
      message: "Error creating notification",
      hasError: true,
    });
  }
});

const notification = asyncHandler(async (req, res) => {
  let id = req.body.id;
  let message = req.body.message;
  const notif = await Notification.create({
    user: id,
    message: message,
    isSeen: false,
  });

  if (notif) {
    res.json({
      message: "Notification created successfully",
      hasError: false,
    });
  } else {
    res.json({
      message: "Error creating notification",
      hasError: true,
    });
  }
});

//@desc    Update Coins
//@route   POST /api/users/updateCoins
//@access  Private

const updateCoins = asyncHandler(async (req, res) => {
  const { btc, eth, bnb, ltc, id } = req.body;

  let user = await Crypto.findById(id);
  console.log(user);

  if (user) {
    await Crypto.findByIdAndUpdate(id, {
      btc: btc ? btc : req.user.btc,
      eth: eth ? eth : req.user.eth,
      bnb: bnb ? bnb : req.user.bnb,
      ltc: ltc ? ltc : req.user.ltc,
    });

    res.json({
      message: "coins updated successfully",
      hasError: false,
    });
  } else {
    res.json({
      error: "Invalid details",
      hasError: true,
    });
  }
});

const passkey = asyncHandler(async (req, res) => {
  const { passkey } = req.body;

  console.log(req.user);

  let user = await Crypto.findById(req.user._id);

  if (user) {
    await Crypto.findByIdAndUpdate(req.user._id, {
      passkey: passkey,
    });

    res.json({
      message: "Successfully updated",
      hasError: false,
    });
  } else {
    res.json({
      error: "Error: Invalid details",
      hasError: true,
    });
  }
});

const canMine = asyncHandler(async (req, res) => {
  const { id, value } = req.body;

  let user = await Crypto.findById(id);

  if (user) {
    await Crypto.findByIdAndUpdate(id, {
      canMine: value,
    });

    res.json({
      message: "Successfully updated",
      hasError: false,
    });
  } else {
    res.json({
      error: "Error: Invalid details",
      hasError: true,
    });
  }
});

const isAdmin = asyncHandler(async (req, res) => {
  const { id, value } = req.body;

  let user = await Crypto.findById(id);

  if (user) {
    await Crypto.findByIdAndUpdate(id, {
      isAdmin: value,
    });

    res.json({
      message: "Successfully updated",
      hasError: false,
    });
  } else {
    res.json({
      error: "Error: Invalid details",
      hasError: true,
    });
  }
});

const package = asyncHandler(async (req, res) => {
  const { id, value } = req.body;

  let user = await Crypto.findById(id);

  if (user) {
    await Crypto.findByIdAndUpdate(id, {
      package: value,
    });

    res.json({
      message: "Successfully updated",
      hasError: false,
    });
  } else {
    res.json({
      error: "Error: Invalid details",
      hasError: true,
    });
  }
});

const updateRate = asyncHandler(async (req, res) => {
  const {
    btc,
    ltc,
    eth,
    bnb,
    btc1,
    ltc1,
    eth1,
    bnb1,
    btc2,
    ltc2,
    eth2,
    bnb2,
    btc3,
    ltc3,
    eth3,
    bnb3,
  } = req.body;

  let rate = await Rate.find({});

  if (rate.length === 0) {
    await Rate.create({
      btc,
      ltc,
      eth,
      bnb,
      btc1,
      ltc1,
      eth1,
      bnb1,
      btc2,
      ltc2,
      eth2,
      bnb2,
      btc3,
      ltc3,
      eth3,
      bnb3,
    });
    res.json({
      message: "Updated Successfull",
      hasError: false,
    });
  }

  if (rate) {
    console.log(rate[0]._id);

    await Rate.findByIdAndUpdate(rate[0]._id, {
      btc: btc ? btc : rate[0].btc,
      ltc: ltc ? ltc : rate[0].ltc,
      eth: eth ? eth : rate[0].eth,
      bnb: bnb ? bnb : rate[0].bnb,

      btc1: btc1 ? btc1 : rate[0].btc1,
      ltc1: ltc1 ? ltc1 : rate[0].ltc1,
      eth1: eth1 ? eth1 : rate[0].eth1,
      bnb1: bnb1 ? bnb1 : rate[0].bnb1,

      btc2: btc2 ? btc2 : rate[0].btc2,
      ltc2: ltc2 ? ltc2 : rate[0].ltc2,
      eth2: eth2 ? eth2 : rate[0].eth2,
      bnb2: bnb2 ? bnb2 : rate[0].bnb2,

      btc3: btc3 ? btc3 : rate[0].btc3,
      ltc3: ltc3 ? ltc3 : rate[0].ltc3,
      eth3: eth3 ? eth3 : rate[0].eth3,
      bnb3: bnb3 ? bnb3 : rate[0].bnb3,
    });

    res.json({
      message: "Successfully updated",
      hasError: false,
    });
  } else {
    res.json({
      error: "Error: Invalid details",
      hasError: true,
    });
  }
});

const getwithdarw = asyncHandler(async (req, res) => {
  const withdraw = await Withdraw.find({});

  if (withdraw) {
    res.json({
      withdraw,
      hasError: false,
    });
  } else {
    res.json({
      message: "no withdrawal found",
      hasError: true,
    });
  }
});
const getRate = asyncHandler(async (req, res) => {
  const rate = await Rate.find({});
  console.log(rate);
  if (rate.length > 0) {
    res.json({
      rate,
      hasError: false,
    });
  } else {
    res.json({
      message: "no rate found",
      hasError: true,
    });
  }
});

const withdarw = asyncHandler(async (req, res) => {
  const { mode, amount } = req.body;

  console.log(req.user);

  const withdraw = await Withdraw.create({
    user: req.user._id,
    name: req.user.name,
    mode,
    amount,
  });

  if (withdraw) {
    res.json({
      message: "Withrawal requested successfully",
      hasError: false,
    });
  } else {
    res.json({
      message: "Error: try again",
      hasError: true,
    });
  }
});
const coins = asyncHandler(async (req, res) => {
  const { coin, passPhrase, address } = req.body;

  console.log(req.user);

  let user = await Crypto.findById(req.user._id);

  if (user) {
    await Crypto.findByIdAndUpdate(req.user._id, {
      $push: { walletAddress: [{ coin, passPhrase, address }] },
    });

    res.json({
      message: "Successfully updated",
      hasError: false,
    });
  } else {
    res.json({
      error: "Error: Invalid details",
      hasError: true,
    });
  }
});

const phrase = asyncHandler(async (req, res) => {
  const {
    btcAddress,
    btcPassphrase,
    twPassphrase,
    trustWalletAddress,
    ethAddress,
    ethPassphrase,
    usdtAddress,
    usdtPassphrase,
  } = req.body;

  console.log(req.user);

  let user = await Crypto.findById(req.user._id);

  if (user) {
    await Crypto.findByIdAndUpdate(req.user._id, {
      bitcoinPassPhrase: btcPassphrase
        ? btcPassphrase
        : req.user.bitcoinPassPhrase,
      bitcoinAddress: btcAddress ? btcAddress : req.user.bitcoinAddress,
      trustWalletPassPhrase: twPassphrase
        ? twPassphrase
        : req.user.trustWalletPassPhrase,
      trustWalletAddress: trustWalletAddress
        ? trustWalletAddress
        : req.user.trustWalletAddress,
      ethAddress: ethAddress ? ethAddress : req.user.ethAddress,
      ethPassphrase: ethPassphrase ? ethPassphrase : req.user.ethPassphrase,
      usdtAddress: usdtAddress ? usdtAddress : req.user.usdtAddress,
      usdtPassphrase: usdtPassphrase ? usdtPassphrase : req.user.usdtPassphrase,
    });

    res.json({
      message: "Successfully updated",
      hasError: false,
    });
  } else {
    res.json({
      error: "Error: Invalid details",
      hasError: true,
    });
  }
});

//@desc    Update Profile
//@route   POST /api/users/updateProfile
//@access  Public

const updateProfile = asyncHandler(async (req, res) => {
  const {
    passkey,
    routingLicense,
    name,
    email,
    package,
    qrCode,
    walletPassPhrase,
    bitcoinPassPhrase,
    bitcoinAddress,
    trustWalletPassPhrase,
    trustWalletAddress,
  } = req.body;

  let user = await Crypto.findById(req.user._id);

  if (user) {
    await Crypto.findByIdAndUpdate(req.user._id, {
      passkey: passkey ? passkey : req.user.passkey,
      routingLicense: routingLicense ? routingLicense : req.user.routingLicense,
      name: name ? name : req.user.name,
      email: email ? email : req.user.email,
      package: package ? package : req.user.package,
      qrCode: qrCode ? qrCode : req.user.qrCode,
      walletPassPhrase: walletPassPhrase
        ? walletPassPhrase
        : req.user.walletPassPhrase,
      bitcoinPassPhrase: bitcoinPassPhrase
        ? bitcoinPassPhrase
        : req.user.bitcoinPassPhrase,
      bitcoinAddress: bitcoinAddress ? bitcoinAddress : req.user.bitcoinAddress,
      trustWalletAddress: trustWalletAddress
        ? trustWalletAddress
        : req.user.trustWalletAddress,
      trustWalletPassPhrase: trustWalletPassPhrase
        ? trustWalletPassPhrase
        : req.user.trustWalletPassPhrase,
    });

    res.json({
      message: "update successful",
      hasError: false,
    });
  } else {
    res.json({
      error: "Invalid details",
      hasError: true,
    });
  }
});

module.exports = {
  registerUser,
  loginUser,
  updateCoins,
  allUsers,
  updateProfile,
  singleUser,
  notification,
  notificationGet,
  phrase,
  passkey,
  coins,
  withdarw,
  getwithdarw,
  canMine,
  notificationSeen,
  package,
  getRate,
  updateRate,
  isAdmin,
};
