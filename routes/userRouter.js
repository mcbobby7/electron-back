const router = require("express").Router();
const {
  registerUser,
  loginUser,
  updateCoins,
  allUsers,
  updateProfile,
  singleUser,
  notification,
  phrase,
  passkey,
  coins,
  withdarw,
  getwithdarw,
  canMine,
  notificationGet,
  notificationSeen,
  package,
  getRate,
  updateRate,
} = require("../controllers/userController");
const { admin, protect } = require("../middleware/authMiddleware");

router.route("/").get(allUsers);

router.route("/register").post(registerUser);

router.route("/login").post(loginUser);
router.route("/notification").post(notification);
router.route("/notificationGet").get(protect, notificationGet);
router.route("/notification/:id").get(protect, notificationSeen);
router.route("/phrase").post(protect, phrase);
router.route("/package").post(package);
router.route("/getRate").get(getRate);
router.route("/updateRate").post(updateRate);
router.route("/passkey").post(protect, passkey);
router.route("/coins").post(protect, coins);
router.route("/withdarw").post(protect, withdarw);
router.route("/getWithdarw").get(getwithdarw);
router.route("/canMine").post(canMine);

router.route("/user/:id").get(singleUser);

router.route("/updateCoins").post(protect, updateCoins);

router.route("/updateProfile").post(protect, updateProfile);

module.exports = router;
