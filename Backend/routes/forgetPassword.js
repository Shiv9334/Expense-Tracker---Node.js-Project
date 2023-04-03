const express = require("express");
const router = express.Router();

const forgerPasswordController = require("../controller/forgetPassword");

router.post(
  "/password/forgotpassword",
  forgerPasswordController.postForgetPassword
);

module.exports = router;
