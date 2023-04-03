const UserExpense = require("../models/expense");
const User = require("../models/user");

exports.getUserExpense = (req, res, next) => {
  const userId = req.user.id;
  // console.log(userId)
  UserExpense.findAll({ where: { userId: userId } })
    .then((expense) => {
      return res.json(expense);
    })
    .catch((err) => console.log(err));
};

exports.postUserExpense = async (req, res, next) => {
  const amount = req.body.amount;
  const description = req.body.description;
  const category = req.body.category;
  const userId = req.user.id;
  try {
    const result = await UserExpense.create({
      amount: amount,
      description: description,
      category: category,
      userId: req.user.id,
    });
    await User.increment("totalExpense", {
      by: amount,
      where: { id: req.user.id },
    });

    return res.json(result);
  } catch (err) {
    console.log(err);
  }
};

exports.deleteUserExpense = async (req, res, next) => {
  try {
    const prodId = req.params.id;
    const UserId = req.user.id;
    console.log(req.user);
    const expense = await UserExpense.findOne({
      where: {
        id: prodId,
        userId: UserId,
      },
    });
    if (!expense) {
      return res.status(404).json({ message: "Expense not found" });
    }
    await expense.destroy();
    await User.decrement("totalExpense", {
      by: expense.amount,
      where: { id: req.user.id },
    });
    return res.status(204).end();
  } catch (err) {
    console.log(err);
    return res.status(500).json({ error: "Internal server error" });
  }
};

exports.getEditExpense = async (req, res, next) => {
  const prodId = req.params.id;
  const UserId = req.user.id;
  try {
    const expense = await UserExpense.findOne({
      where: {
        id: prodId,
        userId: UserId,
      },
    });
    await User.decrement("totalExpense", {
      by: expense.amount,
      where: { id: req.user.id },
    });
    return res.json(expense);
  } catch (err) {
    console.log(err);
  }
};

exports.postEditExpense = async (req, res, next) => {
  try {
    const amount = req.body.amount;
    const description = req.body.description;
    const category = req.body.category;
    const prodId = req.params.id;
    const UserId = req.user.id;
    const expense = await UserExpense.findOne({
      where: {
        id: prodId,
        userId: UserId,
      },
    });
    if (!expense) {
      return res.status(404).json({ message: "Expense not found" });
    }
    expense.amount = amount;
    expense.description = description;
    expense.category = category;
    const updatedExpense = await expense.save();
    await User.increment("totalExpense", {
      by: amount,
      where: { id: req.user.id },
    });
    return res.json(updatedExpense);
  } catch (error) {
    console.log(error);
    return res.status(500).json({ message: "Intenal server error" });
  }
};
