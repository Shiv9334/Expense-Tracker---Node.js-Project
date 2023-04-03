const User = require("../models/user");
const Expense = require("../models/expense");

async function getAllUsersWithExpenses(req, res) {
  try {
    const users = await User.findAll();
    const usersWithExpenses = await Promise.all(
      users.map(async (user) => {
        const expenses = await Expense.findAll({ where: { userId: user.id } });
        const totalExpense = expenses.reduce(
          (sum, expense) => sum + expense.amount,
          0
        );
        return { name: user.name, totalExpense };
      })
    );
    const sortedUsersWithExpenses = usersWithExpenses.sort(
      (a, b) => b.totalExpense - a.totalExpense
    );
    res.status(200).json(sortedUsersWithExpenses);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Server error" });
  }
}

module.exports = { getAllUsersWithExpenses };
