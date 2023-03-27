const express = require("express");
const router = express.Router();

const loginController = require("../controller/user");
const expenseController = require("../controller/expense");

router.post("/user/login", loginController.postLoginUser);
router.get("/user/expense", expenseController.getUserExpense);
router.post("/user/expense", expenseController.postUserExpense);
router.delete("/user/delete/:id", expenseController.deleteUserExpense);

module.exports = router;
