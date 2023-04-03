const express = require("express");
const router = express.Router();

const premiumController = require("../controller/premium");
const userAuthenticate = require("../middleware/auth");

router.get(
  "/premium/leadershipboard",
  userAuthenticate.authenticate,
  premiumController.getAllUsersWithExpenses
);

module.exports = router;
