const express = require("express");
const router = express.Router();

const loginController = require("../controller/user");
const expenseController = require("../controller/expense");
const userAuthenticate = require("../middleware/auth");

router.post("/user/login", loginController.postLoginUser);
router.get(
  "/user/expense",
  userAuthenticate.authenticate,
  expenseController.getUserExpense
);
router.post(
  "/user/expense",
  userAuthenticate.authenticate,
  expenseController.postUserExpense
);
router.delete(
  "/user/delete/:id",
  userAuthenticate.authenticate,
  expenseController.deleteUserExpense
);

module.exports = router;
